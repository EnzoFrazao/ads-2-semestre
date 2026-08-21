import {
  ArrowLeftRight,
  Banknote,
  Bus,
  Clapperboard,
  HeartPulse,
  House,
  Repeat,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";
import { CATEGORY_LABEL } from "@/lib/format";
import { cx } from "./primitives";

/**
 * Ícones reais no lugar dos emojis usados pelo Figma Make.
 * Emoji não tem nome acessível, muda de desenho conforme o sistema
 * operacional e não herda a cor do tema.
 */
const ICONS: Record<Category, LucideIcon> = {
  alimentacao: ShoppingCart,
  assinaturas: Repeat,
  transporte: Bus,
  moradia: House,
  saude: HeartPulse,
  lazer: Clapperboard,
  receita: Banknote,
  transferencia: ArrowLeftRight,
};

const TONES: Record<Category, string> = {
  alimentacao: "bg-warn-dim text-warn",
  assinaturas: "bg-brand-dim text-brand-2",
  transporte: "bg-sky-500/15 text-sky-300",
  moradia: "bg-orange-500/15 text-orange-300",
  saude: "bg-rose-500/15 text-rose-300",
  lazer: "bg-fuchsia-500/15 text-fuchsia-300",
  receita: "bg-success-dim text-success",
  transferencia: "bg-indigo-500/15 text-indigo-300",
};

export function CategoryIcon({
  category,
  size = 40,
  className,
}: {
  category: Category;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[category];
  return (
    <span
      style={{ width: size, height: size }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-xl",
        TONES[category],
        className,
      )}
      /* O rótulo textual fica na linha ao lado; aqui o ícone é decorativo. */
      role="img"
      aria-label={CATEGORY_LABEL[category]}
    >
      <Icon size={size * 0.45} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
