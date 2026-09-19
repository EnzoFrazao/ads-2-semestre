import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Barcode,
  Bell,
  Eye,
  EyeOff,
  Smartphone,
  Zap,
} from "lucide-react";
import { account, cards, notifications, transactions } from "@/data/mock";
import { formatFullDate, formatMoney } from "@/lib/format";
import { useAsyncData } from "@/lib/useAsyncData";
import { useLocalStorage } from "@/lib/useLocalStorage";
import {
  Avatar,
  Button,
  Card,
  Section,
  Skeleton,
  SkeletonList,
  cx,
} from "@/components/primitives";
import { Money } from "@/components/Money";
import { TxRow } from "@/components/TxRow";
import { Sheet } from "@/components/Sheet";
import { useToast } from "@/components/Toast";

const QUICK_ACTIONS = [
  { key: "pix", label: "Pix", Icon: Zap, to: "/pix" },
  { key: "pagar", label: "Pagar", Icon: Barcode, to: null },
  { key: "transferir", label: "Transferir", Icon: ArrowLeftRight, to: null },
  { key: "recarga", label: "Recarga", Icon: Smartphone, to: null },
] as const;

export function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const { state, retry } = useAsyncData(transactions, 600);
  const [hidden, setHidden] = useLocalStorage("techx:hide-balance", false);
  const [sheet, setSheet] = useState<string | null>(null);

  const unread = notifications.filter((n) => !n.read).length;
  const credit = cards[0];
  const latest = transactions.slice(0, 4);
  const usage = credit.usedCents / credit.limitCents;

  return (
    <div className="space-y-6 px-6 pb-8">
      {/* ------------------------------ Cabecalho ----------------------------- */}
      <header className="flex items-center gap-3 pt-1">
        {/* Toda tela precisa de um h1; aqui o titulo e so para leitor de tela. */}
        <h1 className="sr-only">Início</h1>
        <Avatar initials={account.initials} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-muted">Bom dia,</p>
          <p className="truncate text-[16px] font-semibold text-ink">
            {account.holder.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
        <Link
          to="/notificacoes"
          aria-label={
            unread > 0 ? `Notificações, ${unread} não lidas` : "Notificações"
          }
          className="relative flex size-10 items-center justify-center rounded-full border border-line bg-surface-2 text-dim transition hover:text-ink"
        >
          <Bell size={18} aria-hidden="true" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white"
            >
              {unread}
            </span>
          )}
        </Link>
      </header>

      {/* ---------------------------- Card de saldo --------------------------- */}
      <Card className="brand-gradient relative overflow-hidden border-0 p-5 shadow-xl shadow-brand/25">
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-14 size-40 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -left-8 size-36 rounded-full bg-black/10"
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-white/80">
              Saldo disponível
            </span>
            <button
              type="button"
              onClick={() => setHidden(!hidden)}
              aria-pressed={hidden}
              aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/25"
            >
              {hidden ? (
                <Eye size={13} aria-hidden="true" />
              ) : (
                <EyeOff size={13} aria-hidden="true" />
              )}
              {hidden ? "MOSTRAR" : "OCULTAR"}
            </button>
          </div>

          {state === "loading" ? (
            <Skeleton className="mt-3 h-9 w-48 bg-white/20" />
          ) : (
            <p className="mt-2 text-[30px] font-bold tracking-tight text-white">
              <Money cents={account.balanceCents} hidden={hidden} />
            </p>
          )}

          <p className="mt-3 text-[11px] text-white/70">
            Ag. {account.agency} · Conta {account.number}
          </p>
        </div>
      </Card>

      {/* ---------------------------- Acoes rapidas --------------------------- */}
      <Section title="Ações rápidas">
        <ul className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ key, label, Icon, to }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => (to ? navigate(to) : setSheet(label))}
                className="flex w-full flex-col items-center gap-2 rounded-2xl border border-line bg-surface-2/60 py-3.5 transition hover:bg-surface-3/60"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-dim text-brand-2">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="text-[11.5px] font-medium text-dim">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* --------------------------- Cartao de credito ------------------------ */}
      <Section
        title="Cartão de crédito"
        action={
          <Link
            to="/cartoes"
            className="text-[12.5px] font-medium text-brand-2 hover:underline"
          >
            Ver fatura
          </Link>
        }
      >
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] text-muted">Fatura atual</p>
              <p className="mt-0.5 text-[22px] font-bold text-ink">
                <Money cents={credit.invoiceCents} hidden={hidden} />
              </p>
            </div>
            <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-ink">
              {credit.brand}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline justify-between text-[11.5px]">
              <span className="text-muted">Limite disponível</span>
              <span className="tnum text-dim">
                {formatMoney(credit.limitCents - credit.usedCents)} de{" "}
                {formatMoney(credit.limitCents)}
              </span>
            </div>
            {/* Barra com semantica de progresso — antes era so uma div colorida */}
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(usage * 100)}
              aria-label="Limite utilizado"
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className={cx(
                  "h-full rounded-full transition-all",
                  usage > 0.8 ? "bg-danger" : "brand-gradient",
                )}
                style={{ width: `${Math.min(usage * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Vence em {formatFullDate(credit.dueDate)}
            </p>
          </div>
        </Card>
      </Section>

      {/* -------------------------- Ultimas transacoes ------------------------ */}
      <Section
        title="Últimas transações"
        action={
          <Link
            to="/extrato"
            className="text-[12.5px] font-medium text-brand-2 hover:underline"
          >
            Ver todas
          </Link>
        }
      >
        {state === "loading" && <SkeletonList rows={4} />}
        {state === "error" && (
          <Button variant="secondary" full onClick={retry}>
            Recarregar transações
          </Button>
        )}
        {state === "ready" && (
          <ul className="space-y-2.5">
            {latest.map((tx) => (
              <TxRow key={tx.id} tx={tx} hidden={hidden} />
            ))}
          </ul>
        )}
      </Section>

      <Sheet open={sheet !== null} title={sheet ?? ""} onClose={() => setSheet(null)}>
        <p className="mb-5 text-[13.5px] leading-relaxed text-dim">
          O fluxo de <strong className="text-ink">{sheet}</strong> ainda não faz parte
          deste protótipo. O Pix está completo e pode ser percorrido de ponta a ponta.
        </p>
        <Button
          full
          onClick={() => {
            setSheet(null);
            toast("Vamos pelo Pix, então.", "info");
            navigate("/pix");
          }}
        >
          Ir para o Pix
        </Button>
      </Sheet>
    </div>
  );
}
