export function getUserIdFromProfile(profile: any): string | undefined {
  if (!profile) return undefined;
  return (
    profile.Id ||
    profile.id ||
    profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    profile["sub"] // padrão JWT
  );
}