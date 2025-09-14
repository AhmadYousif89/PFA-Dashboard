import connectToDatabase from "@/lib/db";
import {
  Budget,
  BudgetDocument,
  Transaction,
  TransactionDocument,
  TransactionCategory,
} from "@/lib/types";
import { cache } from "@/lib/cache";

const _cachedBudgets = cache(
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
  ["Budgets"],
  { revalidate: 60 }, // revalidate every 1 minute
);

export async function getBudgets() {
  return _cachedBudgets();
}

async function getBudgetCategories() {
  const budgets = await getBudgets();
  return budgets.map((budget) => budget.category);
}

const _cachedBudgetTransactionsMap = cache(
  async () => {
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

    return grouped;
  },
  ["Budgets:TransactionMap"],
  { revalidate: 60 },
);

export async function getBudgetTransactionsMap({ limit = 0 }: { limit?: number }) {
  const result = await _cachedBudgetTransactionsMap();
  if (limit <= 0) return result;

  const limited: Record<TransactionCategory, Transaction[]> = Object.create(null);
  for (const key of Object.keys(result) as TransactionCategory[]) {
    limited[key] = result[key].slice(0, limit);
  }
  return limited;
}

const _cachedSpendingsByCategoryMap = cache(
  async () => {
    const categories = await getBudgetCategories();
    if (categories.length === 0) return {} as Record<TransactionCategory, number>;

    const { db } = await connectToDatabase();
    const results = await db
      .collection<TransactionDocument>("transactions")
      .aggregate([
        { $match: { category: { $in: categories }, amount: { $lt: 0 } } },
        { $group: { _id: "$category", total: { $sum: { $abs: "$amount" } } } },
      ])
      .toArray();

    const map: Record<TransactionCategory, number> = Object.create(null);
    for (const cat of categories) map[cat] = 0;
    for (const r of results) map[r._id as TransactionCategory] = Number(r.total) || 0;
    return map;
  },
  ["Budgets:SpendingMap"],
  { revalidate: 60 },
);

export async function getSpendingByCategoryMap() {
  return _cachedSpendingsByCategoryMap();
}
