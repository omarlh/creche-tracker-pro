
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  PieChart,
  Search,
  Settings,
  Table,
  Users,
  Phone,
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
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

export const AppSidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          {!open ? (
            <LayoutDashboard className="h-6 w-6" />
          ) : (
            <>
              <LayoutDashboard className="h-6 w-6" />
              <span className="text-lg font-semibold">CrePay</span>
            </>
          )}
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
      <div className={cn("flex-1 overflow-auto p-3", !open && "items-center")}>
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
          <SidebarItem
            icon={Phone}
            label="Contacts Parents"
            href="/contacts"
            active={pathname === "/contacts"}
          />
        </nav>
      </div>
      <div className="mt-auto border-t p-3">
        <nav className="grid gap-1">
          <SidebarItem
            icon={Settings}
            label="Paramètres"
            href="/settings"
            active={pathname === "/settings"}
          />
          <SidebarItem
            icon={LogOut}
            label="Déconnexion"
            href="/login"
            active={false}
          />
        </nav>
      </div>
    </div>
  );
};
