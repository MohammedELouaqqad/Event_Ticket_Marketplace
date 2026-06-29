import { type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  dark?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  dark = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium",
            dark ? "text-white/80" : "text-slate-700"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
              dark ? "text-white/40" : "text-slate-400"
            )}
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            Boolean(leftIcon) && "pl-10",
            dark
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-brand-400 focus:ring-brand-400/30"
              : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-brand-500/20 focus:bg-white",
            error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && (
        <p className={cn("text-xs", dark ? "text-white/50" : "text-slate-500")}>
          {hint}
        </p>
      )}
    </div>
  );
}
