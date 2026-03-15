import type { MouseEvent } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuLayoutGrid, LuLogOut } from "react-icons/lu";

type NavbarItem = {
  label: string;
  active?: boolean;
  disabled?: boolean;
};

type DashboardNavbarProps = {
  items: NavbarItem[];
};

export const DashboardNavbar = ({ items }: DashboardNavbarProps) => {
  const onNoAction = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <header className="relative flex items-center bg-blue-600 px-6 py-5 text-white min-h-20 max-lg:py-4">
      {/* Left: Brand */}
      <div className="flex items-center gap-2 text-2xl font-semibold">
        <LuLayoutGrid />
        <span>WMSpaceIO</span>
      </div>

      {/* Center: Tabs */}
      <nav aria-label="Dashboard tabs" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-xs">
        {items.map((item) => (
          <button key={item.label} type="button" onClick={item.disabled ? onNoAction : undefined} className={["rounded px-3 py-1 font-medium transition", item.active ? "bg-white text-blue-600" : "text-blue-100", item.disabled ? "cursor-not-allowed opacity-90" : ""].filter(Boolean).join(" ")}>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right: Icons */}
      <div className="ml-auto flex items-center gap-3">
        <button type="button" className="rounded border border-white bg-white p-1" aria-label="Notifications">
          <IoNotificationsOutline color="black" />
        </button>

        <button type="button" className="h-7 w-7 rounded-full bg-slate-100 text-xs font-bold text-blue-600" aria-label="Profile">
          BR
        </button>

        <button type="button" className="p-1" aria-label="Logout">
          <LuLogOut />
        </button>
      </div>
    </header>
  );
};
