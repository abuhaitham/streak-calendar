"use client";

import { useAuth } from "@/contexts/auth-context";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "./ui/button";

/**
 * Client-side authentication wrapper component.
 * Conditionally renders content based on user's authentication state.
 * Shows a login prompt for unauthenticated users.
 */

/**
 * Props interface for the AuthenticationWrapper component
 */
interface AuthenticationWrapperProps {
  /** Content to render when user is authenticated */
  children: React.ReactNode;
}

/**
 * Wraps content with authentication checks.
 * Shows protected content for authenticated users and redirects to login for others.
 */
export function AuthenticationWrapper({ children }: AuthenticationWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">{t("signInPrompt") || "Please sign in to continue"}</h2>
        <Button asChild>
          <Link href="/login">{t("signIn") || "Sign In"}</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
