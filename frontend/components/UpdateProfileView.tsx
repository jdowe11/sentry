"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateDisplayName, updateUsername } from "@/api/UserApi";

export default function UpdateProfileView() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState(user?.username ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !displayName.trim()) {
      setErrorMsg("Username and Display name cannot be blank.");
      setSuccessMsg(null);
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(username.trim())) {
      setErrorMsg("Username can only contain alphanumeric characters, hyphens, and underscores.");
      setSuccessMsg(null);
      return;
    }

    if (username.trim().length > 32) {
      setErrorMsg("Username cannot exceed 32 characters.");
      setSuccessMsg(null);
      return;
    }

    if (displayName.trim().length > 50) {
      setErrorMsg("Display name cannot exceed 50 characters.");
      setSuccessMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let updatedUser = user;

      if (username.trim() !== user.username) {
        updatedUser = await updateUsername(user.id, username.trim());
      }

      if (displayName.trim() !== user.displayName) {
        updatedUser = await updateDisplayName(user.id, displayName.trim());
      }

      updateUser(updatedUser);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to update profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">

      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Sentry Logo" className="w-16 h-16 object-contain mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Profile Settings</h2>
        <p className="text-sentry-text-muted text-sm mt-1.5 text-center">
          Update your public profile configuration.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#F23F43]/10 border border-[#F23F43]/30 text-[#F23F43] rounded p-3 text-xs font-semibold leading-relaxed">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-[#23A55A]/10 border border-[#23A55A]/30 text-[#23A55A] rounded p-3 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sentry-text-muted text-[11px] font-bold uppercase tracking-wider">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. jdizzle"
            required
            className="bg-sentry-input w-full p-2.5 rounded border border-black/30 focus:border-sentry-primary focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm transition-all"
          />
          <p className="text-[11px] text-sentry-text-muted mt-1">
            Alphanumeric characters, hyphens, and underscores only. Must be unique.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sentry-text-muted text-[11px] font-bold uppercase tracking-wider">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Jose GOAT"
            required
            className="bg-sentry-input w-full p-2.5 rounded border border-black/30 focus:border-sentry-primary focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm transition-all"
          />
          <p className="text-[11px] text-sentry-text-muted mt-1">
            Your public display name. Can contain any characters up to 50.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-sentry-primary hover:bg-sentry-primary-hover disabled:opacity-50 text-white py-2.5 rounded font-semibold text-sm transition-all active:scale-[0.99] cursor-pointer mt-2"
        >
          {isLoading ? "Saving changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
