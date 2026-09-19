import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  subtitle,
  action,
  backTo,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backTo?: string;
}) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-6 pb-4 pt-1">
      <button
        type="button"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        aria-label="Voltar"
        className="-ml-2 flex size-9 items-center justify-center rounded-full text-dim transition hover:bg-white/5 hover:text-ink"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-[12px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
