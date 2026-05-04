import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLES, type Role } from "@/shared/constants/roles";

// Edge-runtime middleware: route-level auth + coarse role gating only.
// Resource-level authorization still happens in the service layer.

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/admin/login",
  "/departments",
  "/doctors",
  "/events",
  "/queue",
  "/pharmacy",
];

const STAFF_ROLES: Role[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.PHARMACY,
  ROLES.LAB,
];

const ADMIN_ROLES: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    const loginUrl = new URL(
      pathname.startsWith("/admin") ? "/admin/login" : "/login",
      req.url
    );
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as Role | undefined;

  if (pathname.startsWith("/admin")) {
    if (!role || !STAFF_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Tighten /admin/users and /admin/settings to admins only.
    if (
      (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/settings")) &&
      !ADMIN_ROLES.includes(role)
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (pathname.startsWith("/dashboard") && role !== ROLES.PATIENT) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, static assets, and the auth API itself.
  matcher: ["/((?!_next/|api/auth|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml).*)"],
};
