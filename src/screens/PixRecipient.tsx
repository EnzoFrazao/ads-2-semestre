import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TriangleAlert, UserRoundSearch } from "lucide-react";
import { contacts } from "@/data/mock";
import { PIX_KEY_LABEL } from "@/lib/format";
import type { PixKeyType } from "@/types";
import { Avatar, Button, Card, Chip, EmptyState } from "@/components/primitives";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StepIndicator } from "@/components/StepIndicator";
import { usePixFlow } from "@/lib/PixFlow";

const KEY_TYPES: PixKeyType[] = ["cpf", "email", "telefone", "aleatoria"];

/** Regras de formato por tipo de chave — a v4 aceitava qualquer texto. */
const VALIDATORS: Record<PixKeyType, (v: string) => string | null> = {
  cpf: (v) =>
    /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(v.trim())
      ? null
      : "Informe um CPF válido, com 11 dígitos.",
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? null
      : "Informe um e-mail válido.",
  telefone: (v) =>
    /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(v.trim())
      ? null
      : "Informe um telefone com DDD.",
  aleatoria: (v) =>
    v.trim().length >= 32 ? null : "A chave aleatória tem 32 caracteres.",
};

export function PixRecipient() {
  const navigate = useNavigate();
  const { selectContact, selectKey } = usePixFlow();

  const [keyType, setKeyType] = useState<PixKeyType>("cpf");
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [search, setSearch] = useState("");

  const error = useMemo(
    () => (value.trim() ? VALIDATORS[keyType](value) : "Informe a chave do destinatário."),
    [keyType, value],
  );
  const showError = touched && error !== null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.pixKey.toLowerCase().includes(q),
    );
  }, [search]);

  function submit() {
    setTouched(true);
    if (error) return;
    selectKey(value.trim(), keyType);
    navigate("/pix/valor");
  }

  return (
    <div className="pb-8">
      <ScreenHeader title="Para quem você quer enviar?" backTo="/pix" />
      <StepIndicator current={0} />

      <div className="space-y-6 px-6">
        {/* --------------------------- Tipo de chave -------------------------- */}
        <fieldset>
          <legend className="mb-2.5 text-[12.5px] font-semibold text-dim">
            Tipo de chave
          </legend>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {KEY_TYPES.map((t) => (
              <Chip
                key={t}
                active={keyType === t}
                onClick={() => {
                  setKeyType(t);
                  setTouched(false);
                }}
              >
                {PIX_KEY_LABEL[t]}
              </Chip>
            ))}
          </div>
        </fieldset>

        {/* ------------------------------- Campo ------------------------------ */}
        <div>
          <label
            htmlFor="pix-key"
            className="mb-2 block text-[12.5px] font-semibold text-dim"
          >
            Chave Pix
          </label>
          <input
            id="pix-key"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            inputMode={keyType === "email" ? "email" : "text"}
            placeholder={PLACEHOLDERS[keyType]}
            aria-invalid={showError}
            aria-describedby={showError ? "pix-key-error" : undefined}
            className={`w-full rounded-xl border bg-surface-2 px-4 py-3.5 text-[15px] text-ink placeholder:text-muted ${
              showError ? "border-danger" : "border-line"
            }`}
          />
          {showError && (
            <p
              id="pix-key-error"
              role="alert"
              className="mt-2 flex items-center gap-1.5 text-[12.5px] text-danger"
            >
              <TriangleAlert size={14} aria-hidden="true" />
              {error}
            </p>
          )}
        </div>

        <Button full onClick={submit} disabled={!value.trim()}>
          Continuar
          <ArrowRight size={17} aria-hidden="true" />
        </Button>

        {/* ------------------------------ Contatos ---------------------------- */}
        <section className="space-y-2.5">
          <h2 className="text-[15px] font-semibold text-ink">Ou escolha um contato</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contato"
            aria-label="Buscar contato"
            className="w-full rounded-xl border border-line bg-surface-2 px-4 py-2.5 text-[13.5px] text-ink placeholder:text-muted"
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={<UserRoundSearch size={20} aria-hidden="true" />}
              title="Nenhum contato"
              description="Não encontramos ninguém com esse nome ou chave."
            />
          ) : (
            <Card className="divide-y divide-[color:var(--color-line)]">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    selectContact(c);
                    navigate("/pix/valor");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <Avatar initials={c.initials} size={38} tone="neutral" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-ink">
                      {c.name}
                    </span>
                    <span className="block truncate text-[11.5px] text-muted">
                      {c.bank} · {PIX_KEY_LABEL[c.keyType]}
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-muted" aria-hidden="true" />
                </button>
              ))}
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

const PLACEHOLDERS: Record<PixKeyType, string> = {
  cpf: "000.000.000-00",
  email: "nome@email.com",
  telefone: "(11) 90000-0000",
  aleatoria: "00000000-0000-0000-0000-000000000000",
};
