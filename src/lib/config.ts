import { ChartConfig } from "@/components/ui/chart";
import { SortFormat, TransactionSortKey } from "./types";

export type CategoryLabel = (typeof CATEGORIES)[number];
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
export const CATEGORIES = [
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

export const CATEGORY_SLUGS = [
  "all-transactions",
  "entertainment",
  "bills",
  "groceries",
  "dining-out",
  "transportation",
  "personal-care",
  "education",
  "lifestyle",
  "shopping",
  "general",
] as const;

export const categoryLabels: Record<CategorySlug, CategoryLabel> = {
  "all-transactions": "All Transactions",
  entertainment: "Entertainment",
  bills: "Bills",
  groceries: "Groceries",
  "dining-out": "Dining Out",
  transportation: "Transportation",
  "personal-care": "Personal Care",
  education: "Education",
  lifestyle: "Lifestyle",
  shopping: "Shopping",
  general: "General",
} as const;

export const budgetCategories = CATEGORY_SLUGS.filter((c) => c !== "all-transactions");

export function getCategoryLabel(slug: (typeof CATEGORY_SLUGS)[number]) {
  return categoryLabels[slug];
}

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
