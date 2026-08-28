export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed && typeof parsed === "object" && parsed !== null && "message" in parsed) {
        return String(parsed.message);
      }
    } catch {
      return err.message;
    }
  }
  return String(err || "An unexpected error occurred.");
}
