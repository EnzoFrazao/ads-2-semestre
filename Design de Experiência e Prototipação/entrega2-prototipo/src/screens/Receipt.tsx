import { Link, useParams } from "react-router-dom";
import { Check, Download, FileWarning, Share2 } from "lucide-react";
import { account, transactions } from "@/data/mock";
import { findTransaction } from "@/lib/selectors";
import { formatFullDate, formatTime } from "@/lib/format";
import { Button, Card, EmptyState } from "@/components/primitives";
import { Money } from "@/components/Money";
import { ScreenHeader } from "@/components/ScreenHeader";
import { usePixFlow } from "@/lib/PixFlow";
import { useToast } from "@/components/Toast";

interface ReceiptView {
  id: string;
  amountCents: number;
  date: string;
  toName: string;
  toBank: string;
  note?: string;
  authentication: string;
}

/**
 * Comprovante — tela nova.
 * A v4 encerrava o Pix na tela de sucesso, sem gerar nenhum documento.
 */
export function Receipt() {
  const { id = "" } = useParams();
  const toast = useToast();
  const { receipt } = usePixFlow();

  const view = resolve(id, receipt);

  if (!view) {
    return (
      <div className="px-6 pb-8">
        <ScreenHeader title="Comprovante" backTo="/extrato" />
        <EmptyState
          icon={<FileWarning size={20} aria-hidden="true" />}
          title="Comprovante indisponível"
          description="Este lançamento não gerou comprovante ou o link expirou."
          action={
            <Link to="/extrato">
              <Button variant="secondary">Ver extrato</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <ScreenHeader title="Comprovante" subtitle="Pix enviado" />

      <div className="space-y-5 px-6">
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-2 border-b border-line bg-surface-3/40 px-5 py-6 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-success-dim text-success">
              <Check size={22} strokeWidth={3} aria-hidden="true" />
            </span>
            <p className="text-[24px] font-bold tracking-tight text-ink">
              <Money cents={view.amountCents} />
            </p>
            <p className="text-[12px] text-muted">
              {formatFullDate(view.date)} às {formatTime(view.date)}
            </p>
          </div>

          <dl className="divide-y divide-[color:var(--color-line)]">
            <Row label="Destinatário" value={view.toName} />
            <Row label="Instituição" value={view.toBank} />
            <Row label="Pagador" value={account.holder} />
            <Row label="CPF do pagador" value={account.document} />
            <Row label="Instituição do pagador" value={`${account.bank} · Ag. ${account.agency}`} />
            {view.note && <Row label="Mensagem" value={view.note} />}
            <Row label="Autenticação" value={view.authentication} mono />
          </dl>
        </Card>

        <div className="space-y-2.5">
          <Button full onClick={() => toast("Comprovante compartilhado.", "success")}>
            <Share2 size={17} aria-hidden="true" />
            Compartilhar comprovante
          </Button>
          <Button
            variant="secondary"
            full
            onClick={() => toast("PDF salvo em Downloads.", "success")}
          >
            <Download size={17} aria-hidden="true" />
            Salvar em PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function resolve(
  id: string,
  live: ReturnType<typeof usePixFlow>["receipt"],
): ReceiptView | null {
  if (live && live.id === id) {
    return {
      id: live.id,
      amountCents: live.amountCents,
      date: live.date,
      toName: live.recipient.name,
      toBank: live.recipient.bank,
      note: live.note || undefined,
      authentication: live.authentication,
    };
  }

  const tx = findTransaction(transactions, id);
  if (!tx || !tx.receiptId) return null;

  return {
    id: tx.id,
    amountCents: tx.amountCents,
    date: tx.date,
    toName: tx.counterparty,
    toBank: tx.kind === "in" ? "techX" : "Instituição parceira",
    authentication: `E${tx.id.replace(/\D/g, "").padStart(8, "0")}2026082000${tx.id.slice(-2)}`,
  };
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-[12px] text-muted">{label}</dt>
      <dd
        className={`min-w-0 break-all text-right text-[12.5px] font-medium text-ink ${
          mono ? "font-mono text-[11.5px]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
