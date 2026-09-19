import { Navigate, useNavigate } from "react-router-dom";
import { Check, FileText, House } from "lucide-react";
import { formatFullDate, formatTime } from "@/lib/format";
import { Button, Card } from "@/components/primitives";
import { Money } from "@/components/Money";
import { usePixFlow } from "@/lib/PixFlow";

export function PixSuccess() {
  const navigate = useNavigate();
  const { receipt, reset } = usePixFlow();

  if (!receipt) return <Navigate to="/pix" replace />;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 pb-8 text-center">
      {/* Animação respeita prefers-reduced-motion via regra global no index.css */}
      <span
        className="flex size-20 animate-[pop_400ms_ease-out] items-center justify-center rounded-full bg-success-dim text-success"
        style={{ boxShadow: "0 0 0 12px rgba(52,211,153,0.06)" }}
      >
        <Check size={40} strokeWidth={3} aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-[22px] font-bold text-ink" role="status">
        Pix enviado!
      </h1>
      <p className="mt-1.5 text-[13px] text-muted">
        {formatFullDate(receipt.date)} às {formatTime(receipt.date)}
      </p>

      <p className="mt-5 text-[32px] font-bold tracking-tight text-ink">
        <Money cents={receipt.amountCents} />
      </p>

      <Card className="mt-5 w-full p-4 text-left">
        <p className="text-[11.5px] text-muted">Para</p>
        <p className="mt-0.5 text-[15px] font-semibold text-ink">
          {receipt.recipient.name}
        </p>
        <p className="text-[12px] text-muted">{receipt.recipient.bank}</p>
        {receipt.note && (
          <p className="mt-3 border-t border-line pt-3 text-[12.5px] text-dim">
            “{receipt.note}”
          </p>
        )}
      </Card>

      <div className="mt-6 w-full space-y-2.5">
        <Button full onClick={() => navigate(`/comprovante/${receipt.id}`)}>
          <FileText size={17} aria-hidden="true" />
          Ver comprovante
        </Button>
        <Button
          variant="secondary"
          full
          onClick={() => {
            reset();
            navigate("/");
          }}
        >
          <House size={17} aria-hidden="true" />
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}
