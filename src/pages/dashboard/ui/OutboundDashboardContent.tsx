import { SummaryCard } from "../../../widgets/summary-card/ui/SummaryCard";
import { OutboundOrdersTable } from "../../../features/outbound-orders/ui/OutboundOrdersTable";
import { useOutboundOrderSummary } from "../../../features/outbound-orders/model/useOutboundOrderSummary";

export const OutboundDashboardContent = () => {
  const { cancelledOrdersCount, totalOrdersCount, isLoading } = useOutboundOrderSummary();

  return (
    <section className="h-auto space-y-4 bg-white px-6 py-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Outbound</h1>
        <p className="text-xs text-slate-500">Manage all outbound processes</p>
      </header>

      <div className="grid max-w-sm grid-cols-2 gap-3">
        <SummaryCard title="Total order" value={isLoading ? "..." : String(totalOrdersCount)} />
        <SummaryCard title="Canceled" value={isLoading ? "..." : String(cancelledOrdersCount)} />
      </div>

      <OutboundOrdersTable />
    </section>
  );
};
