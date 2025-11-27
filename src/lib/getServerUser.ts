// lib/getServerUser.ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { redirect } from "next/navigation";

export async function getServerUser(redirectToLogin = true) {
  const kcAccess = (await cookies()).get("kc_access")?.value;
  if (!kcAccess) {
    if (redirectToLogin) redirect(`/login`);
    return null;
  }

  try {
    const payload = await verifyAccessToken(kcAccess);
    // build user object from token claims (adapt names to your Keycloak setup)
    return {
      sub: payload.sub,
      username: payload.preferred_username ?? payload.preferredUsername,
      email: payload.email,
      name: payload.name,
      roles: ((payload.realm_access as { roles?: string[] })?.roles ?? []) as string[],
      raw: payload,
    };
  } catch (err) {
    console.log(err)
    if (redirectToLogin) redirect(`/login`);
    return null;
  }
}
