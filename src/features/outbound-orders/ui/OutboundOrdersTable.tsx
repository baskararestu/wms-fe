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

export const OutboundOrdersTable = () => {
  const { currentPage, errorMessage, isLoading, orders, pageNumbers, pageSizeOptions, rowsPerPage, searchTerm, setCurrentPage, setRowsPerPage, setSearchTerm, totalEntries, totalPages, visibleEnd, visibleStart } = useOutboundOrders();

  return (
    <div className="space-y-4">
      <div className="rounded border border-slate-200 bg-white p-3">
        <input type="search" placeholder="Search here..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600" />
      </div>

      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Order ID</th>
                <th className="px-3 py-2 font-medium">Marketplace Status</th>
                <th className="px-3 py-2 font-medium">Shipping Status</th>
                <th className="px-3 py-2 font-medium">WMS Status</th>
                <th className="px-3 py-2 font-medium">Tracking Number</th>
                <th className="px-3 py-2 font-medium">Update At</th>
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
    </div>
  );
};
