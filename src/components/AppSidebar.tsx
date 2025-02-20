
import { Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { 
  CalendarDays, 
  Home, 
  Users, 
  CreditCard,
  LogOut,
  BarChart,
  Clock,
  TableProperties
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AppSidebar = () => {
  const navLinks = [
    { to: "/", icon: <Home size={16} />, label: "Tableau de bord" },
    { to: "/enfants", icon: <Users size={16} />, label: "Enfants" },
    { to: "/paiements", icon: <CreditCard size={16} />, label: "Paiements" },
    { to: "/liste-annuelle", icon: <CalendarDays size={16} />, label: "Liste Annuelle" },
    { to: "/retards", icon: <Clock size={16} />, label: "Retards de Paiement" },
    { to: "/depart", icon: <LogOut size={16} />, label: "Départs" },
    { to: "/rapports", icon: <BarChart size={16} />, label: "Rapports" },
    { to: "/tableau-croise", icon: <TableProperties size={16} />, label: "Tableau Croisé" }
  ];

  return (
    <Sidebar className="h-screen md:block">
      <SidebarContent>
        <div className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start gap-2"
              )}
              preventScrollReset={true}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t" />
    </Sidebar>
  );
};
