import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ClipboardPaste,
  HandCoins,
  KeyRound,
  QrCode,
} from "lucide-react";
import { contacts, myPixKeys } from "@/data/mock";
import { PIX_KEY_LABEL, maskPixKey } from "@/lib/format";
import { Avatar, Card, Section } from "@/components/primitives";
import { ScreenHeader } from "@/components/ScreenHeader";
import { usePixFlow } from "@/lib/PixFlow";
import { useToast } from "@/components/Toast";

/**
 * Hub do Pix — tela nova.
 * Na v4 o botão Pix caía direto na escolha de contato, sem oferecer
 * cobrar, copia e cola, QR Code ou gerenciar as próprias chaves.
 */
export function PixHub() {
  const navigate = useNavigate();
  const toast = useToast();
  const { selectContact, reset } = usePixFlow();

  const actions = [
    {
      key: "enviar",
      label: "Enviar",
      description: "Para uma chave ou contato",
      Icon: ArrowUpRight,
      onClick: () => {
        reset();
        navigate("/pix/destino");
      },
    },
    {
      key: "cobrar",
      label: "Cobrar",
      description: "Gere um QR Code de cobrança",
      Icon: HandCoins,
      onClick: () => toast("Cobrança ainda não implementada no protótipo.", "info"),
    },
    {
      key: "copiacola",
      label: "Copia e cola",
      description: "Cole o código Pix",
      Icon: ClipboardPaste,
      onClick: () => toast("Nenhum código Pix na área de transferência.", "error"),
    },
    {
      key: "qr",
      label: "Ler QR Code",
      description: "Use a câmera",
      Icon: QrCode,
      onClick: () => toast("A câmera não está disponível no protótipo.", "info"),
    },
  ];

  return (
    <div className="pb-8">
      <ScreenHeader title="Pix" subtitle="Transferências em segundos" backTo="/" />

      <div className="space-y-6 px-6">
        {/* ------------------------------- Ações ------------------------------ */}
        <ul className="grid grid-cols-2 gap-2.5">
          {actions.map(({ key, label, description, Icon, onClick }) => (
            <li key={key}>
              <button
                type="button"
                onClick={onClick}
                className="flex h-full w-full flex-col gap-2 rounded-2xl border border-line bg-surface-2/60 p-4 text-left transition hover:bg-surface-3/60"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-dim text-brand-2">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-ink">
                    {label}
                  </span>
                  <span className="block text-[11.5px] leading-snug text-muted">
                    {description}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* ------------------------- Contatos recentes ------------------------ */}
        <Section
          title="Contatos recentes"
          action={
            <Link
              to="/pix/destino"
              className="text-[12.5px] font-medium text-brand-2 hover:underline"
            >
              Ver todos
            </Link>
          }
        >
          <ul className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {contacts.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    selectContact(c);
                    navigate("/pix/valor");
                  }}
                  className="flex w-[74px] flex-col items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/5"
                >
                  <Avatar initials={c.initials} size={52} />
                  <span className="w-full truncate text-center text-[11.5px] text-dim">
                    {c.name.split(" ")[0]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* --------------------------- Minhas chaves -------------------------- */}
        <Section title="Minhas chaves">
          <Card className="divide-y divide-[color:var(--color-line)]">
            {myPixKeys.map((k) => (
              <div key={k.id} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-surface-3 text-dim">
                  <KeyRound size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink">
                    {PIX_KEY_LABEL[k.type]}
                  </span>
                  <span className="block truncate text-[12px] text-muted">
                    {maskPixKey(k.value, k.type)}
                  </span>
                </span>
              </div>
            ))}
          </Card>
        </Section>
      </div>
    </div>
  );
}
