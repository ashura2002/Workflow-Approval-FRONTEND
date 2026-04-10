import React, { type ReactNode } from "react";

export interface ButtonData {
  text: string;
  icons?: ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonData> = ({ text, icons, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium hover:bg-blue-200 active:scale-95 transition-all cursor-pointer border-none"
    >
      <span className="text-base leading-none">{icons}</span>
      {text}
    </button>
  );
};
