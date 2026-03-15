import { SummaryCard } from "../../../widgets/summary-card/ui/SummaryCard";

type OutboundOrder = {
  orderId: string;
  marketplaceStatus: string;
  shippingStatus: string;
  wmsStatus: string;
  trackingNumber: string;
  updateAt: string;
};

const outboundOrders: OutboundOrder[] = [
  {
    orderId: "MT-27213-999",
    marketplaceStatus: "Delivered",
    shippingStatus: "Delivered",
    wmsStatus: "Ready to Pickup",
    trackingNumber: "432987159007",
    updateAt: "06 Mar 2026 09:20",
  },
  {
    orderId: "AMZ-0154-773",
    marketplaceStatus: "Canceled",
    shippingStatus: "Canceled",
    wmsStatus: "Ready to Pickup",
    trackingNumber: "-",
    updateAt: "06 Mar 2026 07:55",
  },
  {
    orderId: "SP-8721-451",
    marketplaceStatus: "Shipping",
    shippingStatus: "Shipped",
    wmsStatus: "Ready to Pickup",
    trackingNumber: "600479702021",
    updateAt: "05 Mar 2026 19:31",
  },
  {
    orderId: "TT-9083-225",
    marketplaceStatus: "Processing",
    shippingStatus: "Label Created",
    wmsStatus: "Ready to Pickup",
    trackingNumber: "-",
    updateAt: "05 Mar 2026 12:40",
  },
  {
    orderId: "WB-2190-155",
    marketplaceStatus: "Paid",
    shippingStatus: "Shipped",
    wmsStatus: "Ready to Pickup",
    trackingNumber: "421709993020",
    updateAt: "04 Mar 2026 23:17",
  },
];

const statusBadgeClass: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Canceled: "bg-rose-100 text-rose-700",
  Shipping: "bg-amber-100 text-amber-700",
  Processing: "bg-violet-100 text-violet-700",
  Paid: "bg-blue-100 text-blue-700",
  Shipped: "bg-blue-100 text-blue-700",
  "Label Created": "bg-cyan-100 text-cyan-700",
  "Ready to Pickup": "bg-orange-100 text-orange-700",
};

export const OutboundDashboardContent = () => {
  return (
    <section className="h-lvh space-y-4 bg-slate-50 px-6 py-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Outbound</h1>
        <p className="text-xs text-slate-500">Manage all outbound processes</p>
      </header>

      <div className="grid max-w-sm grid-cols-2 gap-3">
        <SummaryCard title="Total order" value="1,284" trend="+ 12% this month" />
        <SummaryCard title="Canceled" value="269" trend="- 5% this month" />
      </div>

      <div className="rounded border border-slate-200 bg-white p-3">
        <input type="search" placeholder="Search here..." className="w-full rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-blue-600" />
      </div>

      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-500">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Marketplace Status</th>
                <th className="px-3 py-2">Shipping Status</th>
                <th className="px-3 py-2">WMS Status</th>
                <th className="px-3 py-2">Tracking Number</th>
                <th className="px-3 py-2">Update At</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {outboundOrders.map((order) => (
                <tr key={order.orderId} className="border-t border-slate-100 text-slate-700">
                  <td className="px-3 py-2">{order.orderId}</td>
                  <td className="px-3 py-2">
                    <span className={["rounded px-2 py-1 text-[10px] font-semibold", statusBadgeClass[order.marketplaceStatus] ?? "bg-slate-100 text-slate-700"].join(" ")}>{order.marketplaceStatus}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={["rounded px-2 py-1 text-[10px] font-semibold", statusBadgeClass[order.shippingStatus] ?? "bg-slate-100 text-slate-700"].join(" ")}>{order.shippingStatus}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={["rounded px-2 py-1 text-[10px] font-semibold", statusBadgeClass[order.wmsStatus] ?? "bg-slate-100 text-slate-700"].join(" ")}>{order.wmsStatus}</span>
                  </td>
                  <td className="px-3 py-2">{order.trackingNumber}</td>
                  <td className="px-3 py-2">{order.updateAt}</td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" className="rounded bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500">
          <p>Show 1 to 5 of 425 entries</p>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded border border-slate-300 px-2 py-1">
              1
            </button>
            <button type="button" className="rounded border border-slate-300 px-2 py-1">
              2
            </button>
            <button type="button" className="rounded border border-slate-300 px-2 py-1">
              3
            </button>
            <button type="button" className="rounded border border-slate-300 px-2 py-1">
              4
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};
