import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const userData = response.data.user;
          const tokenData = response.data.token;
          
          // Update state synchronously
          set({
            user: userData,
            token: tokenData,
            loading: false,
            error: null,
          });
          
          // Set auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
          
          // Force persist to complete
          await new Promise(resolve => setTimeout(resolve, 50));
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      register: async (email, password, name) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', { email, password, name });
          const userData = response.data.user;
          const tokenData = response.data.token;
          
          // Update state synchronously
          set({
            user: userData,
            token: tokenData,
            loading: false,
            error: null,
          });
          
          // Set auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
          
          // Force persist to complete
          await new Promise(resolve => setTimeout(resolve, 50));
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        delete api.defaults.headers.common['Authorization'];
      },

      checkAuth: async () => {
        const token = useAuthStore.getState().token;
        if (!token) {
          set({ loading: false });
          return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ loading: true });
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.user, loading: false });
        } catch (error) {
          set({ user: null, token: null, loading: false });
          delete api.defaults.headers.common['Authorization'];
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

// Check auth on store initialization
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}

