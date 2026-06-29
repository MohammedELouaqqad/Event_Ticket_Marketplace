import { CiSearch } from "react-icons/ci";
import { cn } from "../../lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search events...",
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-card",
        "transition-all duration-200 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20",
        className
      )}
    >
      <CiSearch className="shrink-0 text-xl text-slate-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        aria-label="Search events"
      />
    </div>
  );
}
