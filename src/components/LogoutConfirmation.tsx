import { LogOut } from "lucide-react";
import { useEffect } from "react";

interface LogoutProps {
  title: string;
  content: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  firstBtnText: string;
  secondBtnText: string;
  isOpen: boolean;
}

export const LogoutConfirmation: React.FC<LogoutProps> = ({
  title,
  content,
  message,
  onClose,
  onConfirm,
  firstBtnText,
  secondBtnText,
  isOpen,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in h-screen"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed right-1.5 z-50 flex items-center justify-center  p-4 overflow-y-auto">
        <div
          className="
          relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          {/* Content */}
          <div className="p-5 sm:p-6">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <h2
                id="logout-title"
                className="text-lg sm:text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            </div>

            {/* Content and message */}
            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              {content}
            </p>
            <p className="text-sm text-gray-500 mb-6">{message}</p>

            {/* Buttons - responsive layout */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                {firstBtnText}
              </button>
              <button
                onClick={onConfirm}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
              >
                {secondBtnText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in, .animate-scale-in {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};
