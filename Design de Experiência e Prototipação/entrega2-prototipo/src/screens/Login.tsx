import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Fingerprint, Loader2, Zap } from "lucide-react";
import { account } from "@/data/mock";
import { Avatar, Button } from "@/components/primitives";

/**
 * Entrada do app — tela nova.
 * A v4 abria direto na Home, sem nenhuma noção de sessão ou identidade.
 */
export function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function enter() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate("/", { replace: true });
  }

  return (
    <div className="flex min-h-full flex-col justify-between px-6 pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="brand-gradient flex size-16 items-center justify-center rounded-2xl shadow-xl shadow-brand/30">
          <Zap size={30} strokeWidth={2.4} className="text-white" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-[26px] font-bold tracking-tight text-ink">techX</h1>
        <p className="mt-1 text-[13px] text-muted">Seu banco digital</p>

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
          <Avatar initials={account.initials} size={40} />
          <div className="text-left">
            <p className="text-[14px] font-semibold text-ink">
              {account.holder.split(" ").slice(0, 2).join(" ")}
            </p>
            <p className="text-[11.5px] text-muted">Ag. {account.agency}</p>
          </div>
        </div>
      </div>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void enter();
        }}
      >
        <label htmlFor="password" className="block text-[12.5px] font-semibold text-dim">
          Senha de 6 dígitos
        </label>
        <input
          id="password"
          type="password"
          inputMode="numeric"
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••••"
          className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3.5 text-center text-[20px] tracking-[0.5em] text-ink placeholder:text-muted"
        />

        <Button type="submit" full disabled={password.length < 6 || loading}>
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              Entrando…
            </>
          ) : (
            <>
              Entrar
              <ArrowRight size={17} aria-hidden="true" />
            </>
          )}
        </Button>

        <Button type="button" variant="secondary" full onClick={() => void enter()}>
          <Fingerprint size={17} aria-hidden="true" />
          Entrar com biometria
        </Button>
      </form>
    </div>
  );
}
