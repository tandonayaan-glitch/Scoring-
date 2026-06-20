import { IAuthRepository } from '../ports/IAuthRepository';

export class LogoutUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}
  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
