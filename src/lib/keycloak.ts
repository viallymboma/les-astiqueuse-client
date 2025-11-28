"use client";
// lib/keycloak.ts
import Keycloak from "keycloak-js";

// export const KEYCLOAK_BASE = process.env.KEYCLOAK_BASE_URL!;
// export const REALM = process.env.KEYCLOAK_REALM!;
// export const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID!;
// export const CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || "";
// export const ISSUER = process.env.KEYCLOAK_ISSUER; // `${KEYCLOAK_BASE}/realms/${REALM}`;
// export const TOKEN_ENDPOINT = `${ISSUER}/protocol/openid-connect/token`;
// export const AUTH_ENDPOINT = `${ISSUER}/protocol/openid-connect/auth`;
// export const LOGOUT_ENDPOINT = `${ISSUER}/protocol/openid-connect/logout`;
// export const JWKS_URI = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/certs`;
// export const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;


const keycloak = new Keycloak({
  url: "https://www.dev.lesastiqueuses.fr/sso",
  realm: "lesastiqueuses",
  clientId: "app-client",
});

export default keycloak;

// import Keycloak from "keycloak-js";

// const keycloak = new Keycloak({
//   url: "https://www.dev.lesastiqueuses.fr/sso",
//   realm: "lesastiqueuses",
//   clientId: "app-client",
// });

// export default keycloak;