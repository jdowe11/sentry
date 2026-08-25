"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Width tracking state
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isMobile, setIsMobile] = useState(false);

  // Handle checking for mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentWidth = isMobile ? 80 : sidebarWidth; // This could be improved in the future.
  const isCollapsed = currentWidth < 160;

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
    {
      label: "Friends List",
      href: "/friends",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A10.107 10.107 0 0112.5 15c2.203 0 4.256.705 5.932 1.905" />
        </svg>
      ),
    },
  ];

  // Mouse event handlers for resizing
  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    if (isMobile) return;
    mouseDownEvent.preventDefault();
    const startWidth = sidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const deltaX = mouseMoveEvent.clientX - startX;
      let newWidth = startWidth + deltaX;

      // Minimum width = 82px
      // Maximum width = 260px
      const MIN_WIDTH = 82;
      const MAX_WIDTH = 260;

      if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
      if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

      setSidebarWidth(newWidth);
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <aside
      className="bg-sentry-card relative flex flex-col justify-between border-r border-black/20 p-4 shrink-0 overflow-hidden"
      style={{ width: `${currentWidth}px` }}
    >
      
      {/* Resizer handle (Desktop only) with a visible dark boundary line */}
      {!isMobile && (
        <div
          onMouseDown={startResizing}
          className="hidden md:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize bg-zinc-950/40 border-r border-zinc-800/80 hover:bg-sentry-primary/60 transition-all select-none z-50 animate-in fade-in duration-100"
          title="Drag to resize sidebar"
        />
      )}

      <div className="flex flex-col overflow-hidden">
        
        {/* Logo - Always left aligned & prevents text wrapping */}
        <div className="flex items-center mb-6 px-2 justify-start overflow-hidden whitespace-nowrap">
          <Image src="/logo.png" alt="Sentry Logo" width={32} height={32} className="object-contain shrink-0" />
          <span className={`font-bold text-lg tracking-wide text-zinc-100 whitespace-nowrap truncate transition-all duration-200 ${
            isCollapsed ? "ml-0 opacity-0 max-w-0" : "ml-3 opacity-100 max-w-[200px]"
          }`}>
            Sentry
          </span>
        </div>

        {/* Nav Items - Always left aligned & prevents text wrapping */}
        <nav className="flex flex-col gap-1 w-full overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full py-2 px-3 rounded font-medium flex items-center transition-all cursor-pointer justify-start text-left overflow-hidden whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-700/50 text-white font-semibold"
                    : "hover:bg-zinc-800 text-sentry-text-muted hover:text-zinc-200"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                <span className={`whitespace-nowrap truncate transition-all duration-200 ${
                  isCollapsed ? "ml-0 opacity-0 max-w-0" : "ml-3 opacity-100 max-w-[200px]"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Session / Logout - Always left aligned & prevents text wrapping */}
      <div className="flex flex-col mt-6 pt-4 border-t border-black/10 overflow-hidden whitespace-nowrap">
        
        <div className={`flex flex-col overflow-hidden whitespace-nowrap transition-all duration-200 ${
          isCollapsed ? "opacity-0 max-h-0 mb-0" : "opacity-100 max-h-[80px] mb-4"
        }`}>
          <span className="text-[10px] text-sentry-text-muted uppercase font-bold tracking-wider mb-2 select-none whitespace-nowrap truncate">
            Logged in as:
          </span>
          <span
            className="text-sm font-mono text-zinc-300 truncate select-all whitespace-nowrap"
            title={user?.username}
          >
            @{user?.username}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start border border-zinc-600 hover:bg-zinc-700/40 text-zinc-300 py-2 px-3 rounded text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer overflow-hidden whitespace-nowrap"
          title="Log Out"
        >
          {/* Logout icon stays left-aligned */}
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className={`whitespace-nowrap truncate transition-all duration-200 ${
            isCollapsed ? "ml-0 opacity-0 max-w-0" : "ml-3 opacity-100 max-w-[200px]"
          }`}>
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
