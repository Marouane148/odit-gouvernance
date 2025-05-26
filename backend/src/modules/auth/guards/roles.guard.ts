import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Vérifier si l'utilisateur existe et a un tableau de rôles (qui peut être vide)
    if (!user || !user.roles || !Array.isArray(user.roles)) {
       // On peut autoriser si aucun rôle requis n'est défini et que l'utilisateur est authentifié,
       // mais ici le garde est appliqué donc des rôles sont requis.
       // Si user.roles n'est pas un tableau, c'est un problème.
       throw new ForbiddenException('Accès non autorisé ou rôles utilisateur non définis ou mal formatés');
    }

    // Vérifier si l'un des rôles de l'utilisateur (par leur nom) est inclus dans les rôles requis
    const hasRequiredRole = requiredRoles.some((requiredRole) =>
      user.roles.some(userRole => userRole.name === requiredRole) // Vérifier le nom du rôle
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('Vous n\'avez pas les droits nécessaires');
    }

    return true;
  }
}