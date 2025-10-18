import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  grade: string;
  goals: string[];
  emailVerifiedAt?: Date;
  roles: string[];
  subscriptionStatus: string;
  currentLevel?: string | number;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),

      // In your auth store, modify the login function:
      login: async (emailOrPhone: string, password: string) => {
        set({ isLoading: true });
        try {
          const loginData = emailOrPhone.includes('@')
            ? { email: emailOrPhone, password }
            : { phone: emailOrPhone, password };

          console.log('🔐 Login request data:', loginData);
          const response = await apiClient.login(loginData) as any;
          console.log('🔐 Login API response:', response); // ← ADD THIS

          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          console.error('🔐 Login error:', error);
          set({ user: null, isAuthenticated: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // Try to refresh token to check if user is still authenticated
          const response = await apiClient.refreshToken() as any;
          set({ user: response.user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
