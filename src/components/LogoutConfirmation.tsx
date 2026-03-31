import { LogOut } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed left-150 top-10 z-50 w-96 border border-gray-200 bg-white p-5 rounded-2xl shadow-xl flex flex-col gap-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-full">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{title}</p>
        </div>
      </div>

      <p className="text-xl font-semibold text-gray-800">{content}</p>
      <p className="text-sm text-gray-500 -mt-2">{message}</p>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
          onClick={onClose}
        >
          {firstBtnText}
        </button>
        <button
          className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-sm"
          onClick={onConfirm}
        >
          {secondBtnText}
        </button>
      </div>
    </div>
  );
};
