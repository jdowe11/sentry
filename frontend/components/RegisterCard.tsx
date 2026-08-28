"use client";

import { useState } from "react";
import { User, createUser, getUserByUsername } from "@/api/UserApi";
import Button from "./Button";
import Image from "next/image";

interface RegisterCardProps {
  onRegisterSuccess: (user: User) => void;
  onToggleMode: () => void;
}

export default function RegisterCard({ onRegisterSuccess, onToggleMode }: RegisterCardProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerStep, setRegisterStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(username.trim())) {
      setErrorMsg("Username can only contain alphanumeric characters, hyphens, and underscores.");
      return;
    }

    if (username.trim().length > 32) {
      setErrorMsg("Username cannot exceed 32 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const existingUser = await getUserByUsername(username.trim());
      if (existingUser) {
        setErrorMsg("Username is already taken.");
      } else {
        setRegisterStep(2);
        setErrorMsg(null);
      }
    } catch {
      setErrorMsg("Unable to connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setErrorMsg("Display name cannot be blank.");
      return;
    }

    if (displayName.trim().length > 50) {
      setErrorMsg("Display name cannot exceed 50 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const createdUser = await createUser({
        username: username.trim(),
        displayName: displayName.trim(),
        passwordHash: password,
      });

      setSuccessMsg("Account created successfully!");
      onRegisterSuccess(createdUser);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to create account. Please check inputs.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="Sentry Logo" width={64} height={64} className="object-contain mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Create an account</h2>
        <p className="text-sentry-text-muted text-sm mt-1.5 text-center">
          Step {registerStep} of 2 - Setup your profile
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

      <form onSubmit={registerStep === 1 ? handleRegisterStep1 : handleRegisterSubmit} className="flex flex-col gap-4">
        {registerStep === 1 ? (
          /* Step 1: Credentials Setup */
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-150">
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sentry-text-muted text-[11px] font-bold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-sentry-input w-full p-2.5 rounded border border-black/30 focus:border-sentry-primary focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sentry-text-muted text-[11px] font-bold uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-sentry-input w-full p-2.5 rounded border border-black/30 focus:border-sentry-primary focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Continue
            </Button>
          </div>
        ) : (
          /* Step 2: Profile Setup */
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-150">
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
                autoFocus
                className="bg-sentry-input w-full p-2.5 rounded border border-black/30 focus:border-sentry-primary focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm transition-all"
              />
              <p className="text-[11px] text-sentry-text-muted mt-1">This is how you will be seen by others. You can use pretty much any characters.</p>
            </div>

            <div className="flex gap-3 mt-2 w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRegisterStep(1)}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </form>

      <div className="text-sm mt-1 text-center sm:text-left">
        <span className="text-sentry-text-muted text-xs">Already have an account? </span>
        <button
          onClick={onToggleMode}
          className="text-sentry-text-link hover:underline text-xs font-semibold cursor-pointer"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
