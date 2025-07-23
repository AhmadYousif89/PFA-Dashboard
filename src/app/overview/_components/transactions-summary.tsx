import { Fragment } from "react";

import DATA from "@/lib/data.json";
import { TransactionItem } from "@/components/transaction-item";
import { Separator } from "@/components/ui/separator";

export const TransactionsSummary = () => {
  const transactions = DATA.transactions.slice(0, 5);

  return (
    <ul>
      {transactions.map((transaction, idx) => (
        <Fragment key={`transaction-${idx}`}>
          <li className="flex items-center justify-between">
            <TransactionItem data={transaction} />
          </li>
          <Separator className="bg-muted my-5 last:hidden" />
        </Fragment>
      ))}
    </ul>
  );
};
