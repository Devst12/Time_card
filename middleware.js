import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  // If not logged in, kick to NextAuth login
  if (!token) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  try {
    // Call your own API to fetch user vehicle
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vehicle`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!res.ok) {
      console.warn("⚠️ Vehicle API error", res.status);
      return NextResponse.next();
    }

    const vehicles = await res.json();
    const status =
      vehicles?.length > 0 ? vehicles[0]?.user?.status : "disabled";

    // If disabled and trying to land on home `/`, bounce to /form
    if (status === "disabled" && url.pathname === "/") {
      url.pathname = "/form";
      return NextResponse.redirect(url);
    }

    // If enabled and trying to open /form, bounce back home
    if (status === "enabled" && url.pathname === "/form") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("❌ Middleware error:", err);
  }

  // Default: let it continue
  return NextResponse.next();
}

// Apply the middleware only on `/` and `/form` routes
export const config = {
  matcher: ["/", "/form"],
};