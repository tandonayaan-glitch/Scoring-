import { User } from '../../domain/entities/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
