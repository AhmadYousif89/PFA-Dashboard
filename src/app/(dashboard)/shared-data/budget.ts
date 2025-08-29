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

export async function getBudgetThemes() {
  const budgets = await getBudgets();
  return budgets.map((budget) => budget.theme);
}

async function getBudgetTransactions() {
  const categories = await getBudgetCategories();
  const { db } = await connectToDatabase();
  const transactions = await db
    .collection<TransactionDocument>("transactions")
    .find({ category: { $in: categories } })
    .sort({ date: -1 })
    .toArray();

  if (!transactions || transactions.length === 0) {
    return [];
  }

  return transactions.map((transaction) => ({
    ...transaction,
    id: transaction._id.toString(),
    amount: Number(transaction.amount),
  })) satisfies Transaction[];
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
  const transactions = await getBudgetTransactions();
  const totalSpent = transactions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  return totalSpent;
}

export async function calculateBudgetLimit() {
  const budgets = await getBudgets();
  return budgets.reduce((sum, budget) => sum + budget.maximum, 0);
}
