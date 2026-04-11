import React, { type ReactNode } from "react";

export interface ButtonData {
  text: string;
  icons?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonData> = ({
  text,
  icons,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
}) => {
  const base =
    "inline-flex items-center gap-2 font-medium rounded-lg border transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-700 focus-visible:ring-zinc-400",
    secondary:
      "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 focus-visible:ring-zinc-300",
    ghost:
      "bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-zinc-300",
    danger:
      "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 focus-visible:ring-red-300",
  };

  const sizes = {
    sm: "h-7 px-3 text-[12px] gap-1.5",
    md: "h-9 px-4 text-[13px] gap-2",
    lg: "h-10 px-5 text-[14px] gap-2",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-[18px] h-[18px]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
    >
      {loading ? (
        <span
          className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin opacity-60`}
        />
      ) : icons ? (
        <span
          className={`${iconSizes[size]} flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full`}
        >
          {icons}
        </span>
      ) : null}
      {text}
    </button>
  );
};
