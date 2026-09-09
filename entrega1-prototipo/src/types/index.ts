/** Modelo de domínio do techX. A versão do Figma Make não tinha tipos: */
/** valores e datas viviam como string solta dentro do JSX.            */

export type TransactionKind = "in" | "out";

export type Category =
  | "alimentacao"
  | "assinaturas"
  | "transporte"
  | "moradia"
  | "saude"
  | "lazer"
  | "receita"
  | "transferencia";

export interface Transaction {
  id: string;
  title: string;
  /** Contraparte da operação (quem pagou ou recebeu). */
  counterparty: string;
  /** Em centavos — evita erro de ponto flutuante em dinheiro. */
  amountCents: number;
  kind: TransactionKind;
  category: Category;
  /** ISO 8601. Formatado na exibição via Intl, nunca hardcoded. */
  date: string;
  method: "pix" | "debito" | "credito" | "boleto" | "ted";
  /** Presente quando a transação gera comprovante (Pix, TED). */
  receiptId?: string;
}

export interface Account {
  holder: string;
  initials: string;
  bank: string;
  agency: string;
  number: string;
  document: string;
  balanceCents: number;
}

export interface CreditCard {
  id: string;
  label: string;
  brand: "VISA" | "MASTERCARD";
  last4: string;
  type: "credito" | "debito";
  invoiceCents: number;
  limitCents: number;
  usedCents: number;
  dueDate: string;
  blocked: boolean;
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  bank: string;
  pixKey: string;
  keyType: PixKeyType;
}

export type PixKeyType = "cpf" | "email" | "telefone" | "aleatoria";

export interface PixKeyEntry {
  id: string;
  type: PixKeyType;
  value: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  kind: "transacao" | "seguranca" | "aviso";
  read: boolean;
}

export interface CategorySummary {
  category: Category;
  totalCents: number;
  share: number;
}
