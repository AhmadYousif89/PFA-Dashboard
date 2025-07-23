import { CreateNewBudget } from "./_components/create-new-budget";

export default function BudgetsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <CreateNewBudget />
      </header>
    </div>
  );
}
