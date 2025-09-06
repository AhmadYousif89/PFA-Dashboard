import { cache } from "@/lib/cache";
import connectToDatabase from "@/lib/db";
import { Bill, Transaction, TransactionDocument, TransactionWithPaymentStatus } from "@/lib/types";
import { getCycleBoundsFromDueDay, nextMonthlyDue } from "../utils";

type RecurringBillGroup = {
  name: string;
  lastPayment: Date;
  lastAmount: number;
  avgAmount: number;
};

const CATEGORY_BILLS = "Bills";
const DEFAULT_WINDOW_DAYS = 7;

// Cache reusable aggregations
const _cachedRecurringBills = cache(getRecurringBills, ["bills:recurring"], {
  tags: ["transactions"],
  revalidate: 60,
});

const addDateStage = { $addFields: { dateAsDate: { $dateFromString: { dateString: "$date" } } } };

const _cachedComputeBillFlags = cache(
  async (now = new Date(), windowDays = DEFAULT_WINDOW_DAYS) => {
    const groups = await _cachedRecurringBills(); // {name, lastPayment, avgAmount}[]

    const dueSoon = new Set<string>();
    const overdue = new Set<string>();
    const paidThisCycle = new Set<string>();
    const dueDayMap: Record<string, number> = {};

    const end = new Date(now);
    end.setDate(now.getDate() + windowDays);

    for (const g of groups) {
      const last = new Date(g.lastPayment);
      const dueDay = last.getDate();
      const { cycleStart, nextDue } = getCycleBoundsFromDueDay(dueDay, now);

      dueDayMap[g.name] = nextMonthlyDue(g.lastPayment).getDate();
      // Paid only if last payment happened within the current cycle window
      const isPaid = last >= cycleStart && last < nextDue;
      if (isPaid) {
        paidThisCycle.add(g.name);
        continue;
      }

      // Only unpaid bills get dueSoon/overdue flags
      if (nextDue < now) {
        overdue.add(g.name);
      } else if (nextDue <= end) {
        dueSoon.add(g.name);
      }
    }

    return {
      // sort for stable results (nice for caching/diffs)
      dueSoon: Array.from(dueSoon).sort(),
      overdue: Array.from(overdue).sort(),
      paidThisCycle: Array.from(paidThisCycle).sort(),
      dueDayMap,
    };
  },
  ["bills:flags"],
  { tags: ["transactions"], revalidate: 60 },
);

const _cachedBillsSummary = cache(
  async () => {
    const summaryBillTitles = ["Paid Bills", "Total Upcoming", "Due Soon"] as const;

    const [paid, upcoming, due] = await Promise.all([
      calcTotalPaidBills(),
      calcTotalUpcomingBills(),
      calcTotalDueBills(),
    ]);

    const summary = summaryBillTitles.map((name, i) => {
      const amount = i === 0 ? paid : i === 1 ? upcoming : due;
      const bill = {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        amount,
        theme:
          i === 0 ? "var(--color-green)" : i === 1 ? "var(--color-yellow)" : "var(--color-cyan)",
      } as Bill;
      return bill;
    });

    return summary;
  },
  ["bills:summary"],
  {
    tags: ["bills", "transactions"],
    revalidate: 300, // Revalidate every 5 minutes
  },
);

// Get summary of all bills
export async function getBillsSummary() {
  return _cachedBillsSummary();
}

// Get count of all paid bills in the current month (all transactions, not unique)
export async function getPaidBillsCount() {
  const { paidThisCycle } = await _cachedComputeBillFlags();
  return Array.isArray(paidThisCycle) ? paidThisCycle.length : 0;
}

// Get count of all upcoming bills (unique, unpaid, > 7 days out)
export async function getUpcomingBillsCount() {
  const names = await getUpcomingUnpaidBillNames();
  return names.length;
}

// Get count of all due soon or overdue bills (unique, unpaid)
export async function getDueBillsCount() {
  const names = await getDueBillNames();
  return names.length;
}

// Return transactions marked with dueSoon and paid status
export async function getBillTransactionsWithPaymentStatus(): Promise<
  TransactionWithPaymentStatus[]
> {
  const [base, flags] = await Promise.all([getBillTransactions(), _cachedComputeBillFlags()]);

  const dueSoonSet = new Set<string>(Array.isArray(flags.dueSoon) ? flags.dueSoon : []);
  const overdueSet = new Set<string>(Array.isArray(flags.overdue) ? flags.overdue : []);
  const paidCycleSet = new Set<string>(
    Array.isArray(flags.paidThisCycle) ? flags.paidThisCycle : [],
  );

  return base.map((t) => ({
    ...t,
    paid: paidCycleSet.has(t.name),
    dueSoon: dueSoonSet.has(t.name),
    overdue: overdueSet.has(t.name),
    dueDay: flags.dueDayMap[t.name],
  }));
}

