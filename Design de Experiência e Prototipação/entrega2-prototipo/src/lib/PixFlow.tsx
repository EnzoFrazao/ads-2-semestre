import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Contact, PixKeyType } from "@/types";
import { account } from "@/data/mock";
import { REFERENCE_DATE } from "@/lib/format";

/**
 * Máquina de estado do fluxo Pix.
 * A v4 guardava tudo em useState solto dentro do App.tsx: o passo era um número
 * e não havia validação nenhuma antes de "confirmar".
 */

export interface PixRecipient {
  name: string;
  initials: string;
  bank: string;
  pixKey: string;
  keyType: PixKeyType;
}

export interface PixReceipt {
  id: string;
  recipient: PixRecipient;
  amountCents: number;
  note: string;
  date: string;
  authentication: string;
}

interface PixFlowValue {
  recipient: PixRecipient | null;
  amountCents: number;
  note: string;
  receipt: PixReceipt | null;
  selectContact: (c: Contact) => void;
  selectKey: (key: string, keyType: PixKeyType) => void;
  setAmount: (cents: number) => void;
  setNote: (note: string) => void;
  /** null = válido; string = mensagem de erro a exibir. */
  validateAmount: (cents: number) => string | null;
  confirm: () => PixReceipt;
  reset: () => void;
}

const PixFlowContext = createContext<PixFlowValue | null>(null);

export function PixFlowProvider({ children }: { children: ReactNode }) {
  const [recipient, setRecipient] = useState<PixRecipient | null>(null);
  const [amountCents, setAmountCents] = useState(0);
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<PixReceipt | null>(null);

  const selectContact = useCallback((c: Contact) => {
    setRecipient({
      name: c.name,
      initials: c.initials,
      bank: c.bank,
      pixKey: c.pixKey,
      keyType: c.keyType,
    });
  }, []);

  const selectKey = useCallback((key: string, keyType: PixKeyType) => {
    setRecipient({
      name: "Destinatário techX",
      initials: "DT",
      bank: "techX",
      pixKey: key,
      keyType,
    });
  }, []);

  const validateAmount = useCallback((cents: number): string | null => {
    if (cents <= 0) return "Informe um valor maior que zero.";
    if (cents > account.balanceCents) return "Valor acima do saldo disponível.";
    if (cents > 500_000) return "Limite de R$ 5.000,00 por Pix neste horário.";
    return null;
  }, []);

  const confirm = useCallback((): PixReceipt => {
    const next: PixReceipt = {
      id: `pix-${Date.now().toString(36)}`,
      recipient: recipient!,
      amountCents,
      note,
      date: REFERENCE_DATE.toISOString(),
      authentication: `E18432720260820094100${String(amountCents).padStart(8, "0")}`,
    };
    setReceipt(next);
    return next;
  }, [amountCents, note, recipient]);

  const reset = useCallback(() => {
    setRecipient(null);
    setAmountCents(0);
    setNote("");
    setReceipt(null);
  }, []);

  const value = useMemo<PixFlowValue>(
    () => ({
      recipient,
      amountCents,
      note,
      receipt,
      selectContact,
      selectKey,
      setAmount: setAmountCents,
      setNote,
      validateAmount,
      confirm,
      reset,
    }),
    [
      amountCents,
      confirm,
      note,
      receipt,
      recipient,
      reset,
      selectContact,
      selectKey,
      validateAmount,
    ],
  );

  return <PixFlowContext.Provider value={value}>{children}</PixFlowContext.Provider>;
}

export function usePixFlow(): PixFlowValue {
  const ctx = useContext(PixFlowContext);
  if (!ctx) throw new Error("usePixFlow precisa estar dentro de <PixFlowProvider>");
  return ctx;
}
