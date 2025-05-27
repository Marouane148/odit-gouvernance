import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', { email, password });
          const { access_token, user } = response.data;
          
          localStorage.setItem('token', access_token);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Une erreur est survenue',
            isLoading: false,
          });
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/register', userData);
          const { access_token, user } = response.data;
          
          localStorage.setItem('token', access_token);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Une erreur est survenue',
            isLoading: false,
          });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
); 