import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { account } from "@/data/mock";
import { PIX_KEY_LABEL, formatFullDate, maskPixKey } from "@/lib/format";
import { REFERENCE_DATE } from "@/lib/format";
import { Avatar, Button, Card } from "@/components/primitives";
import { Money } from "@/components/Money";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StepIndicator } from "@/components/StepIndicator";
import { usePixFlow } from "@/lib/PixFlow";
import { useToast } from "@/components/Toast";

export function PixConfirm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { recipient, amountCents, note, confirm } = usePixFlow();
  const [sending, setSending] = useState(false);

  if (!recipient || amountCents <= 0) return <Navigate to="/pix/destino" replace />;

  async function send() {
    setSending(true);
    /* Simula a latência da confirmação — a v4 trocava de tela instantaneamente. */
    await new Promise((r) => setTimeout(r, 900));
    confirm();
    toast("Pix enviado com sucesso.", "success");
    navigate("/pix/sucesso", { replace: true });
  }

  return (
    <div className="flex min-h-full flex-col pb-8">
      <ScreenHeader title="Confirme os dados" backTo="/pix/valor" />
      <StepIndicator current={2} />

      <div className="flex-1 space-y-5 px-6">
        <div className="py-2 text-center">
          <p className="text-[12px] text-muted">Você vai transferir</p>
          <p className="mt-1 text-[34px] font-bold tracking-tight text-ink">
            <Money cents={amountCents} />
          </p>
        </div>

        <Card className="divide-y divide-[color:var(--color-line)]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Avatar initials={recipient.initials} size={40} tone="neutral" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-ink">
                {recipient.name}
              </p>
              <p className="truncate text-[11.5px] text-muted">{recipient.bank}</p>
            </div>
          </div>
          <Row
            label={PIX_KEY_LABEL[recipient.keyType]}
            value={maskPixKey(recipient.pixKey, recipient.keyType)}
          />
          <Row label="Quando" value={`Hoje, ${formatFullDate(REFERENCE_DATE.toISOString())}`} />
          <Row label="De" value={`${account.holder} · Ag. ${account.agency}`} />
          {note && <Row label="Mensagem" value={note} />}
        </Card>

        <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-2/50 px-4 py-3 text-[12px] leading-relaxed text-muted">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
          Confira os dados antes de enviar. Um Pix concluído não pode ser cancelado.
        </p>
      </div>

      <div className="px-6 pt-5">
        <Button full onClick={send} disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              <LockKeyhole size={17} aria-hidden="true" />
              Confirmar e enviar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="shrink-0 text-[12.5px] text-muted">{label}</span>
      <span className="truncate text-right text-[13px] font-medium text-ink">
        {value}
      </span>
    </div>
  );
}
