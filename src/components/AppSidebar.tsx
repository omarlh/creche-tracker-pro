
import { Home, Users, CreditCard, FileText, AlertTriangle, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Tableau de bord", icon: Home, path: "/" },
    { title: "Enfants", icon: Users, path: "/enfants" },
    { title: "Paiements", icon: CreditCard, path: "/paiements" },
    { title: "Rapports", icon: FileText, path: "/rapports" },
    { title: "Retards", icon: AlertTriangle, path: "/retards" },
    { title: "Départ", icon: LogOut, path: "/depart" },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.path)}>
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
