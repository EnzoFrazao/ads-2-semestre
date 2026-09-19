import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Delete, TriangleAlert } from "lucide-react";
import { account } from "@/data/mock";
import { PIX_KEY_LABEL, digitsToCents, formatAmount, formatMoney } from "@/lib/format";
import { Avatar, Button, Card } from "@/components/primitives";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StepIndicator } from "@/components/StepIndicator";
import { usePixFlow } from "@/lib/PixFlow";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PixAmount() {
  const navigate = useNavigate();
  const { recipient, setAmount, note, setNote, validateAmount } = usePixFlow();
  const [digits, setDigits] = useState("");

  /* Sem destinatário o passo não faz sentido — volta ao início do fluxo. */
  if (!recipient) return <Navigate to="/pix/destino" replace />;

  const cents = digitsToCents(digits);
  const error = digits ? validateAmount(cents) : null;
  const canContinue = cents > 0 && error === null;

  function press(key: string) {
    if (key === "del") setDigits((d) => d.slice(0, -1));
    else if (key) setDigits((d) => (d === "0" ? key : d + key));
  }

  return (
    <div className="flex min-h-full flex-col pb-8">
      <ScreenHeader title="Qual o valor?" backTo="/pix/destino" />
      <StepIndicator current={1} />

      <div className="flex-1 space-y-5 px-6">
        {/* --------------------------- Destinatário --------------------------- */}
        <Card className="flex items-center gap-3 p-3.5">
          <Avatar initials={recipient.initials} size={40} tone="neutral" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium text-ink">
              {recipient.name}
            </p>
            <p className="truncate text-[11.5px] text-muted">
              {recipient.bank} · {PIX_KEY_LABEL[recipient.keyType]}
            </p>
          </div>
        </Card>

        {/* ------------------------------ Valor ------------------------------- */}
        <div className="py-2 text-center">
          <p className="text-[12px] text-muted">Valor do Pix</p>
          <p
            className="mt-1 text-[38px] font-bold tracking-tight tnum"
            aria-live="polite"
            aria-label={`Valor ${formatMoney(cents)}`}
          >
            <span className="text-dim">R$ </span>
            <span className={cents > 0 ? "text-ink" : "text-muted"}>
              {formatAmount(cents)}
            </span>
          </p>
          <p className="mt-2 text-[11.5px] text-muted">
            Saldo disponível {formatMoney(account.balanceCents)}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-danger-dim px-3 py-2 text-[12.5px] text-danger"
            >
              <TriangleAlert size={14} aria-hidden="true" />
              {error}
            </p>
          )}
        </div>

        {/* ------------------------------ Mensagem ---------------------------- */}
        <div>
          <label
            htmlFor="pix-note"
            className="mb-2 block text-[12.5px] font-semibold text-dim"
          >
            Mensagem <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="pix-note"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 80))}
            placeholder="Ex.: almoço de sexta"
            className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-[14px] text-ink placeholder:text-muted"
          />
          <p className="mt-1.5 text-right text-[11px] text-muted">{note.length}/80</p>
        </div>

        {/* ----------------------------- Teclado ------------------------------ */}
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Teclado numérico">
          {KEYS.map((key, i) =>
            key === "" ? (
              <span key={i} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => press(key)}
                aria-label={key === "del" ? "Apagar" : key}
                className="flex h-13 items-center justify-center rounded-xl border border-line bg-surface-2/60 py-3.5 text-[19px] font-semibold text-ink transition hover:bg-surface-3/60 active:scale-95"
              >
                {key === "del" ? (
                  <Delete size={19} aria-hidden="true" />
                ) : (
                  key
                )}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="px-6 pt-5">
        <Button
          full
          disabled={!canContinue}
          onClick={() => {
            setAmount(cents);
            navigate("/pix/confirmar");
          }}
        >
          Continuar
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
