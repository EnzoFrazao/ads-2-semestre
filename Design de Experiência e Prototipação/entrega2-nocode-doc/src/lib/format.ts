import type { Category, PixKeyType } from "@/types";

/**
 * Formatação pt-BR via Intl.
 * A versão do Figma Make escrevia "R$ 1.240,00" e "Hoje" como string literal,
 * o que impedia qualquer cálculo e quebrava com outros valores.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const BRL_NO_SYMBOL = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(cents: number): string {
  return BRL.format(cents / 100);
}

export function formatAmount(cents: number): string {
  return BRL_NO_SYMBOL.format(cents / 100);
}

/** Valor com sinal explícito, para linhas de extrato. */
export function formatSigned(cents: number, kind: "in" | "out"): string {
  const sign = kind === "in" ? "+" : "−";
  return `${sign} ${formatMoney(Math.abs(cents))}`;
}

const DAY = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
const FULL = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const TIME = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const MONTH = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

/** "Hoje" / "Ontem" calculados de verdade, não fixos como na v4. */
export function formatRelativeDay(iso: string, today = REFERENCE_DATE): string {
  const d = startOfDay(new Date(iso));
  const ref = startOfDay(today);
  const diff = Math.round((ref.getTime() - d.getTime()) / 86_400_000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return DAY.format(d);
}

export function formatFullDate(iso: string): string {
  return FULL.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return TIME.format(new Date(iso));
}

export function formatMonth(iso: string): string {
  const label = MONTH.format(new Date(iso));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Data de referência fixa para o app de demonstração.
 * Mantém "Hoje"/"Ontem" estáveis e torna os screenshots reprodutíveis.
 */
export const REFERENCE_DATE = new Date("2026-08-20T09:41:00");

export const CATEGORY_LABEL: Record<Category, string> = {
  alimentacao: "Alimentação",
  assinaturas: "Assinaturas",
  transporte: "Transporte",
  moradia: "Moradia",
  saude: "Saúde",
  lazer: "Lazer",
  receita: "Receita",
  transferencia: "Transferência",
};

export const PIX_KEY_LABEL: Record<PixKeyType, string> = {
  cpf: "CPF",
  email: "E-mail",
  telefone: "Telefone",
  aleatoria: "Chave aleatória",
};

/** Mascara a chave Pix para exibição, preservando o suficiente para conferência. */
export function maskPixKey(value: string, type: PixKeyType): string {
  if (type === "cpf") return value.replace(/^(\d{3})\.?\d{3}\.?(\d{3})/, "$1.***.$2");
  if (type === "email") {
    const [user, domain] = value.split("@");
    if (!domain) return value;
    return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
  }
  if (type === "telefone") return value.replace(/(\d{2})\s?\d{4,5}/, "$1 *****");
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

/** Converte o texto digitado no teclado numérico em centavos. */
export function digitsToCents(digits: string): number {
  const clean = digits.replace(/\D/g, "").slice(0, 11);
  return clean ? Number.parseInt(clean, 10) : 0;
}
