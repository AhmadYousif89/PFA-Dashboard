import Link from "next/link";

import CaretRightIcon from "public/assets/images/icon-caret-right.svg";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryCardProps = {
  title: "Pots" | "Transactions" | "Budgets" | "Recurring Bills";
  href: "/pots" | "/transactions" | "/budgets" | "/bills";
  children: React.ReactNode;
};

export const SummaryCard = ({ title, href, children }: SummaryCardProps) => {
  const isTransactions = title === "Transactions";
  const isBills = title === "Recurring Bills";

  return (
    <Card
      data-slot="overview-summary-card"
      className={cn("md:py-8", isTransactions || isBills ? "gap-8" : "")}
    >
      <CardHeader className="flex items-center justify-between md:px-8">
        <CardTitle>
          <h2 className="text-lg font-bold">{title}</h2>
        </CardTitle>
        <CardAction className="group flex self-center">
          <Button variant="link" size="auto" asChild className="group rounded">
            <Link href={href} className="flex items-center gap-4">
              <span className="group-hover:text-foreground text-sm">
                {isTransactions ? "View All" : "See Details"}
              </span>
              <span className="h-3 w-2">
                <CaretRightIcon className="group-hover:*:fill-foreground" />
              </span>
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="md:px-8">{children}</CardContent>
    </Card>
  );
};
