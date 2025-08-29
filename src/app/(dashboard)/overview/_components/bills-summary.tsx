import { formatCurrency } from "@/lib/utils";
import { getBillsSummary } from "@/app/(dashboard)/shared-data/bills";

export const OverviewBillsSummary = async () => {
  const bills = await getBillsSummary();

  if (bills.length === 0) {
    return <p className="text-muted-foreground text-sm">No recurring bills found.</p>;
  }

  return (
    <ul className="space-y-3">
      {bills.map((bill) => (
        <li
          key={bill.id}
          style={{ borderColor: bill.theme }}
          className="bg-accent flex items-center justify-between rounded-md border-l-4 px-4 py-5 text-sm"
        >
          <h3 className="text-muted-foreground">{bill.name}</h3>
          <p className="font-bold">{formatCurrency(bill.amount)}</p>
        </li>
      ))}
    </ul>
  );
};
