"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import DATA from "@/lib/data.json";

import { ChartTooltip, ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";

export const BudgetsSummary = () => {
  const budgets = DATA.budgets;
  const total = budgets.reduce((sum, item) => sum + item.maximum, 0);
  const limit = Number((DATA.balance.income * 0.7).toFixed(2)); // 70% of monthly income for budgets

  const chartConfig = {
    entertainment: {
      label: "Entertainment",
      color: "var(--chart-1)",
    },
    diningOut: {
      label: "Dining Out",
      color: "var(--chart-2)",
    },
    bills: {
      label: "Bills",
      color: "var(--chart-3)",
    },
    personalCare: {
      label: "Personal Care",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex min-h-72.5 flex-col gap-4 @[22rem]/card-content:flex-row">
      <div className="grid grow items-center justify-center self-center">
        <ChartContainer config={chartConfig} className="col-end-1 row-end-1 min-h-60 max-w-61.75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Inner ring with lighter colors */}
              <Pie
                data={budgets}
                cx="50%"
                cy="50%"
                dataKey="maximum"
                innerRadius={75}
                outerRadius={90}
                startAngle={90}
                endAngle={-450}
                animationBegin={0}
                animationDuration={1250}
              >
                {budgets.map((entry, index) => (
                  <Cell key={`inner-cell-${index}`} fill={entry.theme + "75"} />
                ))}
              </Pie>
              {/* Outer ring with full colors */}
              <Pie
                data={budgets}
                cx="50%"
                cy="50%"
                dataKey="maximum"
                innerRadius={90}
                outerRadius={120}
                startAngle={90}
                endAngle={-450}
                animationBegin={100}
                animationDuration={1500}
              >
                {budgets.map((entry, index) => (
                  <Cell key={`outer-cell-${index}`} fill={entry.theme} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { category, maximum, theme } = payload[0].payload;
                    return (
                      <div
                        style={{ backgroundColor: theme }}
                        className="bg-popover text-14-bold text-card border-muted rounded-full border px-4 py-2 shadow"
                      >
                        <p>{`${category}: $${maximum}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        {/* Center text */}
        <div className="col-end-1 row-end-1 flex flex-col items-center place-self-center">
          <span className="text-32">${total}</span>
          <p className="text-muted-foreground text-12">of ${limit.toLocaleString()} limit</p>
        </div>
      </div>
      {/* Legend */}
      <ul className={cn("grid grid-cols-2 gap-4", "@[22rem]/card-content:grid-cols-1")}>
        {budgets.map((item, index) => (
          <li key={index} className="flex items-center gap-4">
            <div className="h-11 min-w-1 rounded" style={{ backgroundColor: item.theme }} />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-12">{item.category}</span>
              <span className="text-14-bold">
                {item.maximum.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
