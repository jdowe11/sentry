"use client";

interface UnfriendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  friendName: string;
  friendUsername: string;
}

export default function UnfriendConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  friendName,
  friendUsername,
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-bold transition-all cursor-pointer select-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-[#F23F43] hover:bg-[#c93337] text-white rounded text-xs font-bold transition-all active:scale-[0.97] cursor-pointer select-none"
          >
            {"Yes I'm sure"}
          </button>
        </div>

      </div>
    </div>
  );
}
