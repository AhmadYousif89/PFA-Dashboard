"use client";

import { Fragment } from "react";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

import LeftCaretIcon from "public/assets/images/icon-caret-left.svg";
import RightCaretIcon from "public/assets/images/icon-caret-right.svg";
import { useUrlState } from "@/hooks/use-url-state";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { updateURL } = useUrlState();

  const handlePageChange = (pageIndex: number) => {
    const newPage = pageIndex + 1;
    updateURL({ page: newPage > 1 ? String(newPage) : null });
  };

  const handlePreviousPage = () => {
    if (table.getCanPreviousPage()) {
      const newPageIndex = table.getState().pagination.pageIndex - 1;
      handlePageChange(newPageIndex);
      table.previousPage();
    }
  };

  const handlePageClick = (pageIndex: number) => {
    handlePageChange(pageIndex);
    table.setPageIndex(pageIndex);
  };

  const handleNextPage = () => {
    if (table.getCanNextPage()) {
      const newPageIndex = table.getState().pagination.pageIndex + 1;
      handlePageChange(newPageIndex);
      table.nextPage();
    }
  };

  return (
    <section className="flex flex-col gap-1.5">
      <div className="text-muted-foreground text-12 flex justify-between text-center">
        <span>
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </span>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 md:gap-5">
        <Button
          variant="outline"
          className="min-h-8 min-w-8 gap-4 sm:min-h-10 sm:min-w-12 md:min-w-24"
          onClick={handlePreviousPage}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="h-2.5 w-1.5 md:-ml-1.5">
            <LeftCaretIcon />
          </span>
          <span className="hidden md:inline-block">Prev</span>
        </Button>
        {/* Page numbers */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
            .filter((page) => {
              const currentPage = table.getState().pagination.pageIndex + 1;
              return (
                page === 1 ||
                page === table.getPageCount() ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            }) // Filter to show only the first, last, and current page with one page on either side
            .map((page, index, array) => {
              const showEllipsis = index > 0 && array[index - 1] !== page - 1;
              const isCurrentPage = table.getState().pagination.pageIndex + 1 === page;
              // Generate hidden pages for ellipsis dropdown
              const getHiddenPages = () => {
                const hiddenPages = [];
                const prevPage = array[index - 1];
                for (let i = prevPage + 1; i < page; i++) hiddenPages.push(i);
                return hiddenPages;
              };
              return (
                <Fragment key={page}>
                  {showEllipsis && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-muted-foreground hover:text-foreground size-8 p-0 sm:size-10"
                        >
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="flex min-w-fit gap-2">
                        {getHiddenPages().map((hiddenPage) => (
                          <Button
                            asChild
                            key={hiddenPage}
                            variant="outline"
                            className="size-8 p-0 sm:size-10"
                          >
                            <DropdownMenuItem
                              onClick={() => handlePageClick(hiddenPage - 1)}
                              className="cursor-pointer justify-center"
                            >
                              {hiddenPage}
                            </DropdownMenuItem>
                          </Button>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    variant="outline"
                    disabled={isCurrentPage}
                    onClick={() => handlePageClick(page - 1)}
                    className={`size-8 p-0 sm:size-10 ${isCurrentPage ? "bg-foreground text-primary-foreground focus:bg-foreground border-none disabled:opacity-100" : ""}`}
                  >
                    {page}
                  </Button>
                </Fragment>
              );
            })}
        </div>
        <Button
          variant="outline"
          className="min-h-8 min-w-8 gap-4 sm:min-h-10 sm:min-w-12 md:min-w-24"
          onClick={handleNextPage}
          disabled={!table.getCanNextPage()}
        >
          <span className="hidden md:inline-block">Next</span>
          <span className="h-2.5 w-1.5 md:-mr-1.5">
            <RightCaretIcon />
          </span>
        </Button>
      </div>
    </section>
  );
}
