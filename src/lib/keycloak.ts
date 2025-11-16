import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://www.dev.lesastiqueuses.fr/sso",
  realm: "lesastiqueuses",
  clientId: "app-client",
});

export default keycloak;