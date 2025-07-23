import Image from "next/image";

import { TTransactionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type TransactionItemProps = {
  data: TTransactionItem;
  inTable?: boolean;
};

export const TransactionItem = ({ data, inTable = false }: TransactionItemProps) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "exceptZero",
  }).format(data.amount);

  return (
    <>
      <div className={cn("flex items-center", inTable ? "gap-3" : "gap-4")}>
        <Image
          src={data.avatar}
          alt={`${data.name}'s profile image`}
          className="size-8 rounded-full md:size-10"
          width={160}
          height={160}
        />
        <div className="flex flex-col gap-1 text-left">
          <h3 className="text-14-bold">{data.name}</h3>
          {inTable ? <span className="text-12 text-muted-foreground">{data.category}</span> : null}
        </div>
      </div>
      <div className={cn("flex flex-col items-end", inTable ? "gap-1" : "gap-2")}>
        <span className={`text-14-bold ${data.amount > 0 ? "text-primary" : "text-foreground"}`}>
          {formattedAmount}
        </span>
        <span className="text-12 text-muted-foreground">
          {new Date(data.date).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </>
  );
};
