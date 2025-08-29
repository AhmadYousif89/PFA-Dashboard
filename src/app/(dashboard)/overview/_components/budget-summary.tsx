import {
  getBudgets,
  calculateBudgetLimit,
  calculateBudgetSpendings,
} from "@/app/(dashboard)/shared-data/budget";
import { cn, formatCurrency } from "@/lib/utils";
import { BudgetChart } from "@/components/budget-chart";

export const BudgetsSummary = async () => {
  const budgets = await getBudgets();
  const totalBudgetLimit = await calculateBudgetLimit();
  const totalBudgetSpent = await calculateBudgetSpendings();

  if (budgets.length === 0) {
    return <p className="text-muted-foreground text-sm">You have not set any budget yet</p>;
  }

  return (
    <div
      className={cn(
        "flex min-h-75.5 flex-col gap-4 py-2",
        "xl:@[22rem]/card-content:flex-row @[27rem]/card-content:flex-row",
      )}
    >
      <BudgetChart budgets={budgets} total={totalBudgetSpent} maximum={totalBudgetLimit} />
      {/* Legends */}
      <ul
        className={cn(
          "grid grid-cols-2 gap-4",
          "xl:@[22rem]/card-content:grid-cols-1 @[27rem]/card-content:grid-cols-1",
        )}
      >
        {budgets.map((item, index) => (
          <li key={index} className="flex items-center gap-4">
            <span className="min-h-11 min-w-1 rounded" style={{ backgroundColor: item.theme }} />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {item.category}
              </span>
              <span className="text-sm font-bold">{formatCurrency(item.maximum)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
