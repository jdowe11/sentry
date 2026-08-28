"use client";

import React, { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "danger-outline"
  | "success"
  | "success-outline";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({
  children,
  isLoading = false,
  variant = "primary",
  size = "md",
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  // Variant styling mapping
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-sentry-primary hover:bg-sentry-primary/85 text-white active:scale-[0.98]",
    secondary:
      "bg-zinc-700 hover:bg-zinc-600 text-zinc-200 active:scale-[0.98]",
    danger:
      "bg-[#F23F43] hover:bg-[#c93337] text-white active:scale-[0.98]",
    "danger-outline":
      "border border-[#F23F43]/40 text-[#F23F43] hover:bg-[#F23F43]/10 active:scale-[0.98]",
    success:
      "bg-[#23A55A] hover:bg-[#1a7e44] text-white active:scale-[0.98]",
    "success-outline":
      "border border-[#23A55A]/40 text-[#23A55A] bg-[#23A55A]/10 hover:bg-[#23A55A]/20 active:scale-[0.98]",
  };

  // Size styling mapping
  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-2.5 py-1 rounded text-[10px] font-bold",
    sm: "px-3 py-1.5 rounded text-xs font-bold",
    md: "px-4 py-2 rounded text-sm font-semibold",
    lg: "px-6 py-3 rounded text-base font-bold",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center transition-all cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <span className="absolute flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}

      {/* Button Content */}
      <span className={`inline-flex items-center gap-1.5 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </span>
    </button>
  );
}
