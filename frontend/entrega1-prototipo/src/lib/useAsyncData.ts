import { useCallback, useEffect, useState } from "react";

export type LoadState = "loading" | "ready" | "error";

/**
 * Simula o ciclo de vida de uma requisição para que as telas exercitem
 * loading / erro / sucesso. A versão do Figma Make renderizava tudo
 * instantaneamente e não tinha nenhum desses estados.
 */
export function useAsyncData<T>(value: T, delay = 550, shouldFail = false) {
  const [state, setState] = useState<LoadState>("loading");

  const load = useCallback(() => {
    setState("loading");
    const id = window.setTimeout(
      () => setState(shouldFail ? "error" : "ready"),
      delay,
    );
    return () => window.clearTimeout(id);
  }, [delay, shouldFail]);

  useEffect(() => load(), [load]);

  return { state, data: value, retry: load };
}
