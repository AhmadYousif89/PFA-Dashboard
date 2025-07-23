"use client";

import { ColumnDef, flexRender, Table as TableType } from "@tanstack/react-table";
import { Fragment } from "react";

import {
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Separator } from "./ui/separator";

import { TTransactionItem } from "@/lib/types";

interface DataTableProps<TData, TValue> {
  table: TableType<TTransactionItem>;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({ table, columns }: DataTableProps<TData, TValue>) {
  return (
    <Table>
      <TableHeader className="border-muted bg-accent sticky top-0 z-10 hidden border-b md:table-header-group">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {/* Spacer row for gap between header and body */}
        <TableRow className="pointer-events-none hidden hover:bg-transparent md:table-row">
          <TableCell colSpan={columns.length} className="h-6 p-0"></TableCell>
        </TableRow>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow className="h-16.75" data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={index > 0 ? "table-cell max-md:not-last-of-type:hidden" : ""}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="pointer-events-none last:hidden hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableCell colSpan={columns.length}>
                  <Separator className="bg-muted my-1" />
                </TableCell>
              </TableRow>
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-20 !text-left">No results.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
