import { useState } from "react";
import { LuArrowUpDown, LuListFilter } from "react-icons/lu";

import { AppButton } from "../../../widgets/button/ui/AppButton";
import { Badge } from "../../../shared/ui/badge/Badge";
import { Pagination } from "../../../shared/ui/pagination/Pagination";
import { useOutboundOrders } from "../model/useOutboundOrders";

const statusToneClassMap: Record<string, "emerald" | "rose" | "amber" | "violet" | "blue" | "cyan" | "orange" | "slate"> = {
  Delivered: "emerald",
  Cancelled: "rose",
  Canceled: "rose",
  Shipping: "amber",
  Processing: "violet",
  Paid: "blue",
  Shipped: "blue",
  "Label Created": "cyan",
  "Ready To Pick": "orange",
  "Ready to Pickup": "orange",
  "Awaiting Pickup": "slate",
};

const getStatusTone = (value: string) => statusToneClassMap[value] ?? "slate";

const marketplaceStatusOptions = [
  { label: "All", value: "" },
  { label: "Delivered", value: "delivered" },
  { label: "Shipping", value: "shipping" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
  { label: "Cancelled", value: "cancelled" },
];

const shippingStatusOptions = [
  { label: "All", value: "" },
  { label: "Delivered", value: "delivered" },
  { label: "Shipped", value: "shipped" },
  { label: "Label Created", value: "label_created" },
  { label: "Awaiting Pickup", value: "awaiting_pickup" },
  { label: "Cancelled", value: "cancelled" },
];

const wmsStatusOptions = [
  { label: "All", value: "" },
  { label: "Ready to Pick", value: "READY_TO_PICK" },
  { label: "Picking", value: "PICKING" },
  { label: "Packed", value: "PACKED" },
  { label: "Shipped", value: "SHIPPED" },
];

type FilterableColumn = "marketplaceStatus" | "shippingStatus" | "wmsStatus" | "updatedAt";
type PopupTab = "sort" | "filter";

const columnConfig: Record<
  FilterableColumn,
  {
    label: string;
    sortBy: string;
    filterKey?: "marketplaceStatus" | "shippingStatus" | "wmsStatus";
    filterOptions?: Array<{ label: string; value: string }>;
  }
> = {
  marketplaceStatus: {
    label: "Marketplace Status",
    sortBy: "marketplace_status",
    filterKey: "marketplaceStatus",
    filterOptions: marketplaceStatusOptions,
  },
  shippingStatus: {
    label: "Shipping Status",
    sortBy: "shipping_status",
    filterKey: "shippingStatus",
    filterOptions: shippingStatusOptions,
  },
  wmsStatus: {
    label: "WMS Status",
    sortBy: "wms_status",
    filterKey: "wmsStatus",
    filterOptions: wmsStatusOptions,
  },
  updatedAt: {
    label: "Update At",
    sortBy: "updated_at",
  },
};

export const OutboundOrdersTable = () => {
  const { applyFilterPatch, appliedFilters, currentPage, errorMessage, filtersDraft, isLoading, orders, pageNumbers, pageSizeOptions, resetFilterKeys, rowsPerPage, setCurrentPage, setRowsPerPage, totalEntries, totalPages, updateFilterDraft, visibleEnd, visibleStart } = useOutboundOrders();
  const [activeColumn, setActiveColumn] = useState<FilterableColumn | null>(null);
  const [activeTab, setActiveTab] = useState<PopupTab>("sort");

  const openColumnPopup = (column: FilterableColumn) => {
    if (activeColumn === column) {
      closeColumnPopup();
      return;
    }

    setActiveColumn(column);
    setActiveTab("sort");
  };

  const closeColumnPopup = () => {
    setActiveColumn(null);
    setActiveTab("sort");
  };

  const activeConfig = activeColumn ? columnConfig[activeColumn] : null;

  const renderColumnPopup = (column: FilterableColumn) => {
    if (activeColumn !== column) {
      return null;
    }

    const config = columnConfig[column];
    const columnHasFilterTab = Boolean(config.filterKey);

    return (
      <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded border border-slate-200 bg-white p-2 shadow-xl">
        <p className="mb-2 text-xs font-semibold text-slate-700">{config.label}</p>

        <div className="mb-3 flex items-center gap-1 rounded bg-slate-100 p-1 text-[11px]">
          <button type="button" onClick={() => setActiveTab("sort")} className={["rounded px-2 py-1 font-medium", activeTab === "sort" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"].join(" ")}>
            Sort
          </button>

          {columnHasFilterTab ? (
            <button type="button" onClick={() => setActiveTab("filter")} className={["rounded px-2 py-1 font-medium", activeTab === "filter" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"].join(" ")}>
              Filter
            </button>
          ) : null}
        </div>

        {activeTab === "sort" ? (
          <div className="mb-3 grid gap-1">
            <button type="button" onClick={() => updateFilterDraft("sortDir", "asc")} className={["flex items-center gap-2 rounded border px-2 py-1.5 text-xs", filtersDraft.sortDir === "asc" ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-500 hover:bg-slate-50"].join(" ")}>
              <LuArrowUpDown className="h-3.5 w-3.5" />
              <span>A - Z</span>
            </button>
            <button type="button" onClick={() => updateFilterDraft("sortDir", "desc")} className={["flex items-center gap-2 rounded border px-2 py-1.5 text-xs", filtersDraft.sortDir === "desc" ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-500 hover:bg-slate-50"].join(" ")}>
              <LuArrowUpDown className="h-3.5 w-3.5" />
              <span>Z - A</span>
            </button>
          </div>
        ) : null}

        {activeTab === "filter" && config.filterKey && config.filterOptions ? (
          <div className="mb-3 grid max-h-40 gap-2 overflow-y-auto">
            {config.filterOptions.map((option) => {
              const filterKey = config.filterKey as "marketplaceStatus" | "shippingStatus" | "wmsStatus";
              const currentValue = filtersDraft[filterKey];
              const isChecked = currentValue === option.value;

              return (
                <label key={option.value || "all"} className={["inline-flex items-center gap-2 rounded border px-2 py-1.5 text-xs", isChecked ? "border-blue-400 bg-blue-50 text-blue-700" : "border-transparent text-slate-600 hover:bg-slate-50"].join(" ")}>
                  <input type="checkbox" checked={isChecked} onChange={() => updateFilterDraft(filterKey, isChecked ? "" : option.value)} />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <button type="button" className="text-[11px] font-medium text-slate-500" onClick={onResetColumnFilter}>
            Reset
          </button>
          <button type="button" className="rounded bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white" onClick={onSaveColumnFilter}>
            Save
          </button>
        </div>
      </div>
    );
  };

  const onSaveColumnFilter = () => {
    if (!activeConfig) {
      return;
    }

    const nextPatch: Partial<typeof filtersDraft> = {
      sortBy: activeConfig.sortBy,
      sortDir: filtersDraft.sortDir,
    };

    if (activeConfig.filterKey) {
      nextPatch[activeConfig.filterKey] = filtersDraft[activeConfig.filterKey];
    }

    applyFilterPatch(nextPatch);
    closeColumnPopup();
  };

  const onResetColumnFilter = () => {
    if (!activeConfig) {
      return;
    }

    const keys: Array<"sortBy" | "sortDir" | "marketplaceStatus" | "shippingStatus" | "wmsStatus"> = ["sortBy", "sortDir"];

    if (activeConfig.filterKey) {
      keys.push(activeConfig.filterKey);
    }

    resetFilterKeys(keys);
    closeColumnPopup();
  };

  return (
    <div className="space-y-4">
      <div className="rounded border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <input type="search" placeholder="Search order id / tracking" value={filtersDraft.search} onChange={(event) => updateFilterDraft("search", event.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600" />
          <AppButton type="button" variant="primary" className="min-h-9! rounded-md px-3! py-1.5! text-xs shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none" onClick={() => applyFilterPatch({ search: filtersDraft.search })}>
            Search
          </AppButton>
        </div>
      </div>

      <div className="relative rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Order ID</th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1", activeColumn === "marketplaceStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("marketplaceStatus")}>
                    Marketplace Status
                    <LuListFilter className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("marketplaceStatus")}
                </th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1", activeColumn === "shippingStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("shippingStatus")}>
                    Shipping Status
                    <LuListFilter className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("shippingStatus")}
                </th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1", activeColumn === "wmsStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("wmsStatus")}>
                    WMS Status
                    <LuListFilter className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("wmsStatus")}
                </th>
                <th className="px-3 py-2 font-medium">Tracking Number</th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1", activeColumn === "updatedAt" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("updatedAt")}>
                    Update At
                    <LuArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("updatedAt")}
                </th>
                <th className="px-3 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr className="border-t border-slate-100 text-slate-700">
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : null}

              {!isLoading && errorMessage ? (
                <tr className="border-t border-slate-100 text-slate-700">
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-rose-600">
                    {errorMessage}
                  </td>
                </tr>
              ) : null}

              {!isLoading && !errorMessage && orders.length === 0 ? (
                <tr className="border-t border-slate-100 text-slate-700">
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-slate-500">
                    Tidak ada order yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : null}

              {!isLoading && !errorMessage
                ? orders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-3 py-2">{order.orderId}</td>
                      <td className="px-3 py-2">
                        <Badge tone={getStatusTone(order.marketplaceStatus)}>{order.marketplaceStatus}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        <Badge tone={getStatusTone(order.shippingStatus)}>{order.shippingStatus}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        <Badge tone={getStatusTone(order.wmsStatus)}>{order.wmsStatus}</Badge>
                      </td>
                      <td className="px-3 py-2">{order.trackingNumber}</td>
                      <td className="px-3 py-2">{order.updatedAt}</td>
                      <td className="px-3 py-2 text-right">
                        <AppButton type="button" variant="primary" className="min-h-8! rounded-md px-3! py-1! text-[10px] shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none">
                          Detail
                        </AppButton>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} pageNumbers={pageNumbers} totalPages={totalPages} visibleStart={visibleStart} visibleEnd={visibleEnd} totalEntries={totalEntries} rowsPerPage={rowsPerPage} pageSizeOptions={pageSizeOptions} onPageChange={setCurrentPage} onRowsPerPageChange={setRowsPerPage} />
      </div>

      {(appliedFilters.marketplaceStatus || appliedFilters.shippingStatus || appliedFilters.wmsStatus || appliedFilters.search) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Active:</span>
          {appliedFilters.search ? <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">Search: {appliedFilters.search}</span> : null}
          {appliedFilters.marketplaceStatus ? <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">Marketplace: {appliedFilters.marketplaceStatus}</span> : null}
          {appliedFilters.shippingStatus ? <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">Shipping: {appliedFilters.shippingStatus}</span> : null}
          {appliedFilters.wmsStatus ? <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">WMS: {appliedFilters.wmsStatus}</span> : null}
        </div>
      )}
    </div>
  );
};
