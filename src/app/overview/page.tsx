import { TransactionsSummary } from "./_components/transactions-summary";
import { AccountSummary } from "./_components/account-info-card";
import { BudgetsSummary } from "./_components/budget-summary";
import { BillsSummary } from "./_components/bills-summary";
import { PotsSummary } from "./_components/pots-summary";
import { SummaryCard } from "./_components/summary-card";

export default function OverviewPage() {
  return (
    <div className="@container/overview grid gap-8">
      <h1 className="text-32">Overview</h1>
      {/* Account Summary Cards */}
      <section className="flex flex-col justify-between gap-3 @2xl/overview:flex-row @2xl/overview:gap-6">
        <AccountSummary />
      </section>
      {/* Overview Summary Cards */}
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(26.75rem,max-content)]">
        <section className="flex flex-col gap-4">
          <SummaryCard title="Pots" href="/pots">
            <PotsSummary />
          </SummaryCard>
          <SummaryCard title="Transactions" href="/transactions">
            <TransactionsSummary />
          </SummaryCard>
        </section>
        <section className="flex flex-col gap-4">
          <SummaryCard title="Budgets" href="/budgets">
            <BudgetsSummary />
          </SummaryCard>
          <SummaryCard title="Recurring Bills" href="/bills">
            <BillsSummary />
          </SummaryCard>
        </section>
      </div>
    </div>
  );
}
