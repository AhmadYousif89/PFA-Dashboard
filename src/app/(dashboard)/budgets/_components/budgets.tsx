import { getBudgets, getBudgetTransactionsMap } from "@/app/(dashboard)/shared-data/budget";
import { BudgetCard } from "./budget-card";
import { Accordion } from "@/components/ui/accordion";

export const Budgets = async () => {
  const budgets = await getBudgets();
  const transactionsMap = await getBudgetTransactionsMap({ limit: 3 });

  const selectedThemes = budgets.map((b) => b.theme);
  const selectedCategories = budgets.map((b) => b.category);
  const defaultOpenItems = budgets.map((budget) => `card-${budget.id}`);

  return (
    <Accordion type="multiple" defaultValue={defaultOpenItems} className="flex flex-col gap-6">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          selectedThemes={selectedThemes}
          selectedCategories={selectedCategories}
          categoryTransactions={transactionsMap[budget.category] ?? []}
        />
      ))}
    </Accordion>
  );
};
