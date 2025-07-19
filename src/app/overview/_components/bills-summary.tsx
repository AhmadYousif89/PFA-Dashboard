import DATA from "@/lib/data.json";

export const BillsSummary = () => {
  const bills = DATA.bills;

  return (
    <ul className="space-y-3">
      {bills.map((bill) => (
        <li
          key={bill.name}
          style={{ borderColor: bill.theme }}
          className="bg-secondary flex items-center justify-between rounded-md border-l-4 px-4 py-5"
        >
          <h3 className="text-14 text-muted-foreground">{bill.name}</h3>
          <p className="text-14-bold">
            {bill.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </li>
      ))}
    </ul>
  );
};
