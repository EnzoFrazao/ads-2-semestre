import { useCallback, useEffect, useState } from "react";

/**
 * Estado persistido. Na v4 o "ocultar saldo" voltava ao padrão a cada reload —
 * uma preferência de privacidade que não deveria se perder.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* modo privado / cota cheia — seguir sem persistir */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, reset] as const;
}
