import { Role } from '../valueObjects/Role';

export interface User {
  readonly uid: string;
  readonly username: string;
  readonly role: Role;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export function usernameToSyntheticEmail(username: string): string {
  return `${username.toLowerCase()}@cricketapp.local`;
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
