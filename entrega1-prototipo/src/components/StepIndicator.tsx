import { cx } from "./primitives";

const STEPS = ["Destino", "Valor", "Confirmação"];

/** Progresso do fluxo Pix — a v4 não indicava em que passo o usuário estava. */
export function StepIndicator({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol
      className="flex items-center gap-2 px-6 pb-5"
      aria-label={`Passo ${current + 1} de ${STEPS.length}`}
    >
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-1 flex-col gap-1.5">
          <span
            className={cx(
              "h-1 rounded-full transition-colors",
              i <= current ? "brand-gradient" : "bg-white/10",
            )}
            aria-hidden="true"
          />
          <span
            className={cx(
              "text-[10.5px] font-medium",
              i === current ? "text-brand-2" : "text-muted",
            )}
            aria-current={i === current ? "step" : undefined}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
