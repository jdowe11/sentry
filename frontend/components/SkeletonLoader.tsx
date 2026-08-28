"use client";

interface SkeletonLoaderProps {
  type?: "list" | "card" | "text" | "profile";
  count?: number;
  className?: string;
}

export default function SkeletonLoader({
  type = "list",
  count = 3,
  className = "",
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  return (
    <div className={`flex flex-col gap-3 w-full select-none ${className}`}>
      
      {/* 1. List Skeleton (Mocking Friends/Requests list items) */}
      {type === "list" && (
        <div className="flex flex-col gap-2">
          {items.map((_, idx) => (
            <div
              key={idx}
              className="bg-sentry-input/20 border border-black/5 rounded p-4 flex items-center justify-between animate-pulse"
            >
              <div className="flex flex-col gap-2 w-48">
                <div className="h-4 bg-zinc-700/50 rounded w-full"></div>
                <div className="h-3 bg-zinc-800/50 rounded w-3/4"></div>
              </div>
              <div className="h-8 bg-zinc-800/60 rounded w-16"></div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Card Skeleton (Mocking grid cards or chat rooms) */}
      {type === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((_, idx) => (
            <div
              key={idx}
              className="bg-sentry-card border border-black/15 rounded-lg p-5 flex flex-col gap-4 animate-pulse shadow-md"
            >
              <div className="h-5 bg-zinc-700/50 rounded w-1/2"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3.5 bg-zinc-800/50 rounded w-full"></div>
                <div className="h-3.5 bg-zinc-800/50 rounded w-5/6"></div>
              </div>
              <div className="h-7 bg-zinc-800/60 rounded w-20 mt-2"></div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Text Line Skeleton (Mocking sentences/paragraphs) */}
      {type === "text" && (
        <div className="flex flex-col gap-2.5">
          {items.map((_, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 animate-pulse">
              <div className="h-3.5 bg-zinc-700/40 rounded w-full"></div>
              <div className="h-3.5 bg-zinc-700/40 rounded w-11/12"></div>
              <div className="h-3.5 bg-zinc-800/40 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Profile / Hero Skeleton (Mocking header details) */}
      {type === "profile" && (
        <div className="flex items-center gap-4 bg-sentry-card p-6 border border-black/15 rounded-lg animate-pulse">
          <div className="w-16 h-16 rounded-full bg-zinc-700/50 shrink-0"></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-5 bg-zinc-700/50 rounded w-1/3"></div>
            <div className="h-3.5 bg-zinc-800/50 rounded w-1/2"></div>
          </div>
        </div>
      )}

    </div>
  );
}
