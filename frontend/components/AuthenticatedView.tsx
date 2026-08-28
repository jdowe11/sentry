"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMe } from "@/api/UserApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import SkeletonLoader from "./SkeletonLoader";
import Image from "next/image";

export default function AuthenticatedView() {
  const { user } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user) throw new Error("No authenticated user session.");
    return getMe(user.id);
  }, [user]);

  const { data: activeUser, isLoading } = useDataLoader(fetchProfile, [user]);

  if (!user) return null;

  const resolvedUser = activeUser || user;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
      {isLoading || !resolvedUser ? (
        <div className="flex flex-col gap-6 w-full py-4">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-zinc-800 rounded-full animate-pulse"></div>
          </div>
          <SkeletonLoader type="profile" count={1} />
          <SkeletonLoader type="text" count={1} />
        </div>
      ) : (
        <>
          <Image src="/logo.png" alt="Sentry Logo" width={64} height={64} className="object-contain" />

          <div className="w-16 h-16 bg-[#23A55A]/10 rounded-full flex items-center justify-center border border-[#23A55A]/30">
            <svg className="w-8 h-8 text-[#23A55A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome back!</h1>
            <p className="text-sentry-text-muted text-sm mt-1">
              {"You're logged into your secure Sentry workspace."}
            </p>
          </div>

          <div className="w-full bg-sentry-input/50 border border-black/20 rounded p-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sentry-text-muted font-semibold">Username</span>
              <span className="font-mono text-zinc-200">{resolvedUser.username}</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sentry-text-muted font-semibold">Display Name</span>
              <span className="text-zinc-200">{resolvedUser.displayName}</span>
            </div>
            <div className="flex justify-between border-b border-black/10 pb-2">
              <span className="text-sentry-text-muted font-semibold">User ID</span>
              <span className="font-mono text-zinc-200">#{resolvedUser.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sentry-text-muted font-semibold">Created At</span>
              <span className="text-zinc-300 text-xs">{formatDate(resolvedUser.createdAt)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
