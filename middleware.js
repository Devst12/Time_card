import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const url = req.nextUrl.clone()

  if (!token) {
    url.pathname = "/auth"
    return NextResponse.redirect(url)
  }

  try {
    const gmail = token?.email
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/vehicle?gmail=${gmail}`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    })

    if (!res.ok) return NextResponse.next()

    const result = await res.json()
    const vehicles = result?.data || []
    const status = vehicles.length > 0 ? vehicles[0]?.user?.status : "disabled"

    if (status !== "enabled" && url.pathname !== "/form") {
      url.pathname = "/form"
      return NextResponse.redirect(url)
    }

    if (status === "enabled" && url.pathname === "/form") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  } catch (err) {
    console.error("❌ Middleware error:", err)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|auth|static|favicon.ico).*)"],
}
