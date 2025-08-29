import Image from "next/image";
import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getTransactions } from "@/app/(dashboard)/shared-data/transactions";

export const TransactionsSummary = async () => {
  const transactions = await getTransactions({ limit: 5 });

  if (transactions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You don&apos;t have any transactions at the moment.
      </p>
    );
  }

  return (
    <ul>
      {transactions.map((transaction, idx) => (
        <Fragment key={`transaction-${idx}`}>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={transaction.avatar}
                alt={`${transaction.name}'s profile image`}
                className="size-8 rounded-full md:size-10"
                width={130}
                height={130}
              />
              <h3 className="text-sm font-bold">{transaction.name}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-sm font-bold ${transaction.amount > 0 ? "text-primary" : "text-foreground"}`}
              >
                {formatCurrency(transaction.amount, {
                  maximumFractionDigits: 2,
                  signDisplay: "exceptZero",
                })}
              </span>
              <span className="text-muted-foreground text-xs">{formatDate(transaction.date)}</span>
            </div>
          </li>
          <Separator className="bg-muted my-5 last:hidden" />
        </Fragment>
      ))}
    </ul>
  );
};
