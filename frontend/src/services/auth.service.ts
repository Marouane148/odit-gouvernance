import api from '@/lib/api';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: any;
  error?: string;
}

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', { email, password });
      this.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw this.handleError(error);
    }
  }

  public async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      this.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      throw this.handleError(error);
    }
  }

  public async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      this.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur de rafraîchissement du token:', error);
      throw this.handleError(error);
    }
  }

  public async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Erreur de récupération du profil:', error);
      throw this.handleError(error);
    }
  }

  public async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    try {
      const response = await api.patch('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur de mise à jour du profil:', error);
      throw this.handleError(error);
    }
  }

  public async forgotPassword(email: string) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Erreur de demande de réinitialisation du mot de passe:', error);
      throw this.handleError(error);
    }
  }

  public async resetPassword(token: string, password: string) {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error: any) {
      console.error('Erreur de réinitialisation du mot de passe:', error);
      throw this.handleError(error);
    }
  }

  public async getTerms() {
    try {
      const response = await api.get('/auth/terms');
      return response.data;
    } catch (error: any) {
      console.error('Erreur de récupération des conditions:', error);
      throw this.handleError(error);
    }
  }

  public async acceptTerms(version: string) {
    try {
      const response = await api.post('/auth/accept-terms', { version });
      return response.data;
    } catch (error: any) {
      console.error('Erreur d\'acceptation des conditions:', error);
      throw this.handleError(error);
    }
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private setTokens(data: { access_token: string; refresh_token: string }) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    this.startRefreshTokenTimer();
  }

  private startRefreshTokenTimer() {
    // Rafraîchir le token 5 minutes avant son expiration
    const expiresIn = 55 * 60 * 1000; // 55 minutes
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken();
    }, expiresIn);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: any): Error {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui est en dehors de la plage 2xx
      const message = error.response.data?.message || error.response.data?.error || 'Une erreur est survenue';
      return new Error(message);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return new Error('Aucune réponse du serveur. Veuillez vérifier votre connexion internet.');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return new Error('Une erreur est survenue lors de la configuration de la requête.');
    }
  }
}

export const authService = AuthService.getInstance(); 