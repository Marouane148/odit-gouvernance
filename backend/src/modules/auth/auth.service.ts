import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return this.login(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid verification token');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.usersService.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: undefined
    });
    return { message: 'Email verified successfully' };
  }

  async acceptTerms(userId: string, version: string) {
    const user = await this.usersService.findOne(userId);
    user.hasAcceptedTerms = true;
    user.termsAcceptedAt = new Date();
    user.termsVersion = version;
    await this.usersService.update(user.id, {
      hasAcceptedTerms: true,
      termsAcceptedAt: new Date(),
      termsVersion: version
    });
    return { message: 'Terms accepted successfully' };
  }

  async updateTermsAcceptance(userId: string, version: string) {
    return this.acceptTerms(userId, version);
  }
}