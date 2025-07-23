"use client";

import DATA from "@/lib/data.json";

import { useDataTable } from "@/hooks/use-data-table";
import { columns } from "./columns";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table-pagination";

const data = DATA.transactions.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export const TransactionTable = () => {
  const table = useDataTable(data, columns);

  return (
    <Card
      data-slot="transaction-table"
      className="h-full grow gap-6 px-5 md:p-8 xl:max-h-[calc(100dvh-8.5rem)]"
    >
      <DataTableToolbar />
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} />
    </Card>
  );
};
