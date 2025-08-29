import connectToDatabase from "@/lib/db";
import { BalanceDocument, TransactionDocument } from "@/lib/types";

export async function getBalance() {
  const { db } = await connectToDatabase();
  const balance = await db.collection<BalanceDocument>("balances").findOne({});
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
      { $match: { amount: { $lt: 0 } } },
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
      { $match: { amount: { $gt: 0 } } },
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

export async function calculateMonthlyExpenses(
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
) {
  const { db } = await connectToDatabase();

  const firstDayOfMonth = new Date(year, month, 1); // Month of January is 0
  const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of the month

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalExpenses: number }>([
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $match: {
          dateAsDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          amount: { $lt: 0 },
        },
      },
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

export async function calculateMonthlyIncome(
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
) {
  const { db } = await connectToDatabase();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalIncome: number }>([
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $match: {
          dateAsDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  return result[0]?.totalIncome || 0;
}

export async function updateBalance() {
  const { db } = await connectToDatabase();

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalBalance: number }>([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  const newBalance = result[0]?.totalBalance || 0;

  await db
    .collection<BalanceDocument>("balances")
    .updateOne({}, { $set: { current: newBalance } }, { upsert: true });

  return newBalance;
}
