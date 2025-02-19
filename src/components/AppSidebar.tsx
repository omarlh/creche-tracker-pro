
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { 
  CalendarDays, 
  Home, 
  Users, 
  CreditCard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AppSidebar = () => {
  return (
    <Sidebar className="h-screen md:block">
      <div className="space-y-1">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2"
          )}
        >
          <Home size={16} />
          Tableau de bord
        </Link>
        <Link
          to="/enfants"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2"
          )}
        >
          <Users size={16} />
          Enfants
        </Link>
        <Link
          to="/paiements"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2"
          )}
        >
          <CreditCard size={16} />
          Paiements
        </Link>
        <Link
          to="/liste-annuelle"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2"
          )}
        >
          <CalendarDays size={16} />
          Liste Annuelle
        </Link>
        <Link
          to="/depart"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start gap-2"
          )}
        >
          <LogOut size={16} />
          Départs
        </Link>
      </div>
    </Sidebar>
  );
};
