"use client";

import { IntlProvider } from "@/components/intl-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { AbstractIntlMessages } from "next-intl";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

/**
 * Root providers component that wraps the application with necessary context providers:
 * - Internationalization (next-intl)
 * - Authentication (Custom password-based auth)
 * - State Management (Convex)
 * - Theme Management (next-themes)
 */

// Initialize Convex client for real-time state management
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. " +
    "Copy .env.example to .env.local and run `npx convex dev` to populate it."
  );
}
const convex = new ConvexReactClient(convexUrl);

interface ProvidersProps extends PropsWithChildren {
  locale: string; // Current language/locale code
  messages: AbstractIntlMessages; // Translation messages for the current locale
}

/**
 * Providers component that establishes the context hierarchy:
 * 1. IntlProvider - Handles translations and localization
 * 2. AuthProvider - Manages password-based authentication
 * 3. ConvexProvider - Provides Convex state management
 * 4. ThemeProvider - Manages light/dark theme preferences
 */
export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <AuthProvider>
        <ConvexProvider client={convex}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ConvexProvider>
      </AuthProvider>
    </IntlProvider>
  );
}
