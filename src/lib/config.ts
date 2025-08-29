import { ChartConfig } from "@/components/ui/chart";
import { SortFormat, TransactionSortKey } from "./types";

export const filterCategories = [
  "All Transactions",
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
] as const;

export const budgetCategories = filterCategories.filter((c) => c !== "All Transactions");

export const sortBy = ["Latest", "Oldest", "A to Z", "Z to A", "Highest", "Lowest"] as const;
export const sortMap: { [key in TransactionSortKey]: SortFormat | null } = {
  Latest: "date:desc",
  Oldest: "date:asc",
  "A to Z": "name:asc",
  "Z to A": "name:desc",
  Highest: "amount:desc",
  Lowest: "amount:asc",
} as const;

export const themeColors = {
  Green: "var(--color-green)",
  Yellow: "var(--color-yellow)",
  Cyan: "var(--color-cyan)",
  Navy: "var(--color-navy)",
  Red: "var(--color-red)",
  Purple: "var(--color-purple)",
  Turquoise: "var(--color-turquoise)",
  Brown: "var(--color-brown)",
  Magenta: "var(--color-magenta)",
  Blue: "var(--color-blue)",
  Grey: "var(--color-grey)",
  NavyGrey: "var(--color-navy-grey)",
  Army: "var(--color-army-green)",
  Pink: "var(--color-purple-light)",
  Orange: "var(--color-orange)",
  Gold: "var(--color-gold)",
} as const;

export const chartConfig = {
  entertainment: {
    label: "Entertainment",
    color: "var(--chart-1)",
  },
  diningOut: {
    label: "Dining Out",
    color: "var(--chart-2)",
  },
  bills: {
    label: "Bills",
    color: "var(--chart-3)",
  },
  personalCare: {
    label: "Personal Care",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;
