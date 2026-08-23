"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginCard from "@/components/LoginCard";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sentry-bg p-6">
      <LoginCard
        onLoginSuccess={(loggedInUser) => {
          login(loggedInUser);
          router.push("/home");
        }}
        onToggleMode={() => router.push("/register")}
      />
    </div>
  );
}
