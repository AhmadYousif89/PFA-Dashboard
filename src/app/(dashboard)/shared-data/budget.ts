import connectToDatabase from "@/lib/db";
import {
  Budget,
  BudgetDocument,
  Transaction,
  TransactionDocument,
  TransactionCategory,
} from "@/lib/types";
import { cache } from "@/lib/cache";

const _cachedBudgets = await cache(
  async () => {
    const { db } = await connectToDatabase();
    const budgets = await db
      .collection<BudgetDocument>("budgets")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    if (!budgets || budgets.length === 0) {
      return [];
    }

    return budgets.map((budget) => ({
      id: budget._id.toString(),
      category: budget.category satisfies TransactionCategory,
      maximum: Number(budget.maximum),
      theme: budget.theme,
    })) satisfies Budget[];
  },
  ["GET_BUDGETS"],
  { revalidate: 300 }, // 5 minutes
);

export async function getBudgets() {
  return _cachedBudgets();
}

export async function getBudgetCategories() {
  const budgets = await getBudgets();
  return budgets.map((budget) => budget.category);
}

export async function getSpendingByCategory(category: TransactionCategory) {
  const { db } = await connectToDatabase();
  const transactions = await db
    .collection<TransactionDocument>("transactions")
    .find({ category })
    .toArray();

  if (!transactions || transactions.length === 0) {
    return 0;
  }

  const totalSpent = transactions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
  return totalSpent;
}

// Calculate total spending for all transactions that took place in budget categories
export async function calculateBudgetSpendings() {
  const transactions = await getBudgetTransactionsMap();
  let totalSpent = 0;

  for (const txs of Object.values(transactions)) {
    totalSpent += txs
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);
  }

  return totalSpent;
}

export async function calculateBudgetLimit() {
  const budgets = await getBudgets();
  return budgets.reduce((sum, budget) => sum + budget.maximum, 0);
}

type GetBudgetTransactionsMapOptions = { limit?: number };

const _cachedBudgetTransactionsMap = await cache(
  async (limit: number) => {
    const categories = await getBudgetCategories();
    if (categories.length === 0) return {} as Record<TransactionCategory, Transaction[]>;

    const { db } = await connectToDatabase();
    const txs = await db
      .collection<TransactionDocument>("transactions")
      .find({ category: { $in: categories } })
      .sort({ date: -1 })
      .toArray();

    if (!txs || txs.length === 0) {
      return {} as Record<TransactionCategory, Transaction[]>;
    }

    const mappedTxs = txs.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      date: t.date,
      amount: Number(t.amount),
      avatar: t.avatar,
      category: t.category,
      recurring: t.recurring,
    })) satisfies Transaction[];

    const grouped: Record<TransactionCategory, Transaction[]> = Object.create(null);
    for (const t of mappedTxs) {
      const key = t.category;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    }

    if (limit > 0) {
      for (const key of Object.keys(grouped) as TransactionCategory[]) {
        grouped[key] = grouped[key].slice(0, limit);
      }
    }

    return grouped;
  },
  ["getBudgetTransactionsMap"],
  { tags: ["transactions", "budgets"], revalidate: 600 },
);

export async function getBudgetTransactionsMap({
  limit = 0,
}: GetBudgetTransactionsMapOptions = {}) {
  return _cachedBudgetTransactionsMap(limit);
}
