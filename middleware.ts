import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Expose the incoming pathname to server components so the root layout can
// conditionally render public chrome (header/footer) for /admin/* vs public.
export function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
