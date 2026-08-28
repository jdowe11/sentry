"use client";

import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return <LoadingSpinner message="Securing connection to Sentry gateway..." />;
}
