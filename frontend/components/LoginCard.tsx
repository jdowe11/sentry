"use client";

import { useState } from "react";
import { User } from "@/api/UserApi";
import { loginUser } from "@/api/LoginApi";

interface LoginCardProps {
  onLoginSuccess: (user: User) => void;
  onToggleMode: () => void;
}

export default function LoginCard({ onLoginSuccess, onToggleMode }: LoginCardProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const authenticatedUser = await loginUser(username.trim(), password);
      onLoginSuccess(authenticatedUser);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Unable to connect to backend server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col gap-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Sentry Logo" className="w-16 h-16 object-contain mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome back!</h2>
        <p className="text-sentry-text-muted text-sm mt-1.5 text-center">
          We're so excited to see you again!
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#F23F43]/10 border border-[#F23F43]/30 text-[#F23F43] rounded p-3 text-xs font-semibold leading-relaxed">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

        <button
          type="submit"
          disabled={isLoading}
          className="bg-sentry-primary hover:bg-sentry-primary-hover disabled:opacity-50 text-white py-2.5 rounded font-semibold text-sm transition-all active:scale-[0.99] cursor-pointer mt-2"
        >
          {isLoading ? "Please wait..." : "Log In"}
        </button>
      </form>

      <div className="text-sm mt-1 text-center sm:text-left">
        <span className="text-sentry-text-muted text-xs">Need an account? </span>
        <button
          onClick={onToggleMode}
          className="text-sentry-text-link hover:underline text-xs font-semibold cursor-pointer"
        >
          Register
        </button>
      </div>
    </div>
  );
}
