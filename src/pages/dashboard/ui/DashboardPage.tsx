import { MainLayout } from "../../../app/layouts/MainLayout";
import { DashboardNavbar } from "../../../widgets/dashboard-navbar/ui/DashboardNavbar";
import { OutboundDashboardContent } from "./OutboundDashboardContent";

const dashboardTabs = [
  { label: "Inbound", disabled: true },
  { label: "Outbound", active: true },
  { label: "Inventory", disabled: true },
  { label: "Settings", disabled: true },
];

export const DashboardPage = () => {
  return (
    <MainLayout className="bg-white">
      <section className="w-full h-screen">
        <DashboardNavbar items={dashboardTabs} />
        <OutboundDashboardContent />
      </section>
    </MainLayout>
  );
};
