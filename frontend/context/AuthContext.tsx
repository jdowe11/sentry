"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/api/UserApi";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sentry_user");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("sentry_user");
      }
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("sentry_user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sentry_user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("sentry_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
