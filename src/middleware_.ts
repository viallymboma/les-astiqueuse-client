import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/silent-check-sso.html"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Middleware cannot read localStorage — instead we use a "pseudo" guard:
  const hasClientAuthHint = req.cookies.get("kc_client_authenticated");

  if (!hasClientAuthHint) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};


// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyAccessToken } from "./lib/jwt";

// const PUBLIC_PATHS = ["/login", "/api/auth", "/api/public", "/_next", "/favicon.ico"];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Skip public assets and API endpoints you want open
//   if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
//     return NextResponse.next();
//   }

//   const accessCookie = req.cookies.get("kc_access")?.value;

//   if (!accessCookie) {
//     // no token -> redirect to Keycloak auth start page or local login
//     const loginUrl = `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`;
//     return NextResponse.redirect(new URL(loginUrl, req.url));
//   }

//   try {
//     // Verify token signature + claims
//     await verifyAccessToken(accessCookie);
//     return NextResponse.next();
//   } catch (err) {
//     // if verification fails (expired or bad), try server refresh endpoint
//     // We can call our /api/auth/refresh here (Edge can fetch)
//     try {
//       const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh`, {
//         method: "GET",
//         headers: {
//           cookie: `kc_refresh=${req.cookies.get("kc_refresh")?.value ?? ""}`,
//         },
//       });

//       if (refreshRes.ok) {
//         // after refresh, continue to request (the refresh route set new cookies)
//         return NextResponse.next();
//       } else {
//         const loginUrl = `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`;
//         return NextResponse.redirect(new URL(loginUrl, req.url));
//       }
//     } catch (e) {
//       const loginUrl = `/login?redirect=${encodeURIComponent(req.nextUrl.pathname)}`;
//       return NextResponse.redirect(new URL(loginUrl, req.url));
//     }
//   }
// }

// export const config = {
//   matcher: ["/((?!_next/image|_next/static|favicon.ico).*)"], // adjust as needed
// };
