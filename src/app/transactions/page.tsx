import { unstable_ViewTransition as ViewTransition } from "react";

import { TransactionTable } from "./_components/transaction-table";

export default async function TransactionsPage() {
  return (
    <ViewTransition enter="silde-up">
      <div className="flex grow flex-col gap-8">
        <h1 className="text-32">Transactions</h1>
        <div className="flex grow flex-col">
          <TransactionTable />
        </div>
      </div>
    </ViewTransition>
  );
}
