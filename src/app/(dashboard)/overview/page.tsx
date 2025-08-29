import { Suspense } from "react";

import { ViewTransitionWrapper } from "@/components/view-transition-wrapper";
import { SummaryCard } from "./_components/summary-card";
import { PotsSummary } from "./_components/pots-summary";
import { OverviewBillsSummary } from "./_components/bills-summary";
import { BudgetsSummary } from "./_components/budget-summary";
import { AccountSummary } from "./_components/account-info-card";
import { TransactionsSummary } from "./_components/transactions-summary";
import { PotsSummarySkeleton } from "./_skeletons/pots-summary";
import { BillsSummarySkeleton } from "./_skeletons/bills-summary";
import { AccountSummarySkeleton } from "./_skeletons/account-summary";
import { BudgetsSummarySkeleton } from "./_skeletons/budgets-summary";
import { TransactionsSummarySkeleton } from "./_skeletons/transactions-summary";

export default async function OverviewPage() {
  return (
    <ViewTransitionWrapper>
      <div className="@container/overview grid gap-8">
        <h1 className="text-xl font-bold">Overview</h1>
        {/* Account Summary Cards */}
        <section className="flex flex-col justify-between gap-3 md:flex-row md:gap-6">
          <Suspense fallback={<AccountSummarySkeleton />}>
            <AccountSummary />
          </Suspense>
        </section>
        {/* Overview Summary Cards */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="flex basis-[58.687%] flex-col gap-4">
            <Suspense fallback={<PotsSummarySkeleton />}>
              <SummaryCard title="Pots" href="/pots">
                <PotsSummary />
              </SummaryCard>
            </Suspense>

            <Suspense fallback={<TransactionsSummarySkeleton />}>
              <SummaryCard title="Transactions" href="/transactions">
                <TransactionsSummary />
              </SummaryCard>
            </Suspense>
          </section>
          <section className="flex basis-[41.312%] flex-col gap-4">
            <Suspense fallback={<BudgetsSummarySkeleton />}>
              <SummaryCard title="Budgets" href="/budgets">
                <BudgetsSummary />
              </SummaryCard>
            </Suspense>
            <Suspense fallback={<BillsSummarySkeleton />}>
              <SummaryCard title="Recurring Bills" href="/bills">
                <OverviewBillsSummary />
              </SummaryCard>
            </Suspense>
          </section>
        </div>
      </div>
    </ViewTransitionWrapper>
  );
}
