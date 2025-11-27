// app/api/protected/route.ts
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const access = cookie.match(/kc_access=([^;]+)/)?.[1];

  if (!access) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const payload = await verifyAccessToken(access);
    // proceed
    return NextResponse.json({ ok: true, user: payload });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
}
