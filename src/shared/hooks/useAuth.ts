import { useAuthStore } from '@/modules/auth/store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  return { user, isInitialized, isAuthenticated: !!user };
}
