// lib/jwt.ts
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import { JWKS_URI, ISSUER } from "./keycloak";

const JWKS = createRemoteJWKSet(new URL(JWKS_URI)); // handles caching & rotation internally

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: process.env.KEYCLOAK_CLIENT_ID,
      // clockTolerance: 10, // optional tolerance
    });
    return payload;
  } catch (err) {
    throw err;
  }
}
