import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";
import { ToastProvider } from "./Toast";

/**
 * Moldura do app.
 * Mobile-first: ocupa a tela inteira no celular; a partir de md exibe um
 * frame de 390x844 centralizado. A v4 era fixa em 390x844 e vazava no desktop.
 */
export function Layout({ withNav = true }: { withNav?: boolean }) {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  /* Cada navegação recomeça do topo — a v4 mantinha o scroll da tela anterior. */
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#08080c] md:p-6">
      <div
        className={[
          "relative flex w-full flex-col overflow-hidden bg-bg text-ink",
          "h-dvh md:h-[844px] md:w-[390px] md:rounded-[2.25rem]",
          "md:border md:border-line-strong md:shadow-2xl md:shadow-black/60",
        ].join(" ")}
      >
        <ToastProvider>
          <StatusBar />
          <main ref={mainRef} className="no-scrollbar flex-1 overflow-y-auto">
            <Outlet />
          </main>
          {withNav && <BottomNav />}
        </ToastProvider>
      </div>
    </div>
  );
}
