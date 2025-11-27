// lib/guards.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasRole(payload: any, role: string) {
  const realmRoles = payload.realm_access?.roles ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRoles = Object.values(payload.resource_access ?? {}).flatMap((r: any) => r.roles ?? []);
  return realmRoles.includes(role) || clientRoles.includes(role);
}
