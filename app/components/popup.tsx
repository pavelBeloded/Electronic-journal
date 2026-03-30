"use client";

type ResultPopupProps = {
  open: boolean;
  message: string;
  ok: boolean;
  onClose: () => void;
};

export function ResultPopup({ open, message, ok, onClose }: ResultPopupProps) {
  if (!open) return null;

  return (
    <div className="absolute top-5 right-5 ">
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border p-4 shadow-lg
        ${
          ok
            ? "border-green-500/30 bg-green-500/10 text-green-200"
            : "border-red-500/30 bg-red-500/10 text-red-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium">{message}</p>

          <button
            onClick={onClose}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
