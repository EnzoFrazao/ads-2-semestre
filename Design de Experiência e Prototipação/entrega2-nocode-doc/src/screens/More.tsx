import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  FileText,
  Fingerprint,
  KeyRound,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { account } from "@/data/mock";
import { Avatar, Button, Card, Section } from "@/components/primitives";
import { useToast } from "@/components/Toast";

const GROUPS = [
  {
    title: "Conta",
    items: [
      { key: "dados", label: "Meus dados", description: "Nome, CPF e endereço", Icon: UserRound },
      { key: "chaves", label: "Minhas chaves Pix", description: "3 chaves cadastradas", Icon: KeyRound },
      { key: "limites", label: "Limites e horários", description: "Pix, TED e saques", Icon: FileText },
    ],
  },
  {
    title: "Segurança",
    items: [
      { key: "bio", label: "Biometria", description: "Ativada neste aparelho", Icon: Fingerprint },
      { key: "senha", label: "Alterar senha", description: "Última troca há 3 meses", Icon: ShieldCheck },
      { key: "notif", label: "Notificações", description: "Push, e-mail e SMS", Icon: Bell },
    ],
  },
  {
    title: "Ajuda",
    items: [
      { key: "faq", label: "Central de ajuda", description: "Dúvidas frequentes", Icon: CircleHelp },
    ],
  },
] as const;

export function More() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="space-y-6 px-6 pb-8">
      <header className="pt-1">
        <h1 className="text-[20px] font-bold text-ink">Mais</h1>
      </header>

      {/* ------------------------------- Perfil ------------------------------- */}
      <Card className="flex items-center gap-3.5 p-4">
        <Avatar initials={account.initials} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15.5px] font-semibold text-ink">
            {account.holder}
          </p>
          <p className="truncate text-[12px] text-muted">
            Ag. {account.agency} · Conta {account.number}
          </p>
          <p className="truncate text-[12px] text-muted">CPF {account.document}</p>
        </div>
      </Card>

      {/* ------------------------------- Grupos ------------------------------- */}
      {GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          <Card className="divide-y divide-[color:var(--color-line)]">
            {group.items.map(({ key, label, description, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => toast(`"${label}" não faz parte deste protótipo.`, "info")}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-dim">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium text-ink">
                    {label}
                  </span>
                  <span className="block truncate text-[11.5px] text-muted">
                    {description}
                  </span>
                </span>
                <ChevronRight size={16} className="text-muted" aria-hidden="true" />
              </button>
            ))}
          </Card>
        </Section>
      ))}

      <Button
        variant="danger"
        full
        onClick={() => {
          toast("Sessão encerrada.", "info");
          navigate("/login");
        }}
      >
        <LogOut size={17} aria-hidden="true" />
        Sair da conta
      </Button>

      <p className="pt-1 text-center text-[11px] text-muted">
        techX · versão 1.0.0 — protótipo acadêmico
      </p>
    </div>
  );
}
