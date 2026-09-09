import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { transactions } from "@/data/mock";
import { CATEGORY_LABEL, formatMonth, formatRelativeDay } from "@/lib/format";
import {
  EMPTY_FILTER,
  applyFilter,
  availableMonths,
  groupByDay,
  inMonth,
  monthSummary,
  spendByCategory,
  type StatementFilter,
} from "@/lib/selectors";
import { useAsyncData } from "@/lib/useAsyncData";
import type { Category } from "@/types";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  SkeletonList,
  cx,
} from "@/components/primitives";
import { Money } from "@/components/Money";
import { TxRow } from "@/components/TxRow";
import { Sheet } from "@/components/Sheet";

export function Statement() {
  const months = useMemo(() => availableMonths(transactions), []);
  const [month, setMonth] = useState(months[0]);
  const [filter, setFilter] = useState<StatementFilter>(EMPTY_FILTER);
  const [monthOpen, setMonthOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const { state, retry } = useAsyncData(transactions, 500);

  const ofMonth = useMemo(() => inMonth(transactions, month), [month]);
  const filtered = useMemo(() => applyFilter(ofMonth, filter), [ofMonth, filter]);
  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const summary = useMemo(() => monthSummary(ofMonth), [ofMonth]);
  const byCategory = useMemo(() => spendByCategory(ofMonth).slice(0, 4), [ofMonth]);

  const activeFilters =
    (filter.kind !== "todos" ? 1 : 0) + (filter.category !== "todas" ? 1 : 0);

  return (
    <div className="space-y-5 px-6 pb-8">
      <header className="flex items-center justify-between gap-3 pt-1">
        <h1 className="text-[20px] font-bold text-ink">Extrato</h1>
        <button
          type="button"
          onClick={() => setMonthOpen(true)}
          aria-haspopup="dialog"
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-2 text-[13px] font-medium text-dim transition hover:text-ink"
        >
          {formatMonth(month)}
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </header>

      {/* ------------------------------- Resumo ------------------------------- */}
      <Card className="grid grid-cols-3 divide-x divide-[color:var(--color-line)] px-2 py-4">
        <SummaryCell label="Entradas" cents={summary.inCents} kind="in" />
        <SummaryCell label="Saídas" cents={summary.outCents} kind="out" />
        <SummaryCell label="Saldo" cents={summary.netCents} />
      </Card>

      {/* --------------------- Gastos por categoria (novo) -------------------- */}
      {byCategory.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-[15px] font-semibold text-ink">Para onde foi</h2>
          <Card className="space-y-3 p-4">
            {byCategory.map((row) => (
              <div key={row.category}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span className="text-dim">{CATEGORY_LABEL[row.category]}</span>
                  <Money cents={row.totalCents} className="text-muted" />
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="brand-gradient h-full rounded-full"
                    style={{ width: `${Math.max(row.share * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* --------------------------- Busca e filtros -------------------------- */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            placeholder="Buscar transação"
            aria-label="Buscar transação"
            className="w-full rounded-xl border border-line bg-surface-2 py-2.5 pl-10 pr-3 text-[13.5px] text-ink placeholder:text-muted"
          />
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-haspopup="dialog"
          aria-label={
            activeFilters > 0 ? `Filtros, ${activeFilters} ativos` : "Filtros"
          }
          className={cx(
            "relative flex size-11 shrink-0 items-center justify-center rounded-xl border transition",
            activeFilters > 0
              ? "border-brand/40 bg-brand-dim text-brand-2"
              : "border-line bg-surface-2 text-dim hover:text-ink",
          )}
        >
          <SlidersHorizontal size={17} aria-hidden="true" />
          {activeFilters > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white"
            >
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {activeFilters > 0 && (
        <button
          type="button"
          onClick={() => setFilter({ ...EMPTY_FILTER, query: filter.query })}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-brand-2 hover:underline"
        >
          <X size={13} aria-hidden="true" />
          Limpar filtros
        </button>
      )}

      {/* ------------------------------- Lista -------------------------------- */}
      {state === "loading" && <SkeletonList rows={5} />}
      {state === "error" && <ErrorState onRetry={retry} />}

      {state === "ready" && groups.length === 0 && (
        <EmptyState
          icon={<Search size={20} aria-hidden="true" />}
          title="Nada por aqui"
          description="Nenhuma transação corresponde à busca ou aos filtros escolhidos."
          action={
            <Button variant="secondary" onClick={() => setFilter(EMPTY_FILTER)}>
              Limpar tudo
            </Button>
          }
        />
      )}

      {state === "ready" &&
        groups.map((group) => (
          <section key={group.key} className="space-y-2.5">
            <h2 className="text-[12px] font-semibold uppercase tracking-wide text-muted">
              {formatRelativeDay(group.date)}
            </h2>
            <ul className="space-y-2.5">
              {group.items.map((tx) => (
                <TxRow key={tx.id} tx={tx} />
              ))}
            </ul>
          </section>
        ))}

      {/* --------------------------- Sheet de mês ----------------------------- */}
      <Sheet open={monthOpen} title="Escolher mês" onClose={() => setMonthOpen(false)}>
        <ul className="space-y-2">
          {months.map((m) => (
            <li key={m}>
              <button
                type="button"
                onClick={() => {
                  setMonth(m);
                  setMonthOpen(false);
                }}
                aria-current={m === month ? "true" : undefined}
                className={cx(
                  "w-full rounded-xl border px-4 py-3 text-left text-[14px] font-medium transition",
                  m === month
                    ? "border-brand/40 bg-brand-dim text-brand-2"
                    : "border-line bg-surface-2 text-dim hover:text-ink",
                )}
              >
                {formatMonth(m)}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>

      {/* -------------------------- Sheet de filtros -------------------------- */}
      <Sheet open={filterOpen} title="Filtros" onClose={() => setFilterOpen(false)}>
        <div className="space-y-5">
          <fieldset>
            <legend className="mb-2.5 text-[12.5px] font-semibold text-dim">Tipo</legend>
            <div className="flex gap-2">
              {(
                [
                  ["todos", "Todos"],
                  ["in", "Entradas"],
                  ["out", "Saídas"],
                ] as const
              ).map(([value, label]) => (
                <Chip
                  key={value}
                  active={filter.kind === value}
                  onClick={() => setFilter({ ...filter, kind: value })}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2.5 text-[12.5px] font-semibold text-dim">
              Categoria
            </legend>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={filter.category === "todas"}
                onClick={() => setFilter({ ...filter, category: "todas" })}
              >
                Todas
              </Chip>
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <Chip
                  key={c}
                  active={filter.category === c}
                  onClick={() => setFilter({ ...filter, category: c })}
                >
                  {CATEGORY_LABEL[c]}
                </Chip>
              ))}
            </div>
          </fieldset>

          <Button full onClick={() => setFilterOpen(false)}>
            Ver {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function SummaryCell({
  label,
  cents,
  kind,
}: {
  label: string;
  cents: number;
  kind?: "in" | "out";
}) {
  return (
    <div className="px-2 text-center first:pl-0 last:pr-0">
      <p className="text-[10.5px] text-muted">{label}</p>
      <p className="mt-1 whitespace-nowrap text-[12.5px] font-semibold">
        <Money cents={cents} kind={kind} />
      </p>
    </div>
  );
}
