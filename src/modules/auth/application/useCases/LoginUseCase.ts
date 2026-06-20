import { User, isValidUsername } from '../../domain/entities/User';
import { IAuthRepository, LoginCredentials } from '../ports/IAuthRepository';

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    const { username, password } = credentials;
    if (!isValidUsername(username)) throw new Error('Invalid username');
    if (!password || password.length < 6) throw new Error('Invalid password');
    return this.authRepository.login({ username: username.trim(), password });
  }
}
