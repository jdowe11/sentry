"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RegisterCard from "@/components/RegisterCard";

export default function RegisterPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sentry-bg p-6">
      <RegisterCard
        onRegisterSuccess={(newUser) => {
          login(newUser);
          router.push("/home");
        }}
        onToggleMode={() => router.push("/login")}
      />
    </div>
  );
}
