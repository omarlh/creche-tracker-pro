
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export const AppSidebar = () => {
  return (
    <Sidebar className="h-screen md:block">
      <div className="space-y-1">
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
      </div>
    </Sidebar>
  );
};
