
import { createBrowserRouter, RouterProvider, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/pages/Dashboard";
import Enfants from "@/pages/Enfants";
import Paiements from "@/pages/Paiements";
import ListeAnnuelle from "@/pages/ListeAnnuelle";
import Depart from "@/pages/Depart";
import Rapports from "@/pages/Rapports";
import Retards from "@/pages/Retards";
import TableauCroise from "@/pages/TableauCroise";
import { useActivityLogger } from "@/hooks/useActivityLogger";

// Wrapper component to use hooks
const AppWrapper = () => {
  useActivityLogger(); // Initialize activity logging

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/enfants",
    element: <Enfants />,
  },
  {
    path: "/paiements",
    element: <Paiements />,
  },
  {
    path: "/liste-annuelle",
    element: <ListeAnnuelle />,
  },
  {
    path: "/depart",
    element: <Depart />,
  },
  {
    path: "/rapports",
    element: <Rapports />,
  },
  {
    path: "/retards",
    element: <Retards />,
  },
  {
    path: "/tableau-croise",
    element: <TableauCroise />,
  },
]);

function App() {
  return <AppWrapper />;
}

export default App;
