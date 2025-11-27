// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { TOKEN_ENDPOINT, CLIENT_ID, CLIENT_SECRET } from "@/lib/keycloak";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  const refreshTokenMatch = cookies.match(/kc_refresh=([^;]+)/);
  const refreshToken = refreshTokenMatch?.[1];

  if (!refreshToken) {
    return NextResponse.json({ ok: false, error: "no_refresh_token" }, { status: 401 });
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  });

  if (CLIENT_SECRET) params.set("client_secret", CLIENT_SECRET);

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    body: params,
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    console.error("Refresh failed:", txt);
    // clear cookies
    const res = NextResponse.json({ ok: false }, { status: 401 });
    res.cookies.delete("kc_access");
    res.cookies.delete("kc_refresh");
    res.cookies.delete("kc_id");
    return res;
  }

  const tokens = await tokenRes.json();
  const res = NextResponse.json({ ok: true });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  res.cookies.set("kc_access", tokens.access_token, { ...cookieOptions, maxAge: tokens.expires_in });
  res.cookies.set("kc_refresh", tokens.refresh_token, { ...cookieOptions, maxAge: tokens.refresh_expires_in ?? 60 * 60 * 24 * 30 });

  if (tokens.id_token) {
    res.cookies.set("kc_id", tokens.id_token, { ...cookieOptions, maxAge: tokens.expires_in });
  }

  return res;
}
