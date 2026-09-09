import { Link, useParams } from "react-router-dom";
import { FileText, Repeat, Share2, TriangleAlert } from "lucide-react";
import { transactions } from "@/data/mock";
import { findTransaction } from "@/lib/selectors";
import { CATEGORY_LABEL, formatFullDate, formatTime } from "@/lib/format";
import { Button, Card, EmptyState } from "@/components/primitives";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Money } from "@/components/Money";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useToast } from "@/components/Toast";

const METHOD_LABEL: Record<string, string> = {
  pix: "Pix",
  debito: "Cartão de débito",
  credito: "Cartão de crédito",
  boleto: "Boleto",
  ted: "TED",
};

export function TransactionDetail() {
  const { id = "" } = useParams();
  const toast = useToast();
  const tx = findTransaction(transactions, id);

  if (!tx) {
    return (
      <div className="px-6 pb-8">
        <ScreenHeader title="Transação" backTo="/extrato" />
        <EmptyState
          icon={<TriangleAlert size={20} aria-hidden="true" />}
          title="Transação não encontrada"
          description="O lançamento que você tentou abrir não existe mais ou o link está incorreto."
          action={
            <Link to="/extrato">
              <Button variant="secondary">Voltar ao extrato</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <ScreenHeader title="Detalhe da transação" />

      <div className="space-y-5 px-6">
        {/* ------------------------------ Destaque ---------------------------- */}
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CategoryIcon category={tx.category} size={64} />
          <div>
            <p className="text-[26px] font-bold tracking-tight">
              <Money cents={tx.amountCents} kind={tx.kind} />
            </p>
            <p className="mt-1 text-[14px] font-medium text-ink">{tx.title}</p>
            <p className="text-[12.5px] text-muted">
              {formatFullDate(tx.date)} às {formatTime(tx.date)}
            </p>
          </div>
        </div>

        {/* ------------------------------ Detalhes ---------------------------- */}
        <Card className="divide-y divide-[color:var(--color-line)]">
          <Row label="Tipo" value={tx.kind === "in" ? "Entrada" : "Saída"} />
          <Row label="Categoria" value={CATEGORY_LABEL[tx.category]} />
          <Row label="Forma de pagamento" value={METHOD_LABEL[tx.method] ?? tx.method} />
          <Row
            label={tx.kind === "in" ? "Recebido de" : "Pago a"}
            value={tx.counterparty}
          />
          <Row label="Identificador" value={tx.id.toUpperCase()} mono />
        </Card>

        {/* -------------------------------- Ações ----------------------------- */}
        <div className="space-y-2.5">
          {tx.receiptId && (
            <Link to={`/comprovante/${tx.receiptId}`} className="block">
              <Button variant="secondary" full>
                <FileText size={17} aria-hidden="true" />
                Ver comprovante
              </Button>
            </Link>
          )}
          <Button
            variant="secondary"
            full
            onClick={() => toast("Comprovante compartilhado.", "success")}
          >
            <Share2 size={17} aria-hidden="true" />
            Compartilhar
          </Button>
          <Button
            variant="ghost"
            full
            onClick={() => toast("Contestação registrada. Retornamos em até 48h.", "info")}
          >
            <Repeat size={17} aria-hidden="true" />
            Contestar lançamento
          </Button>
        </div>
      </div>
    </div>
  );
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
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="shrink-0 text-[12.5px] text-muted">{label}</span>
      <span
        className={`truncate text-right text-[13.5px] font-medium text-ink ${
          mono ? "font-mono text-[12.5px]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
