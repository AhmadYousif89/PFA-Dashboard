import { useEffect, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type SortingState,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";

import { SortFormat } from "@/lib/types";
import { useUrlState } from "./use-url-state";

export function useDataTable<TData, TValue>(data: TData[], columns: ColumnDef<TData, TValue>[]) {
  const { getParam } = useUrlState();

  const currentQuery = getParam("query") || "";
  const currentSort = (getParam("sort") as SortFormat) || "";
  const currentCategory = getParam("category") || "All Transactions";
  const page = getParam("page") ? Number(getParam("page")) : 1;

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (currentSort && currentSort.includes(":")) {
      const [sort, order] = currentSort.split(":");
      return [{ id: sort, desc: order === "desc" }];
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    if (currentCategory && currentCategory !== "All Transactions") {
      filters.push({ id: "category", value: currentCategory });
    }
    return filters;
  });
  const [globalFilter, setGlobalFilter] = useState(currentQuery);

  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const sanitizedPage = page < 1 ? 1 : page > totalPages ? totalPages : page;

  const pagination = { pageIndex: sanitizedPage - 1, pageSize };

  const globalFilterFn = (row: Row<TData>, columnId: string, value: string) => {
    const searchValue = value.toLowerCase();
    // Search in name
    const name = row.getValue("name")?.toString().toLowerCase() || "";
    if (name.includes(searchValue)) return true;
    // Search in formatted amount
    const amount = Number(row.getValue("amount"));
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      signDisplay: "exceptZero",
    })
      .format(amount)
      .toLowerCase();
    const rawAmount = amount.toString();
    if (formattedAmount.includes(searchValue) || rawAmount.includes(searchValue)) return true;
    // Search by category
    const category = row.getValue("category")?.toString().toLowerCase() || "";
    if (category.includes(searchValue)) return true;
    //  Search by date
    const date = new Date(row.getValue("date"));
    const formattedDate = date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .toLowerCase();
    if (formattedDate.includes(searchValue)) return true;

    return false;
  };

  // Sync URL state with table state
  useEffect(() => {
    const urlQuery = getParam("query") || "";
    if (urlQuery !== globalFilter) {
      setGlobalFilter(urlQuery);
    }
  }, [getParam, globalFilter]);

  useEffect(() => {
    const urlSort = getParam("sort") || "";
    if (urlSort && urlSort.includes(":")) {
      const [sort, order] = urlSort.split(":");
      const newSorting = [{ id: sort, desc: order === "desc" }];
      if (JSON.stringify(sorting) !== JSON.stringify(newSorting)) {
        setSorting(newSorting);
      }
      return;
    }
    if (!urlSort && sorting.length > 0) {
      setSorting([]);
    }
  }, [getParam, sorting]);

  useEffect(() => {
    const urlCategory = getParam("category") || "All Transactions";
    const currentCategoryFilter = columnFilters.find((filter) => filter.id === "category");

    if (urlCategory === "All Transactions") {
      if (currentCategoryFilter) {
        setColumnFilters((prev) => prev.filter((filter) => filter.id !== "category"));
      }
    } else {
      if (!currentCategoryFilter || currentCategoryFilter.value !== urlCategory) {
        setColumnFilters((prev) => [
          ...prev.filter((filter) => filter.id !== "category"),
          { id: "category", value: urlCategory },
        ]);
      }
    }
  }, [getParam, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, globalFilter },
    initialState: { pagination },
    globalFilterFn,
  });

  return table;
}
