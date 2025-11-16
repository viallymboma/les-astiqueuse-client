import keycloak from "./keycloak";

export function setupKeycloakEvents() {
  keycloak.onAuthSuccess = () => {
    localStorage.setItem("access_token", keycloak.token!);
    localStorage.setItem("refresh_token", keycloak.refreshToken!);
  };

  keycloak.onAuthRefreshSuccess = () => {
    localStorage.setItem("access_token", keycloak.token!);
    localStorage.setItem("refresh_token", keycloak.refreshToken!);
  };
}