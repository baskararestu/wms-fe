import { SummaryCard } from "../../../widgets/summary-card/ui/SummaryCard";
import { OutboundOrdersTable } from "../../../features/outbound-orders/ui/OutboundOrdersTable";

export const OutboundDashboardContent = () => {
  return (
    <section className="h-lvh space-y-4 bg-slate-50 px-6 py-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Outbound</h1>
        <p className="text-xs text-slate-500">Manage all outbound processes</p>
      </header>

      <div className="grid max-w-sm grid-cols-2 gap-3">
        <SummaryCard title="Total order" value="0" />
        <SummaryCard title="Canceled" value="0" />
      </div>

      <OutboundOrdersTable />
    </section>
  );
};
