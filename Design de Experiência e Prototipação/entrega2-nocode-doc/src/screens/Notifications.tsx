import { useState } from "react";
import { BellOff, CheckCheck, Info, ShieldAlert, Wallet } from "lucide-react";
import { notifications as seed } from "@/data/mock";
import { formatRelativeDay, formatTime } from "@/lib/format";
import type { AppNotification } from "@/types";
import { Button, Card, EmptyState, cx } from "@/components/primitives";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useToast } from "@/components/Toast";

const ICONS = {
  transacao: Wallet,
  seguranca: ShieldAlert,
  aviso: Info,
} as const;

const TONES = {
  transacao: "bg-success-dim text-success",
  seguranca: "bg-danger-dim text-danger",
  aviso: "bg-warn-dim text-warn",
} as const;

export function Notifications() {
  const toast = useToast();
  const [items, setItems] = useState<AppNotification[]>(seed);

  const unread = items.filter((n) => !n.read).length;

  function markAll() {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    toast("Tudo marcado como lido.", "success");
  }

  return (
    <div className="pb-8">
      <ScreenHeader
        title="Notificações"
        subtitle={unread > 0 ? `${unread} não lidas` : "Tudo em dia"}
        backTo="/"
        action={
          unread > 0 ? (
            <button
              type="button"
              onClick={markAll}
              aria-label="Marcar todas como lidas"
              className="flex size-9 items-center justify-center rounded-full text-dim transition hover:bg-white/5 hover:text-ink"
            >
              <CheckCheck size={19} aria-hidden="true" />
            </button>
          ) : undefined
        }
      />

      <div className="space-y-3 px-6">
        {items.length === 0 ? (
          <EmptyState
            icon={<BellOff size={20} aria-hidden="true" />}
            title="Sem notificações"
            description="Quando algo acontecer na sua conta, aparece aqui."
          />
        ) : (
          <ul className="space-y-2.5">
            {items.map((n) => {
              const Icon = ICONS[n.kind];
              return (
                <li key={n.id}>
                  <Card
                    className={cx(
                      "flex gap-3 p-3.5",
                      !n.read && "border-brand/25 bg-brand-dim/40",
                    )}
                  >
                    <span
                      className={cx(
                        "flex size-9 shrink-0 items-center justify-center rounded-full",
                        TONES[n.kind],
                      )}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-[13.5px] font-semibold text-ink">
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[11px] text-muted">
                          {formatRelativeDay(n.date)} · {formatTime(n.date)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-dim">
                        {n.body}
                      </p>
                    </div>
                    {!n.read && (
                      <span
                        aria-label="Não lida"
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-2"
                      />
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && (
          <Button
            variant="ghost"
            full
            onClick={() => {
              setItems([]);
              toast("Notificações limpas.", "info");
            }}
          >
            Limpar notificações
          </Button>
        )}
      </div>
    </div>
  );
}
