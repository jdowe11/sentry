"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      label: "Profile Settings",
      href: "/profile",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="bg-sentry-card w-full md:w-64 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/20 p-4 shrink-0">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 px-2 self-center md:self-start">
          <img src="/logo.png" alt="Sentry Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-wide text-zinc-100">Sentry</span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full text-left py-2 px-3 rounded font-medium flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-700/50 text-white font-semibold"
                    : "hover:bg-zinc-800 text-sentry-text-muted hover:text-zinc-200"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Session / Logout */}
      <div className="flex flex-col mt-6 pt-4 border-t border-black/10">
        <span className="text-[10px] text-sentry-text-muted uppercase font-bold tracking-wider mb-2 select-none">
          Logged in as:
        </span>
        <span
          className="text-sm font-mono text-zinc-300 truncate mb-4 select-all"
          title={user?.username}
        >
          @{user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="w-full text-center border border-zinc-600 hover:bg-zinc-700/40 text-zinc-300 py-2 rounded text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
