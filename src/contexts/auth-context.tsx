"use client";

import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import bcrypt from "bcryptjs";

/**
 * Hardcoded encrypted password hash for "41926124"
 * Generated using bcrypt with salt rounds of 10
 */
const HARDCODED_PASSWORD_HASH = "$2b$10$Mxq8/Khsa/jldT70F4Kn9eEEitOxjHciAdsFD0mnw8Dd9WOoKkOm6";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider that manages login state using localStorage
 * and bcrypt for password verification
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * Attempts to log in with the provided password
   * Compares the password against the hardcoded hash
   */
  const login = async (password: string): Promise<boolean> => {
    try {
      const isValid = await bcrypt.compare(password, HARDCODED_PASSWORD_HASH);
      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  /**
   * Logs out the user and clears authentication state
   */
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

