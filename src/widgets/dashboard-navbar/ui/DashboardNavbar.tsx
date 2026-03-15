import { useState, type MouseEvent } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuLayoutGrid, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logoutUser } from "../../../entities/user/api/logout";

type NavbarItem = {
  label: string;
  active?: boolean;
  disabled?: boolean;
};

type DashboardNavbarProps = {
  items: NavbarItem[];
};

export const DashboardNavbar = ({ items }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onNoAction = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logoutUser();
      toast.success("Logout berhasil");
      navigate("/login", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Logout gagal", { description: error.message });
      } else {
        toast.error("Logout gagal");
      }
    } finally {
      setIsLoggingOut(false);
    }
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

        <button type="button" className="p-1 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Logout" onClick={onLogout} disabled={isLoggingOut}>
          <LuLogOut />
        </button>
      </div>
    </header>
  );
};
