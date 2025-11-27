// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { LOGOUT_ENDPOINT, CLIENT_ID, CLIENT_SECRET } from "@/lib/keycloak";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  const refreshTokenMatch = cookies.match(/kc_refresh=([^;]+)/);
  const refreshToken = refreshTokenMatch?.[1];

  // Optionally call Keycloak logout endpoint to revoke session server-side
  if (refreshToken) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    });

    if (CLIENT_SECRET) params.set("client_secret", CLIENT_SECRET);

    // do not block logout on failure — best effort
    fetch(LOGOUT_ENDPOINT, { method: "POST", body: params }).catch(() => {});
  }

  const res = NextResponse.redirect("/");
  res.cookies.delete("kc_access");
  res.cookies.delete("kc_refresh");
  res.cookies.delete("kc_id");
  return res;
}
