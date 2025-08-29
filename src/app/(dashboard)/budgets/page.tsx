import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewTransitionWrapper } from "@/components/view-transition-wrapper";

import { Budgets } from "./_components/budgets";
import { SpendingSummary } from "./_components/spending-summary";
import { BudgetCreationModal } from "./_components/create-budget-modal";
import { getBudgetCategories, getBudgetThemes } from "../shared-data/budget";

export default async function BudgetsPage() {
  const selectedThemes = await getBudgetThemes();
  const selectedCategories = await getBudgetCategories();

  return (
    <ViewTransitionWrapper>
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Budgets</h1>
          <BudgetCreationModal
            selectedThemes={selectedThemes}
            selectedCategories={selectedCategories}
          />
        </header>
        <section className="@container flex flex-col gap-6 lg:flex-row">
          <div className="basis-[41.312%] lg:self-start">
            <SpendingSummary />
          </div>
          <ScrollArea className="basis-[58.687%] xl:h-(--scroll-area-max-height)">
            <Budgets />
          </ScrollArea>
        </section>
      </div>
    </ViewTransitionWrapper>
  );
}
