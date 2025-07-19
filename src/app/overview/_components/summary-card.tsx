import Link from "next/link";

import CaretRightIcon from "public/assets/images/icon-caret-right.svg";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  title: "Pots" | "Transactions" | "Budgets" | "Recurring Bills";
  href: "/pots" | "/transactions" | "/budgets" | "/bills";
  children: React.ReactNode;
};

export const SummaryCard = ({ title, href, children }: SummaryCardProps) => {
  const isTransactions = title === "Transactions";

  return (
    <Card
      data-slot="overview-summary-card"
      className={cn(
        "md:py-8",
        isTransactions || title === "Recurring Bills" ? "gap-8" : "",
      )}
    >
      <CardHeader className="flex items-center justify-between md:px-8">
        <CardTitle>
          <h2 className="text-20">{title}</h2>
        </CardTitle>
        <CardAction className="group flex self-center">
          <Button variant="link" asChild>
            <Link href={href} className="flex items-center gap-4">
              <span className="text-14 group-hover:text-foreground">
                {isTransactions ? "View All" : "See Details"}
              </span>
              <CaretRightIcon className="group-hover:[&_path]:fill-foreground" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="md:px-8">{children}</CardContent>
    </Card>
  );
};
