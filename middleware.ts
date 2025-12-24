import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Admin sayfasına erişmeye çalışıyorsa ve rolü ADMIN değilse
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Kullanıcı giriş yapmış olmalı
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};