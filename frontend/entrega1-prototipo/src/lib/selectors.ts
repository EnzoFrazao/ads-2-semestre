import type { Category, CategorySummary, Transaction } from "@/types";

/** Derivações sobre as transações. Antes não existiam: os totais da v4 eram literais. */

export interface DayGroup {
  key: string;
  date: string;
  items: Transaction[];
}

export function groupByDay(items: Transaction[]): DayGroup[] {
  const map = new Map<string, Transaction[]>();
  for (const t of items) {
    const key = t.date.slice(0, 10);
    const bucket = map.get(key);
    if (bucket) bucket.push(t);
    else map.set(key, [t]);
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, group]) => ({
      key,
      date: group[0].date,
      items: [...group].sort((a, b) => (a.date < b.date ? 1 : -1)),
    }));
}

export function inMonth(items: Transaction[], monthIso: string): Transaction[] {
  const prefix = monthIso.slice(0, 7);
  return items.filter((t) => t.date.startsWith(prefix));
}

export function sumBy(items: Transaction[], kind: "in" | "out"): number {
  return items.reduce((acc, t) => (t.kind === kind ? acc + t.amountCents : acc), 0);
}

export interface MonthSummary {
  inCents: number;
  outCents: number;
  netCents: number;
}

export function monthSummary(items: Transaction[]): MonthSummary {
  const inCents = sumBy(items, "in");
  const outCents = sumBy(items, "out");
  return { inCents, outCents, netCents: inCents - outCents };
}

/** Gastos por categoria — base do resumo visual do extrato. */
export function spendByCategory(items: Transaction[]): CategorySummary[] {
  const map = new Map<Category, number>();
  for (const t of items) {
    if (t.kind !== "out") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amountCents);
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0);
  return [...map.entries()]
    .map(([category, totalCents]) => ({
      category,
      totalCents,
      share: total > 0 ? totalCents / total : 0,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}

/** Meses distintos presentes na base, do mais recente para o mais antigo. */
export function availableMonths(items: Transaction[]): string[] {
  const set = new Set(items.map((t) => `${t.date.slice(0, 7)}-01T00:00:00`));
  return [...set].sort().reverse();
}

export interface StatementFilter {
  query: string;
  kind: "todos" | "in" | "out";
  category: Category | "todas";
}

export const EMPTY_FILTER: StatementFilter = {
  query: "",
  kind: "todos",
  category: "todas",
};

export function applyFilter(items: Transaction[], filter: StatementFilter): Transaction[] {
  const q = filter.query.trim().toLowerCase();
  return items.filter((t) => {
    if (filter.kind !== "todos" && t.kind !== filter.kind) return false;
    if (filter.category !== "todas" && t.category !== filter.category) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) || t.counterparty.toLowerCase().includes(q)
    );
  });
}

export function findTransaction(items: Transaction[], id: string): Transaction | undefined {
  return items.find((t) => t.id === id);
}
