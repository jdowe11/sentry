"use client";

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  message = "Loading Sentry secure nodes...",
  fullPage = false,
}: LoadingSpinnerProps) {
  const containerClass = fullPage
    ? "fixed inset-0 bg-sentry-bg/80 backdrop-blur-sm z-50"
    : "w-full h-full min-h-[300px]";

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${containerClass} animate-in fade-in duration-200`}>
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="w-12 h-12 rounded-full border-[3px] border-zinc-800 animate-pulse"></div>
        {/* Spinning indicator */}
        <div className="absolute w-12 h-12 rounded-full border-[3px] border-t-sentry-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Small center pulse dot */}
        <div className="absolute w-3 h-3 rounded-full bg-sentry-primary animate-ping"></div>
      </div>
      
      {message && (
        <span className="text-xs font-bold text-sentry-text-muted uppercase tracking-widest select-none animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
}
