import connectToDatabase from "@/lib/db";
import { BalanceDocument, TransactionDocument } from "@/lib/types";
import { DEMO_USER_ID } from "./scoped-user";

export async function getBalance() {
  const { db } = await connectToDatabase();
  const balance = await db
    .collection<BalanceDocument>("balances")
    .findOne({ userId: DEMO_USER_ID });
  if (!balance) {
    return { current: 0 };
  }
  return { current: balance.current };
}

export async function getTotalExpenses() {
  const { db } = await connectToDatabase();

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalExpenses: number }>([
      { $match: { userId: DEMO_USER_ID, amount: { $lt: 0 } } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $abs: "$amount" } },
        },
      },
    ])
    .toArray();

  return result[0]?.totalExpenses || 0;
}

export async function getAverageMonthlyIncome() {
  const { db } = await connectToDatabase();

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ avgIncome: number; months: number }>([
      { $match: { userId: DEMO_USER_ID, amount: { $gt: 0 } } },
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateAsDate" },
            month: { $month: "$dateAsDate" },
          },
          monthlyIncome: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          avgIncome: { $avg: "$monthlyIncome" },
          months: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return result[0]?.avgIncome || 0;
}
