"use client";

import Button from "./Button";

interface UnfriendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  friendName: string;
  friendUsername: string;
  isLoading?: boolean;
}

export default function UnfriendConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  friendName,
  friendUsername,
  isLoading = false,
}: UnfriendConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-sentry-card border border-black/25 w-full max-w-[400px] rounded-lg shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150 text-left">
        
        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-black/15 pb-3 select-none">
          <div className="w-10 h-10 rounded-full bg-[#F23F43]/15 flex items-center justify-center text-[#F23F43]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235A10.107 10.107 0 0112.5 15c2.203 0 4.256.705 5.932 1.905" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-100">
              Unfriend {friendName} (<span className="font-mono">@{friendUsername}</span>)?
            </h3>
          </div>
        </div>

        {/* Modal Body Description */}
        <div className="text-xs text-sentry-text-muted leading-relaxed">
          Are you sure? This will remove them from your friends list.
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-black/10 pt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {"Yes I'm sure"}
          </Button>
        </div>

      </div>
    </div>
  );
}
