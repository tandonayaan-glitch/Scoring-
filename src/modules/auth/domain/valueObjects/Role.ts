export const ROLES = ['VIEWER', 'SCORER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export function isValidRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}
