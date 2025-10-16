import { ObjectId } from "mongodb";
import { themeColors, CATEGORY_SLUGS, sortBy } from "./config";

interface DBDocument {
  _id?: string | ObjectId;
}
interface BaseId {
  id: string;
}

type DocumentType<T> = T & DBDocument;
type BaseType<T> = T & BaseId;

export type BalanceDocument = DocumentType<BalanceT>;
export type PotDocument = DocumentType<PotT>;
export type BillDocument = DocumentType<BillT>;
export type BudgetDocument = DocumentType<BudgetT>;
export type TransactionDocument = DocumentType<TransactionT>;

export type Balance = BaseType<BalanceT>;
export type Pot = BaseType<PotT>;
export type Bill = BaseType<BillT>;
export type Budget = BaseType<BudgetT>;
export type Transaction = BaseType<TransactionT>;

type BalanceT = {
  userId?: ObjectId | string;
  current: number;
  income: number;
  expenses: number;
};

type PotT = {
  userId?: ObjectId | string;
  name: string;
  target: number;
  total: number;
  theme: ThemeColor;
};

type BillT = {
  name: "Paid Bills" | "Total Upcoming" | "Due Soon";
  amount: number;
  theme: ThemeColor;
};

type BudgetT = {
  userId?: ObjectId | string;
  category: TransactionCategory;
  maximum: number;
  theme: ThemeColor;
};

type TransactionT = {
  userId?: ObjectId | string;
  avatar: string;
  name: string;
  category: TransactionCategory;
  date: string;
  amount: number;
  recurring: boolean;
};

type SortByOrder = "asc" | "desc";
type SortByKey = "date" | "name" | "amount";
export type SortFormat = `${SortByKey}:${SortByOrder}`;
export type ThemeColorKey = keyof typeof themeColors;
export type ThemeColor = (typeof themeColors)[ThemeColorKey];
export type TransactionSortKey = (typeof sortBy)[number];
export type TransactionCategory = (typeof CATEGORY_SLUGS)[number];
export type TransactionWithPaymentStatus = Transaction & {
  paid?: boolean;
  dueSoon?: boolean;
  overdue?: boolean;
  dueDay?: number;
};
