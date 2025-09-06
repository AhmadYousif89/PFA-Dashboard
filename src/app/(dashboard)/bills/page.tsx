import { getBillTransactionsWithPaymentStatus } from "../shared-data/bills";
import { BillsSummary } from "./_components/bill-summary";
import { BillsTable } from "./_components/bills-table";

export default async function RecurringBillsPage() {
  const billTransactions = await getBillTransactionsWithPaymentStatus();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-xl font-bold">Recurring bills</h1>
      </header>
      <section className="flex flex-col gap-6 xl:flex-row">
        <BillsSummary />
        <BillsTable data={billTransactions} />
      </section>
    </div>
  );
}
