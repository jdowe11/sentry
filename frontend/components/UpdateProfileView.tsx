"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateDisplayName, updateUsername } from "@/api/UserApi";
import { User } from "@/api/UserApi";
import ConfirmModal from "@/components/ConfirmModal";

// ─────────────────────────────────────────────
// Reusable inline-edit field
// ─────────────────────────────────────────────
function InlineEditField({
  label,
  currentValue,
  hint,
  onSave,
  validate,
  confirmPrompt,
}: {
  label: string;
  currentValue: string;
  hint?: string;
  onSave: (newValue: string) => Promise<void>;
  validate?: (value: string) => string | null;
  confirmPrompt?: { title: string; description?: string };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setDraft(currentValue);
    setError(null);
    setIsEditing(true);
  };

  // Only fires when focus genuinely leaves (not when clicking Save/Cancel,
  // since those buttons use onMouseDown + preventDefault)
  const handleBlur = () => {
    if (!showConfirm) handleCancel();
  };

  const handleCancel = () => {
    setDraft(currentValue);
    setIsEditing(false);
    setError(null);
    setShowConfirm(false);
  };

  // Called when Save is clicked — runs validation, then either opens
  // the confirmation modal or proceeds directly with the API call
  const handleSaveClick = () => {
    const trimmed = draft.trim();

    if (validate) {
      const validationError = validate(trimmed);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (trimmed === currentValue) {
      setIsEditing(false);
      return;
    }

    if (confirmPrompt) {
      setShowConfirm(true);
    } else {
      executeSave(trimmed);
    }
  };

  const executeSave = async (value: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await onSave(value);
      setIsEditing(false);
      setShowConfirm(false);
    } catch (err: unknown) {
      setShowConfirm(false);
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation modal (portal-like, rendered above everything) */}
      {showConfirm && confirmPrompt && (
        <ConfirmModal
          title={confirmPrompt.title}
          description={confirmPrompt.description}
          isLoading={isLoading}
          onConfirm={() => executeSave(draft.trim())}
          onCancel={() => {
            setShowConfirm(false);
            // Re-focus the input so the field stays in editing mode
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        />
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sentry-text-muted text-[11px] font-bold uppercase tracking-wider select-none">
          {label}
        </label>

        <input
          ref={inputRef}
          type="text"
          value={isEditing ? draft : currentValue}
          readOnly={!isEditing}
          onFocus={startEditing}
          onBlur={isEditing ? handleBlur : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveClick();
            if (e.key === "Escape") handleCancel();
          }}
          className={`w-full px-3 py-2 rounded border text-sm transition-all duration-150 outline-none ${
            isEditing
              ? "bg-sentry-input border-sentry-primary text-zinc-100"
              : "bg-transparent border-transparent text-zinc-400 cursor-pointer hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/30"
          }`}
        />

        {error && (
          <p className="text-[#F23F43] text-[11px] font-semibold mt-0.5">{error}</p>
        )}

        {hint && !isEditing && (
          <p className="text-[11px] text-sentry-text-muted">{hint}</p>
        )}

        {isEditing && (
          <div className="flex gap-2 justify-end mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCancel}
              disabled={isLoading}
              className="px-3 py-1 rounded text-xs font-semibold border border-[#F23F43]/40 text-[#F23F43] hover:bg-[#F23F43]/10 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSaveClick}
              disabled={isLoading}
              className="px-3 py-1 rounded text-xs font-semibold border border-[#23A55A]/40 text-[#23A55A] bg-[#23A55A]/10 hover:bg-[#23A55A]/20 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.97]"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Profile settings page
// ─────────────────────────────────────────────
export default function UpdateProfileView() {
  const { user, updateUser } = useAuth();
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  if (!user) return null;

  const handleSaveUsername = async (newUsername: string) => {
    const updated: User = await updateUsername(user.id, newUsername);
    updateUser(updated);
    flashSuccess();
  };

  const handleSaveDisplayName = async (newDisplayName: string) => {
    const updated: User = await updateDisplayName(user.id, newDisplayName);
    updateUser(updated);
    flashSuccess();
  };

  const flashSuccess = () => {
    setGlobalSuccess("Saved!");
    setTimeout(() => setGlobalSuccess(null), 2500);
  };

  const validateUsername = (val: string): string | null => {
    if (!val) return "Username cannot be blank.";
    if (val.length > 32) return "Username cannot exceed 32 characters.";
    if (!/^[a-zA-Z0-9-_]+$/.test(val))
      return "Only alphanumeric characters, hyphens, and underscores allowed.";
    return null;
  };

  const validateDisplayName = (val: string): string | null => {
    if (!val) return "Display name cannot be blank.";
    if (val.length > 50) return "Display name cannot exceed 50 characters.";
    return null;
  };

  return (
    <div className="bg-sentry-card w-full max-w-[480px] p-8 rounded-lg shadow-lg border border-black/20 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">

      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="Sentry Logo" className="w-16 h-16 object-contain mb-3" />
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Profile Settings</h2>
        <p className="text-sentry-text-muted text-sm mt-1.5 text-center">
          Click a field to edit it.
        </p>
      </div>

      {globalSuccess && (
        <div className="bg-[#23A55A]/10 border border-[#23A55A]/30 text-[#23A55A] rounded p-2.5 text-xs font-semibold text-center animate-in fade-in duration-150">
          ✓ {globalSuccess}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <InlineEditField
          label="Username"
          currentValue={user.username}
          hint="Alphanumeric characters, hyphens, and underscores only. Must be unique."
          onSave={handleSaveUsername}
          validate={validateUsername}
          confirmPrompt={{
            title: "Are you sure?",
            description: "Changing your username cannot be undone. Others may not be able to find you by your old username.",
          }}
        />

        <InlineEditField
          label="Display Name"
          currentValue={user.displayName}
          hint="Your public display name. Can contain any characters up to 50."
          onSave={handleSaveDisplayName}
          validate={validateDisplayName}
        />
      </div>
    </div>
  );
}
