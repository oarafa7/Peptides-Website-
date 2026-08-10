import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function getLocaleAndRest(pathname: string) {
  const match = pathname.match(/^\/(en|ar)(\/.*)?$/);
  return {
    locale: match?.[1] ?? routing.defaultLocale,
    rest: match?.[2] ?? "/",
  };
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { locale, rest } = getLocaleAndRest(pathname);

  const isAdminRoute = rest.startsWith("/admin");
  const isAccountRoute = rest.startsWith("/account");

  if (isAdminRoute || isAccountRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
