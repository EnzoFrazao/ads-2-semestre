import { BatteryFull, Signal, Wifi } from "lucide-react";

/**
 * Barra de status simulada — mantida do briefing original
 * ("9:41" à esquerda + indicadores à direita).
 */
export function StatusBar() {
  return (
    <div
      aria-hidden="true"
      className="flex h-11 shrink-0 items-center justify-between px-6 text-ink"
    >
      <span className="text-[14px] font-semibold tracking-tight tnum">9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.4} />
        <Wifi size={15} strokeWidth={2.4} />
        <BatteryFull size={19} strokeWidth={2} />
      </span>
    </div>
  );
}
