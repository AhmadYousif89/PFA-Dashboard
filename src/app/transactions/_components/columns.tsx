"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { TTransactionItem } from "@/lib/types";

export const columns: ColumnDef<TTransactionItem>[] = [
  {
    accessorKey: "name",
    header: "Recipient / Sender",
    size: 300,
    minSize: 200,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-3 md:gap-4">
          <Image
            src={data.avatar}
            alt={`Avatar of ${data.name}`}
            className="size-8 rounded-full md:size-10"
            width={160}
            height={160}
          />
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-14-bold">{data.name}</h3>
            <span className="text-12 text-muted-foreground md:hidden">{data.category}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 150,
    minSize: 100,
    cell: ({ row }) => (
      <span className="text-12 text-muted-foreground">{row.getValue("category")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    size: 150,
    minSize: 100,
    cell: ({ row }) => (
      <span className="text-12 text-muted-foreground">
        {new Date(row.getValue("date")).toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 150,
    minSize: 100,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return (
        <span className={`text-14-bold ${amount < 0 ? "text-foreground" : "text-primary"}`}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            signDisplay: "exceptZero",
          }).format(amount)}
        </span>
      );
    },
  },
];
