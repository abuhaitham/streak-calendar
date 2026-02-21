import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

import { defaultLocale, locales } from "./i18n/settings";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (pathname.includes(".") || pathname.startsWith("/_next")) {
    return;
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
