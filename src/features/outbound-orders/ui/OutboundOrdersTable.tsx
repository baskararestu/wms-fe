import { useState } from "react";
import { LuArrowUpDown } from "react-icons/lu";
import { toast } from "sonner";

import { Pagination } from "../../../shared/ui/pagination/Pagination";
import { useMarketplaceStore } from "../../../entities/marketplace/model/marketplaceStore";
import { columnConfig, type FilterableColumn, type PopupTab } from "../model/columnFilterConfig";
import { useOutboundOrders } from "../model/useOutboundOrders";
import { OrderDetailModal } from "./OrderDetailModal";
import { OrderColumnFilterPopover } from "./OrderColumnFilterPopover";
import { OutboundOrderRow } from "./OutboundOrderRow";
import { AppButton } from "../../../widgets/button/ui/AppButton";
import { useOrderSyncStore } from "../model/orderSyncStore";
import { syncOrders } from "../api/syncOrders";

export const OutboundOrdersTable = () => {
  const { applyFilterPatch, appliedFilters, currentPage, errorMessage, filtersDraft, isLoading, orders, pageNumbers, pageSizeOptions, resetFilterKeys, rowsPerPage, setCurrentPage, setRowsPerPage, totalEntries, totalPages, updateFilterDraft, visibleEnd, visibleStart } = useOutboundOrders();
  const connectedShopId = useMarketplaceStore((state) => state.connectedShopId);
  const markOrdersUpdated = useOrderSyncStore((state) => state.markOrdersUpdated);
  const [activeColumn, setActiveColumn] = useState<FilterableColumn | null>(null);
  const [activeTab, setActiveTab] = useState<PopupTab>("sort");
  const [selectedOrderSn, setSelectedOrderSn] = useState<string | null>(null);
  const [isSyncingOrders, setIsSyncingOrders] = useState(false);

  const onSyncOrders = async () => {
    if (isSyncingOrders) {
      return;
    }

    if (!connectedShopId) {
      toast.error("Shop belum terkoneksi", {
        description: "Jalankan Start Connection terlebih dahulu",
      });
      return;
    }

    try {
      setIsSyncingOrders(true);
      const response = await syncOrders(connectedShopId);
      markOrdersUpdated();
      toast.success(response.message || "Sync orders berhasil");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Sync orders gagal", { description: error.message });
      } else {
        toast.error("Sync orders gagal");
      }
    } finally {
      setIsSyncingOrders(false);
    }
  };

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
    return <OrderColumnFilterPopover column={column} activeColumn={activeColumn} activeTab={activeTab} filtersDraft={filtersDraft} onTabChange={setActiveTab} onSortChange={(sortDir) => updateFilterDraft("sortDir", sortDir)} onFilterChange={(key, value) => updateFilterDraft(key, value)} onReset={onResetColumnFilter} onSave={onSaveColumnFilter} />;
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
        </div>
        {filtersDraft.search !== appliedFilters.search ? <p className="mt-2 text-[11px] text-slate-500">Mencari...</p> : null}
        <AppButton variant="secondary" className="mt-2 min-h-9! px-3! py-1.5! text-xs" onClick={() => void onSyncOrders()} disabled={isSyncingOrders}>
          {isSyncingOrders ? "Syncing..." : "Sync Orders"}
        </AppButton>
      </div>

      <div className="relative rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Order ID</th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1 cursor-pointer", activeColumn === "marketplaceStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("marketplaceStatus")}>
                    Marketplace Status
                    <LuArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("marketplaceStatus")}
                </th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1 cursor-pointer", activeColumn === "shippingStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("shippingStatus")}>
                    Shipping Status
                    <LuArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                  {renderColumnPopup("shippingStatus")}
                </th>
                <th className="relative px-3 py-2 font-medium">
                  <button type="button" className={["inline-flex items-center gap-1 cursor-pointer", activeColumn === "wmsStatus" ? "text-blue-600" : ""].join(" ")} onClick={() => openColumnPopup("wmsStatus")}>
                    WMS Status
                    <LuArrowUpDown className="h-3.5 w-3.5" />
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

              {!isLoading && !errorMessage ? orders.map((order) => <OutboundOrderRow key={order.id} order={order} onOpenDetail={setSelectedOrderSn} />) : null}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} pageNumbers={pageNumbers} totalPages={totalPages} visibleStart={visibleStart} visibleEnd={visibleEnd} totalEntries={totalEntries} rowsPerPage={rowsPerPage} pageSizeOptions={pageSizeOptions} onPageChange={setCurrentPage} onRowsPerPageChange={setRowsPerPage} />
      </div>

      {selectedOrderSn ? <OrderDetailModal orderSn={selectedOrderSn} onClose={() => setSelectedOrderSn(null)} /> : null}

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
