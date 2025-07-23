import { categories, sortBy } from "@/components/data-table-toolbar";

type SortByOrder = "asc" | "desc";
type SortByKey = "date" | "name" | "amount";
export type SortFormat = `${SortByKey}:${SortByOrder}`;
export type SortTransactionBy = (typeof sortBy)[number];

export type TTransactionItem = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
};

export type Category = (typeof categories)[number];