// Get recurring bills with their last payment date and average amount
async function getRecurringBills(): Promise<RecurringBillGroup[]> {
  const { db } = await connectToDatabase();
  const docs = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<RecurringBillGroup>([
      addDateStage,
      { $match: { category: CATEGORY_BILLS, recurring: true, amount: { $lt: 0 } } },
      { $sort: { dateAsDate: -1 } },
      {
        $group: {
          _id: "$name",
          lastPayment: { $first: "$dateAsDate" },
          lastAmount: { $first: { $abs: "$amount" } },
          avgAmount: { $avg: { $abs: "$amount" } },
        },
      },
      { $project: { _id: 0, name: "$_id", lastPayment: 1, lastAmount: 1, avgAmount: 1 } },
    ])
    .toArray();

  return docs;
}

// Calculate total paid bills for current month
async function calcTotalPaidBills() {
  const { paidThisCycle } = await _cachedComputeBillFlags();
  if (!Array.isArray(paidThisCycle) || paidThisCycle.length === 0) {
    return 0;
  }

  const groups = await _cachedRecurringBills();
  const paidSet = new Set(paidThisCycle);

  let total = 0;
  for (const g of groups) {
    if (paidSet.has(g.name)) {
      total += g.lastAmount ?? g.avgAmount ?? 0;
    }
  }
  return total;
}

// Calculate total upcoming bills (exclude paid, due soon, overdue)
async function calcTotalUpcomingBills() {
  const [group, names] = await Promise.all([_cachedRecurringBills(), getUpcomingUnpaidBillNames()]);
  const upcoming = new Set(names);
  let total = 0;
  for (const g of group) {
    if (upcoming.has(g.name)) total += g.avgAmount;
  }
  return total;
}

// Calculate total bills due soon or overdue (exclude paid)
async function calcTotalDueBills() {
  const [groups, names] = await Promise.all([_cachedRecurringBills(), getDueBillNames()]);
  const target = new Set(names);
  let total = 0;
  for (const g of groups) {
    if (target.has(g.name)) total += g.avgAmount;
  }
  return total;
}

// Get all bill transactions (category: "Bills")
async function getBillTransactions() {
  const { db } = await connectToDatabase();
  const transactions = await db
    .collection<TransactionDocument>("transactions")
    .find({ category: CATEGORY_BILLS })
    .sort({ date: -1 })
    .toArray();

  return transactions.map((t) => ({
    id: t._id.toString(),
    name: t.name,
    date: t.date,
    avatar: t.avatar,
    category: t.category,
    amount: Number(t.amount),
    recurring: t.recurring,
  })) satisfies Transaction[];
}

// Get count of bills due soon or overdue (exclude paid)
async function getDueBillNames() {
  const { dueSoon, overdue, paidThisCycle } = await _cachedComputeBillFlags();
  const paid = new Set(Array.isArray(paidThisCycle) ? paidThisCycle : []);
  const ds = Array.isArray(dueSoon) ? dueSoon : [];
  const od = Array.isArray(overdue) ? overdue : [];
  return Array.from(new Set([...ds, ...od].filter((n) => !paid.has(n))));
}

// Names of bills that are upcoming (unpaid, > 7 days out)
async function getUpcomingUnpaidBillNames() {
  const [summary, flags] = await Promise.all([
    _cachedRecurringBills(), // upcoming recurring bills.
    _cachedComputeBillFlags(),
  ]);

  const allBillNames = Array.from(new Set(summary.map((b) => b.name)));
  const paidThisCycle = new Set(Array.isArray(flags.paidThisCycle) ? flags.paidThisCycle : []);
  const blocked = new Set([
    ...(Array.isArray(flags.dueSoon) ? flags.dueSoon : []),
    ...(Array.isArray(flags.overdue) ? flags.overdue : []),
  ]);

  const result: string[] = [];
  for (const name of allBillNames) {
    if (!paidThisCycle.has(name) && !blocked.has(name)) {
      result.push(name);
    }
  }
  return result;
}

// Get breakdown of all bills (recurring + non-recurring) with total amounts
// async function getBillsBreakdown() {
//   const { db } = await connectToDatabase();
//   const docs = await db
//     .collection<TransactionDocument>("transactions")
//     .aggregate<Bill>([
//       { $match: { category: "Bills", amount: { $lt: 0 } } },
//       {
//         $group: {
//           _id: "$name",
//           amount: { $sum: { $abs: "$amount" } },
//         },
//       },
//       { $project: { _id: 0, name: "$_id", amount: 1 } },
//       { $sort: { name: 1 } },
//     ])
//     .toArray();

//   return docs.map((d) => ({
//     ...d,
//     id: d.name.toLowerCase().replace(/\s+/g, "-"),
//   }));
// }

// const _cachedBillsBreakdown = cache(getBillsBreakdown, ["bills:breakdown"], {
//   tags: ["transactions"],
//   revalidate: 300,
// });
