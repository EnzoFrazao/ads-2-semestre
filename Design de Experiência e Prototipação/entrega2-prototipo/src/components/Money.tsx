import { formatMoney, formatSigned } from "@/lib/format";
import { cx } from "./primitives";

/**
 * Valores sempre passam por Intl e usam numerais tabulares,
 * para que as colunas do extrato alinhem.
 */
export function Money({
  cents,
  kind,
  hidden,
  className,
}: {
  cents: number;
  kind?: "in" | "out";
  hidden?: boolean;
  className?: string;
}) {
  if (hidden) {
    return (
      <span className={cx("tnum select-none", className)} aria-label="Valor oculto">
        R$ ••••••
      </span>
    );
  }

  const text = kind ? formatSigned(cents, kind) : formatMoney(cents);
  const tone = kind === "in" ? "text-success" : kind === "out" ? "text-danger" : undefined;

  return <span className={cx("tnum", tone, className)}>{text}</span>;
}
