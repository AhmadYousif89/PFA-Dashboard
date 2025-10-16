import { cache } from "@/lib/cache";
import connectToDatabase from "@/lib/db";
import { Transaction, TransactionCategory, TransactionDocument } from "@/lib/types";
import { DEMO_USER_ID } from "./scoped-user";

export async function getTransactions({
  limit = 0,
  category,
}: { limit?: number; category?: TransactionCategory } = {}) {
  return _cachedTransactions(limit, category);
}

const _cachedTransactions = cache(
  async (limit, category) => {
    const { db } = await connectToDatabase();
    const transactions = await db
      .collection<TransactionDocument>("transactions")
      .find({
        userId: DEMO_USER_ID,
        ...(category ? { category } : {}),
      })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    if (!transactions || transactions.length === 0) {
      return [];
    }

    return transactions.map((t) => ({
      id: t._id.toString(),
      userId: t.userId?.toString(),
      name: t.name,
      date: t.date,
      amount: Number(t.amount),
      avatar: t.avatar,
      category: t.category,
      recurring: t.recurring,
    })) satisfies Transaction[];
  },
  ["Transactions"],
  { revalidate: 60 },
);
