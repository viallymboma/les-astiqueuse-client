// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { AUTH_ENDPOINT, CLIENT_ID, REDIRECT_URI } from "@/lib/keycloak";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get("redirect") || "/";

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    state: redirectTo,
    // If you want to require login, add 'prompt=login'
  });

  const authUrl = `${AUTH_ENDPOINT}?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
