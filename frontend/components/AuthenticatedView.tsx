"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function AuthenticatedView() {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">

      <Image src="/logo.png" alt="Sentry Logo" width={64} height={64} className="object-contain" />

      <div className="w-16 h-16 bg-[#23A55A]/10 rounded-full flex items-center justify-center border border-[#23A55A]/30">
        <svg className="w-8 h-8 text-[#23A55A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome back!</h1>
        <p className="text-sentry-text-muted text-sm mt-1">
          You&apos;re logged into your secure Sentry workspace.
        </p>
      </div>

      <div className="w-full bg-sentry-input/50 border border-black/20 rounded p-4 flex flex-col gap-3 text-sm">
        <div className="flex justify-between border-b border-black/10 pb-2">
          <span className="text-sentry-text-muted font-semibold">Username</span>
          <span className="font-mono text-zinc-200">{user.username}</span>
        </div>
        <div className="flex justify-between border-b border-black/10 pb-2">
          <span className="text-sentry-text-muted font-semibold">Display Name</span>
          <span className="text-zinc-200">{user.displayName}</span>
        </div>
        <div className="flex justify-between border-b border-black/10 pb-2">
          <span className="text-sentry-text-muted font-semibold">User ID</span>
          <span className="font-mono text-zinc-200">#{user.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sentry-text-muted font-semibold">Created At</span>
          <span className="text-zinc-300 text-xs">{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
