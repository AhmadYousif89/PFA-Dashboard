import Image from "next/image";

import DATA from "@/lib/data.json";
import { Fragment } from "react";

export const TransactionsSummary = () => {
  const transactions = DATA.transactions.slice(0, 5);

  return (
    <ul>
      {transactions.map((transaction, idx) => (
        <Fragment key={transaction.name}>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={transaction.avatar}
                alt={`${transaction.name}'s profile image`}
                width={160}
                height={160}
                className="size-8 rounded-full"
              />
              <h3 className="text-14-bold">{transaction.name}</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span
                className={`text-14-bold ${transaction.amount > 0 ? "text-primary" : "text-foreground"}`}
              >
                {transaction.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  signDisplay: "always",
                })}
              </span>
              <span className="text-12 text-muted-foreground">
                {new Date(transaction.date).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </li>
          {idx < transactions.length - 1 && (
            <hr className="border-muted my-5 h-px" />
          )}
        </Fragment>
      ))}
    </ul>
  );
};
