import DATA from "@/lib/data.json";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const AccountSummary = () => {
  const balance = DATA.balance;

  return (
    <>
      {Object.entries(balance).map(([key, value]) => {
        const isCurrent = key === "current";
        return (
          <Card
            key={key}
            data-slot="overview-info-card"
            className={cn(
              "basis-full gap-3 p-5 @2xl/overview:p-6",
              isCurrent ? "bg-card-foreground" : "",
            )}
          >
            <p
              className={`text-14 capitalize ${isCurrent ? "text-card" : "text-muted-foreground"}`}
            >
              {isCurrent ? "Current Balance" : key}
            </p>
            <h2
              className={`text-32 ${isCurrent ? "text-card" : "text-card-foreground"}`}
            >
              {value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h2>
          </Card>
        );
      })}
    </>
  );
};
