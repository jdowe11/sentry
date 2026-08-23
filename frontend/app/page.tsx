"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  // Blank while redirect resolves
  return null;
}
