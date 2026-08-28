"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { sendFriendRequest } from "@/api/FriendRequestApi";
import Button from "./Button";
import { getErrorMessage } from "@/utils/error";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSent: () => void;
}

export default function AddFriendModal({
  isOpen,
  onClose,
  onRequestSent,
}: AddFriendModalProps) {
  const { user } = useAuth();
  const [targetUsername, setTargetUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmed = targetUsername.trim();
    if (!trimmed) {
      setStatus({ error: "Please enter a username." });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      await sendFriendRequest(user.id, trimmed);
      setStatus({ success: `Friend request sent to @${trimmed}!` });
      setTargetUsername("");
      onRequestSent();
      setTimeout(onClose, 1000);
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err);
      setStatus({ error: errMsg });
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-sentry-card border border-black/25 w-full max-w-[420px] rounded-lg shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150 text-left">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/15 pb-3">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2 select-none">
            <svg className="w-5 h-5 text-[#23A55A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A10.107 10.107 0 0112.5 15c2.203 0 4.256.705 5.932 1.905" />
            </svg>
            Add Friend
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading || !!status?.success}
            className="text-sentry-text-muted hover:text-white transition-all cursor-pointer p-1.5 hover:bg-zinc-800 rounded-full disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Description */}
        <p className="text-xs text-sentry-text-muted leading-relaxed select-none">
          You can add friends with their Sentry username.
        </p>

        {/* Status Alerts */}
        {status?.error && (
          <div className="bg-[#F23F43]/10 border border-[#F23F43]/20 text-[#FA7F82] rounded p-3.5 text-xs font-semibold animate-in fade-in duration-100 leading-relaxed flex items-start gap-2.5">
            <svg className="w-4.5 h-4.5 text-[#F23F43] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{status.error}</span>
          </div>
        )}
        {status?.success && (
          <div className="bg-[#23A55A]/10 border border-[#23A55A]/20 text-[#23A55A] rounded p-3.5 text-xs font-semibold animate-in fade-in duration-100 flex items-center gap-2.5">
            <svg className="w-4.5 h-4.5 text-[#23A55A] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{status.success}</span>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-sentry-text-muted uppercase tracking-wider select-none">
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. jdizzle"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              disabled={isLoading || !!status?.success}
              className="w-full bg-sentry-input border border-black/20 text-zinc-200 placeholder:text-zinc-650 rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-sentry-primary transition-all disabled:opacity-60"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 justify-end border-t border-black/10 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isLoading || !!status?.success}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="sm"
              isLoading={isLoading}
              disabled={!!status?.success}
            >
              Send Friend Request
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
