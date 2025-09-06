import { TransactionTable } from "./_components/transaction-table";
import { getTransactions } from "../shared-data/transactions";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="flex grow flex-col gap-8">
      <header>
        <h1 className="text-xl font-bold">Transactions</h1>
      </header>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
