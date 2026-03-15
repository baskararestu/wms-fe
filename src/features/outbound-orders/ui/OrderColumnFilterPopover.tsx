import { AiOutlineBars } from "react-icons/ai";
import { HiOutlineBarsArrowUp } from "react-icons/hi2";

import { columnConfig, type FilterableColumn, type PopupTab } from "../model/columnFilterConfig";
import type { OutboundOrdersFilters } from "../model/types";

type OrderColumnFilterPopoverProps = {
  column: FilterableColumn;
  activeColumn: FilterableColumn | null;
  activeTab: PopupTab;
  filtersDraft: OutboundOrdersFilters;
  onTabChange: (tab: PopupTab) => void;
  onSortChange: (sortDir: OutboundOrdersFilters["sortDir"]) => void;
  onFilterChange: (key: "marketplaceStatus" | "shippingStatus" | "wmsStatus", value: string) => void;
  onReset: () => void;
  onSave: () => void;
};

export const OrderColumnFilterPopover = ({ column, activeColumn, activeTab, filtersDraft, onTabChange, onSortChange, onFilterChange, onReset, onSave }: OrderColumnFilterPopoverProps) => {
  if (activeColumn !== column) {
    return null;
  }

  const config = columnConfig[column];
  const columnHasFilterTab = Boolean(config.filterKey);

  return (
    <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
      <p className="mb-2 text-xs font-semibold text-slate-700">{config.label}</p>

      <div className="mb-3 flex items-start gap-2">
        <div className="flex flex-col items-center gap-1 rounded-md p-1">
          <button type="button" onClick={() => onTabChange("sort")} className={["inline-flex h-9 w-9 items-center justify-center rounded-md font-medium transition", activeTab === "sort" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/70"].join(" ")}>
            <AiOutlineBars className="h-5 w-5" />
          </button>

          {columnHasFilterTab ? (
            <button type="button" onClick={() => onTabChange("filter")} className={["inline-flex h-9 w-9 items-center justify-center rounded-md font-medium transition", activeTab === "filter" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-white/70"].join(" ")}>
              <HiOutlineBarsArrowUp className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 rounded-md border border-slate-100 p-1.5">
          {activeTab === "sort" ? (
            <div className="grid gap-1">
              <button type="button" onClick={() => onSortChange("asc")} className={["flex items-center gap-2 rounded border px-2 py-1.5 text-xs", filtersDraft.sortDir === "asc" ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-500 hover:bg-slate-50"].join(" ")}>
                <span>A - Z</span>
              </button>
              <button type="button" onClick={() => onSortChange("desc")} className={["flex items-center gap-2 rounded border px-2 py-1.5 text-xs", filtersDraft.sortDir === "desc" ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-500 hover:bg-slate-50"].join(" ")}>
                <span>Z - A</span>
              </button>
            </div>
          ) : null}

          {activeTab === "filter" && config.filterKey && config.filterOptions ? (
            <div className="grid max-h-40 gap-2 overflow-y-auto">
              {config.filterOptions.map((option) => {
                const currentValue = filtersDraft[config.filterKey!];
                const isChecked = currentValue === option.value;

                return (
                  <label key={option.value || "all"} className={["inline-flex items-center gap-2 rounded border px-2 py-1.5 text-xs", isChecked ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-600 hover:bg-slate-50"].join(" ")}>
                    <input type="checkbox" checked={isChecked} onChange={() => onFilterChange(config.filterKey!, isChecked ? "" : option.value)} />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" className="text-[11px] font-medium text-slate-500" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};
