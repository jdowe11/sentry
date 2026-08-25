"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      // Only redirect after hydration (avoid flicker on initial render)
      const saved = localStorage.getItem("sentry_user");
      if (!saved) router.replace("/login");
    }
  }, [user, router]);

  // Don't render the protected layout until we have a user
  if (!user) return null;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-6 bg-sentry-bg overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
