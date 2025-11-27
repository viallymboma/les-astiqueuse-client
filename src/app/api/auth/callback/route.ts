// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { TOKEN_ENDPOINT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/lib/keycloak";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "/";

  if (!code) return NextResponse.redirect("/login?error=missing_code");

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
  });

  if (CLIENT_SECRET) params.set("client_secret", CLIENT_SECRET);

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    body: params,
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    console.error("Token exchange failed:", txt);
    return NextResponse.redirect("/login?error=token_exchange_failed");
  }

  const tokens = await tokenRes.json();

  const res = NextResponse.redirect(state);

  // set cookies - httpOnly + secure
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  // access token: short-lived
  res.cookies.set("kc_access", tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in, // seconds
  });

  // refresh token: longer
  // if Keycloak returned refresh_expires_in, use it; else set longer maxAge
  res.cookies.set("kc_refresh", tokens.refresh_token, {
    ...cookieOptions,
    maxAge: tokens.refresh_expires_in ?? 60 * 60 * 24 * 30, // fallback
  });

  // optionally store id_token if needed for session info
  if (tokens.id_token) {
    res.cookies.set("kc_id", tokens.id_token, {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    });
  }

  return res;
}
