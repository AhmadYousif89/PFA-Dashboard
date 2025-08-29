import { cache } from "@/lib/cache";
import connectToDatabase from "@/lib/db";
import { Transaction, TransactionCategory, TransactionDocument } from "@/lib/types";

export async function getTransactions({
  limit = 0,
  category,
}: { limit?: number; category?: TransactionCategory } = {}) {
  return _cachedTransactions(limit, category);
}

const _cachedTransactions = await cache(
  async (limit, category) => {
    const { db } = await connectToDatabase();
    const transactions = await db
      .collection<TransactionDocument>("transactions")
      .find({
        ...(category ? { category } : {}),
      })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    if (!transactions || transactions.length === 0) {
      return [];
    }

    return transactions.map((transaction) => ({
      id: transaction._id.toString(),
      name: transaction.name,
      date: transaction.date,
      amount: Number(transaction.amount),
      avatar: transaction.avatar,
      category: transaction.category,
      recurring: transaction.recurring,
    })) satisfies Transaction[];
  },
  ["getTransactions"],
  {
    tags: ["transactions"],
    revalidate: 600,
  },
);
