import { fetchClient } from '@/lib/api-client';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (credentials: RegisterCredentials): Promise<void> => {
    return fetchClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  me: async (): Promise<User> => {
    return fetchClient('/users/me', {
      method: 'GET'
    });
  },

  logout: async (): Promise<void> => {
    return fetchClient('/auth/logout', {
      method: 'POST',
    });
  },

  resendVerification: async (email: string): Promise<void> => {
    return fetchClient('/auth/resend-email-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    return fetchClient('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (userId: string, token: string, newPassword: string): Promise<void> => {
    return fetchClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ userId, token, newPassword }),
    });
  }
};
