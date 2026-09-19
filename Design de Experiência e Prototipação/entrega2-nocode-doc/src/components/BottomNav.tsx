import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CreditCard, House, Menu, Receipt, Zap } from "lucide-react";
import { cx } from "./primitives";

const TABS = [
  { to: "/", label: "Início", Icon: House, end: true },
  { to: "/extrato", label: "Extrato", Icon: Receipt, end: false },
  { to: "/cartoes", label: "Cartões", Icon: CreditCard, end: false },
  { to: "/mais", label: "Mais", Icon: Menu, end: false },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pixActive = pathname.startsWith("/pix");

  return (
    <nav
      aria-label="Navegação principal"
      className="relative shrink-0 border-t border-line bg-surface/95 backdrop-blur-md"
    >
      {/* Botão flutuante do Pix — ação primária do app */}
      <button
        type="button"
        onClick={() => navigate("/pix")}
        aria-label="Área Pix"
        aria-current={pixActive ? "page" : undefined}
        className={cx(
          "absolute -top-7 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center",
          "rounded-full brand-gradient text-white shadow-xl shadow-brand/40 transition",
          "hover:scale-105 active:scale-95",
          pixActive && "ring-4 ring-brand/30",
        )}
      >
        <Zap size={24} strokeWidth={2.4} aria-hidden="true" />
      </button>

      <ul className="grid grid-cols-5 items-center px-2 pb-5 pt-2.5">
        {TABS.slice(0, 2).map((tab) => (
          <NavItem key={tab.to} {...tab} />
        ))}
        <li aria-hidden="true" />
        {TABS.slice(2).map((tab) => (
          <NavItem key={tab.to} {...tab} />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({
  to,
  label,
  Icon,
  end,
}: {
  to: string;
  label: string;
  Icon: typeof House;
  end: boolean;
}) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cx(
            "flex flex-col items-center gap-1 rounded-xl py-1.5 transition",
            isActive ? "text-brand-2" : "text-muted hover:text-dim",
          )
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={21}
              strokeWidth={isActive ? 2.4 : 2}
              aria-hidden="true"
            />
            <span className="text-[10.5px] font-medium">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}
