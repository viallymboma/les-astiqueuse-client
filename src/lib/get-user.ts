export function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    username: payload.preferred_username,
    email: payload.email,
    firstname: payload.given_name,
    lastname: payload.family_name,
    roles: payload.realm_access?.roles ?? [],
    raw: payload,
  };
}
