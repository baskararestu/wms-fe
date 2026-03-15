import { AppButton } from "../../../widgets/button/ui/AppButton";

type PaginationProps = {
  currentPage: number;
  pageNumbers: number[];
  totalPages: number;
  visibleStart: number;
  visibleEnd: number;
  totalEntries: number;
  rowsPerPage: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (limit: number) => void;
};

export const Pagination = ({ currentPage, pageNumbers, totalPages, visibleStart, visibleEnd, totalEntries, rowsPerPage, pageSizeOptions, onPageChange, onRowsPerPageChange }: PaginationProps) => {
  return (
    <footer className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500 max-sm:flex-col max-sm:items-start max-sm:gap-2">
      <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-2">
        <p>
          Show {visibleStart} to {visibleEnd} of {totalEntries} entries
        </p>

        <label className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Rows per page</span>
          <select value={rowsPerPage} onChange={(event) => onRowsPerPageChange(Number(event.target.value))} className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600">
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber) => (
          <AppButton key={pageNumber} type="button" variant={pageNumber === currentPage ? "primary" : "secondary"} onClick={() => onPageChange(pageNumber)} disabled={pageNumber > totalPages} className="min-h-8! rounded-md px-2.5! py-1! text-[11px] shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none">
            {pageNumber}
          </AppButton>
        ))}
      </div>
    </footer>
  );
};
