import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Transaction } from "@/types";
import { CATEGORY_LABEL, formatTime } from "@/lib/format";
import { CategoryIcon } from "./CategoryIcon";
import { Money } from "./Money";

export function TxRow({ tx, hidden }: { tx: Transaction; hidden?: boolean }) {
  return (
    <li>
      <Link
        to={`/transacao/${tx.id}`}
        className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface-2/60 p-3.5 text-left transition hover:bg-surface-3/60"
      >
        <CategoryIcon category={tx.category} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">
            {tx.title}
          </span>
          <span className="block truncate text-[12px] text-muted">
            {CATEGORY_LABEL[tx.category]} · {formatTime(tx.date)}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Money cents={tx.amountCents} kind={tx.kind} hidden={hidden} className="text-[14px] font-semibold" />
          <ChevronRight size={16} className="text-muted" aria-hidden="true" />
        </span>
      </Link>
    </li>
  );
}
