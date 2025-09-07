import { cn, formatCurrency } from "@/lib/utils";
import { BudgetChart } from "@/components/budget-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBudgets, getSpendingByCategoryMap } from "@/app/(dashboard)/shared-data/budget";

export const BudgetsSummary = async () => {
  const [budgets, spendingMap] = await Promise.all([getBudgets(), getSpendingByCategoryMap()]);
  const totalBudgetSpent = Object.values(spendingMap).reduce((sum, v) => sum + v, 0);
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.maximum, 0);

  if (budgets.length === 0) {
    return <p className="text-muted-foreground text-sm">You have not set any budget yet</p>;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-2",
        "xl:@[22rem]/card-content:flex-row @[27rem]/card-content:flex-row",
      )}
    >
      <BudgetChart budgets={budgets} total={totalBudgetSpent} maximum={totalBudgetLimit} />
      {/* Legends */}
      <ScrollArea className="max-h-71.5">
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
      </ScrollArea>
    </div>
  );
};
