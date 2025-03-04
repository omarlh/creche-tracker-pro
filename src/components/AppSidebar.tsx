import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  PieChart,
  Settings,
  Table,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  const { open } = useSidebar();

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        active ? "bg-primary/20 text-primary font-medium" : "text-gray-700",
        !open && "justify-center px-2"
      )}
      title={!open ? label : undefined}
    >
      <Icon className="h-5 w-5" />
      {open && <span>{label}</span>}
    </Link>
  );
};

export const AppSidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r bg-gray-50 shadow-md transition-all duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b bg-white px-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          {open && <span className="text-lg font-semibold text-gray-800">CrePay</span>}
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            {!open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <nav className="grid gap-1">
          <SidebarItem
            icon={LayoutDashboard}
            label="Tableau de bord"
            href="/dashboard"
            active={pathname === "/dashboard"}
          />
          <SidebarItem
            icon={Users}
            label="Enfants"
            href="/enfants"
            active={pathname === "/enfants"}
          />
          <SidebarItem
            icon={CreditCard}
            label="Paiements"
            href="/paiements"
            active={pathname === "/paiements"}
          />
          <SidebarItem
            icon={BarChart}
            label="Caisse journalière"
            href="/caisse"
            active={pathname === "/caisse"}
          />
          <SidebarItem
            icon={PieChart}
            label="Rapports"
            href="/rapports"
            active={pathname === "/rapports"}
          />
          <SidebarItem
            icon={CalendarClock}
            label="Retards"
            href="/retards"
            active={pathname === "/retards"}
          />
          <SidebarItem
            icon={Table}
            label="Tableau croisé"
            href="/tableau-croise"
            active={pathname === "/tableau-croise"}
          />
        </nav>
      </div>
      <div className="mt-auto border-t bg-white p-3">
        <nav className="grid gap-1">
          <SidebarItem
            icon={LogOut}
            label="Déconnexion"
            href="/login"
            active={false}
          />
        </nav>
      </div>
    </aside>
  );
};
