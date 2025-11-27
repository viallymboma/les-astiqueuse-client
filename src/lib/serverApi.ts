// lib/serverApi.ts
export async function serverFetchWithAuth(req: Request, input: RequestInfo, init?: RequestInit) {
  const cookie = req.headers.get("cookie") || "";
  const access = cookie.match(/kc_access=([^;]+)/)?.[1];

  const headers = new Headers(init?.headers || {});
  if (access) headers.set("Authorization", `Bearer ${access}`);

  return fetch(input, { ...init, headers });
}
