import { Fragment } from "react";

import {
  getBudgets,
  getSpendingByCategory,
  calculateBudgetLimit,
  calculateBudgetSpendings,
} from "@/app/(dashboard)/shared-data/budget";
import { Budget } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { BudgetChart } from "@/components/budget-chart";
import { Card, CardContent } from "@/components/ui/card";

export const SpendingSummary = async () => {
  const budgets = await getBudgets();
  const totalBudgetLimit = await calculateBudgetLimit();
  const totalBudgetSpent = await calculateBudgetSpendings();

  return (
    <Card className="gap-8 md:flex-row md:p-8 lg:@xl:flex-col">
      <BudgetChart budgets={budgets} total={totalBudgetSpent} maximum={totalBudgetLimit} />

      <CardContent className="flex w-full min-w-[296px] grow flex-col justify-center gap-6 self-start md:px-0">
        <h2 className="text-lg font-bold">Spending Summary</h2>
        <ul className="flex flex-col">
          {budgets.map((budget) => (
            <Fragment key={budget.category}>
              <SpendingItem budget={budget} />
              <Separator className="bg-muted my-4 last:hidden" />
            </Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const SpendingItem = async ({ budget }: { budget: Budget }) => {
  const { category, maximum, theme } = budget;
  const spent = await getSpendingByCategory(category);
  const remaining = maximum - spent;

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="h-5.5 min-w-1 rounded" style={{ backgroundColor: theme }} />
        <span className="text-muted-foreground text-sm">{category}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-base font-bold ${remaining < 0 ? "text-destructive" : ""}`}>
          {formatCurrency(remaining)}
        </span>
        <span className="text-muted-foreground text-xs">of {formatCurrency(maximum)}</span>
      </div>
    </li>
  );
};
