import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check, Info, TriangleAlert } from "lucide-react";
import { cx } from "./primitives";

type ToastTone = "success" | "info" | "error";
interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(
  null,
);

const ICONS = { success: Check, info: Info, error: TriangleAlert };
const TONES = {
  success: "border-success/30 bg-success-dim text-success",
  info: "border-line-strong bg-surface-3 text-ink",
  error: "border-danger/30 bg-danger-dim text-danger",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(
      () => setToast((cur) => (cur?.id === id ? null : cur)),
      2600,
    );
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Região viva: leitores de tela anunciam sem roubar o foco */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center px-6"
      >
        {toast && <ToastBubble {...toast} />}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ message, tone }: ToastState) {
  const Icon = ICONS[tone];
  return (
    <div
      className={cx(
        "flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium shadow-lg",
        TONES[tone],
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {message}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx;
}
