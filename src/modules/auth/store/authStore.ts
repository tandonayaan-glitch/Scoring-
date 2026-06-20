import { create } from 'zustand';
import { User } from '../domain/entities/User';
import { FirebaseAuthRepository } from '../infrastructure/FirebaseAuthRepository';
import { LoginUseCase } from '../application/useCases/LoginUseCase';
import { LogoutUseCase } from '../application/useCases/LogoutUseCase';

const authRepository = new FirebaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  initialize: () => () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  initialize: () => {
    const unsub = authRepository.onAuthStateChanged((user) => {
      set({ user, isInitialized: true });
    });
    return unsub;
  },
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUseCase.execute({ username, password });
      set({ user, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Login failed' });
      throw err;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUseCase.execute();
      set({ user: null, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Logout failed' });
    }
  },
}));
