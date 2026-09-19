import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------- Card --------------------------------- */

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-line bg-surface-2/80 backdrop-blur-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* -------------------------------- Section -------------------------------- */

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/* -------------------------------- Button --------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "brand-gradient text-white shadow-lg shadow-brand/25 hover:brightness-110",
  secondary: "bg-surface-3 text-ink border border-line-strong hover:bg-surface-3/70",
  ghost: "text-dim hover:text-ink hover:bg-white/5",
  danger: "bg-danger-dim text-danger border border-danger/30 hover:bg-danger/20",
};

export function Button({
  variant = "primary",
  full,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; full?: boolean }) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5",
        "text-[15px] font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        VARIANTS[variant],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------- Avatar --------------------------------- */

export function Avatar({
  initials,
  size = 40,
  tone = "brand",
}: {
  initials: string;
  size?: number;
  tone?: "brand" | "neutral";
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        tone === "brand"
          ? "brand-gradient text-white"
          : "border border-line-strong bg-surface-3 text-dim",
      )}
    >
      {initials}
    </span>
  );
}

/* -------------------------------- Skeleton ------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx("animate-pulse rounded-lg bg-white/[0.07]", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2/60 p-3.5">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Estado vazio ----------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-3 text-dim">
        {icon}
      </span>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      <p className="max-w-[26ch] text-[13px] leading-relaxed text-muted">{description}</p>
      {action}
    </div>
  );
}

/* ------------------------------ Estado de erro --------------------------- */

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-danger/30 bg-danger-dim px-6 py-8 text-center"
    >
      <p className="text-[15px] font-semibold text-ink">Não foi possível carregar</p>
      <p className="max-w-[28ch] text-[13px] leading-relaxed text-dim">
        Verifique sua conexão e tente novamente.
      </p>
      <Button variant="secondary" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  );
}

/* --------------------------------- Chip ---------------------------------- */

export function Chip({
  active,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
        active
          ? "border-brand/40 bg-brand-dim text-brand-2"
          : "border-line bg-surface-2 text-dim hover:text-ink",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
