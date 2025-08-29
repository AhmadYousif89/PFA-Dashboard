import {
  getBudgets,
  getBudgetCategories,
  getBudgetThemes,
} from "@/app/(dashboard)/shared-data/budget";
import { BudgetCard } from "./budget-card";
import { Accordion } from "@/components/ui/accordion";

export const Budgets = async () => {
  const data = await getBudgets();
  const selectedThemes = await getBudgetThemes();
  const selectedCategories = await getBudgetCategories();

  const defaultOpenItems = data.map((budget) => `card-${budget.id}`);

  return (
    <Accordion type="multiple" defaultValue={defaultOpenItems} className="flex flex-col gap-6">
      {data.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          selectedThemes={selectedThemes}
          selectedCategories={selectedCategories}
        />
      ))}
    </Accordion>
  );
};
