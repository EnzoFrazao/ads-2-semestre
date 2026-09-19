import { useState } from "react";
import {
  CreditCard as CreditCardIcon,
  Eye,
  Lock,
  Nfc,
  SlidersHorizontal,
  Snowflake,
  Unlock,
  Wifi,
} from "lucide-react";
import { cards as seed } from "@/data/mock";
import { formatFullDate, formatMoney } from "@/lib/format";
import type { CreditCard } from "@/types";
import { Button, Card, Chip, Section, cx } from "@/components/primitives";
import { Money } from "@/components/Money";
import { Sheet } from "@/components/Sheet";
import { useToast } from "@/components/Toast";

export function Cards() {
  const toast = useToast();
  const [cards, setCards] = useState<CreditCard[]>(seed);
  const [activeId, setActiveId] = useState(seed[0].id);
  const [limitOpen, setLimitOpen] = useState(false);

  const card = cards.find((c) => c.id === activeId)!;
  const usage = card.usedCents / card.limitCents;

  function toggleBlock() {
    setCards((list) =>
      list.map((c) => (c.id === card.id ? { ...c, blocked: !c.blocked } : c)),
    );
    toast(
      card.blocked ? "Cartão desbloqueado." : "Cartão bloqueado temporariamente.",
      card.blocked ? "success" : "info",
    );
  }

  return (
    <div className="space-y-5 px-6 pb-8">
      <header className="pt-1">
        <h1 className="text-[20px] font-bold text-ink">Cartões</h1>
      </header>

      {/* ---------------------------- Seletor -------------------------------- */}
      <div className="flex gap-2" role="tablist" aria-label="Selecionar cartão">
        {cards.map((c) => (
          <Chip
            key={c.id}
            active={c.id === activeId}
            onClick={() => setActiveId(c.id)}
          >
            {c.type === "credito" ? "Crédito" : "Débito"}
          </Chip>
        ))}
      </div>

      {/* ------------------------- Cartão ilustrado -------------------------- */}
      <div
        className={cx(
          "brand-gradient relative aspect-[1.586/1] overflow-hidden rounded-2xl p-5 shadow-xl shadow-brand/25 transition",
          card.blocked && "grayscale",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute -right-12 -top-16 size-44 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-10 size-44 rounded-full bg-black/10"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] font-semibold text-white/90">
              {card.label}
            </span>
            <Nfc size={22} className="text-white/70" aria-hidden="true" />
          </div>

          <div>
            <p className="text-[17px] font-medium tracking-[0.18em] text-white tnum">
              •••• •••• •••• {card.last4}
            </p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-[11px] text-white/70">
                {card.blocked ? "BLOQUEADO" : "ATIVO"}
              </span>
              <span className="text-[13px] font-bold tracking-wider text-white">
                {card.brand}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------ Fatura -------------------------------- */}
      {card.type === "credito" ? (
        <Section title="Fatura atual">
          <Card className="p-4">
            <p className="text-[26px] font-bold text-ink">
              <Money cents={card.invoiceCents} />
            </p>
            <p className="mt-1 text-[12px] text-muted">
              Vence em {formatFullDate(card.dueDate)}
            </p>

            <div className="mt-4">
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-muted">Limite utilizado</span>
                <span className="tnum text-dim">
                  {formatMoney(card.usedCents)} de {formatMoney(card.limitCents)}
                </span>
              </div>
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
                    "h-full rounded-full",
                    usage > 0.8 ? "bg-danger" : "brand-gradient",
                  )}
                  style={{ width: `${Math.min(usage * 100, 100)}%` }}
                />
              </div>
            </div>

            <Button
              full
              className="mt-4"
              onClick={() => toast("Pagamento de fatura agendado.", "success")}
            >
              Pagar fatura
            </Button>
          </Card>
        </Section>
      ) : (
        <Section title="Conta vinculada">
          <Card className="p-4">
            <p className="text-[12px] text-muted">Gasto no débito neste mês</p>
            <p className="mt-1 text-[24px] font-bold text-ink">
              <Money cents={card.usedCents} />
            </p>
          </Card>
        </Section>
      )}

      {/* ------------------------------- Ações -------------------------------- */}
      <Section title="Ações do cartão">
        <Card className="divide-y divide-[color:var(--color-line)]">
          <ActionRow
            Icon={card.blocked ? Unlock : Snowflake}
            label={card.blocked ? "Desbloquear cartão" : "Bloquear temporariamente"}
            description={
              card.blocked
                ? "Volte a usar o cartão agora mesmo"
                : "Bloqueio reversível a qualquer momento"
            }
            onClick={toggleBlock}
            tone={card.blocked ? "default" : "danger"}
          />
          <ActionRow
            Icon={SlidersHorizontal}
            label="Ajustar limite"
            description={`Atual: ${formatMoney(card.limitCents)}`}
            onClick={() => setLimitOpen(true)}
          />
          <ActionRow
            Icon={CreditCardIcon}
            label="Cartão virtual"
            description="Crie um número temporário para compras online"
            onClick={() => toast("Cartão virtual criado.", "success")}
          />
          <ActionRow
            Icon={Eye}
            label="Ver dados do cartão"
            description="Número, validade e CVV"
            onClick={() => toast("Confirme sua identidade para continuar.", "info")}
          />
          <ActionRow
            Icon={Wifi}
            label="Pagamento por aproximação"
            description="Ativado para compras até R$ 200,00"
            onClick={() => toast("Aproximação atualizada.", "success")}
          />
        </Card>
      </Section>

      <Sheet open={limitOpen} title="Ajustar limite" onClose={() => setLimitOpen(false)}>
        <p className="mb-4 text-[13.5px] leading-relaxed text-dim">
          Seu limite pré-aprovado é de{" "}
          <strong className="text-ink">{formatMoney(card.limitCents * 1.4)}</strong>. A
          alteração vale para a próxima fatura.
        </p>
        <Button
          full
          onClick={() => {
            setLimitOpen(false);
            toast("Solicitação de limite enviada.", "success");
          }}
        >
          <Lock size={16} aria-hidden="true" />
          Solicitar aumento
        </Button>
      </Sheet>
    </div>
  );
}

function ActionRow({
  Icon,
  label,
  description,
  onClick,
  tone = "default",
}: {
  Icon: typeof Lock;
  label: string;
  description: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5"
    >
      <span
        className={cx(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          tone === "danger" ? "bg-danger-dim text-danger" : "bg-surface-3 text-dim",
        )}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-ink">{label}</span>
        <span className="block truncate text-[11.5px] text-muted">{description}</span>
      </span>
    </button>
  );
}
