
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Enfants from "@/pages/Enfants";
import Paiements from "@/pages/Paiements";
import ListeAnnuelle from "@/pages/ListeAnnuelle";
import Depart from "@/pages/Depart";
import Rapports from "@/pages/Rapports";
import Retards from "@/pages/Retards";
import TableauCroise from "@/pages/TableauCroise";

const basePath = window.location.pathname.endsWith('/') 
  ? window.location.pathname.slice(0, -1) 
  : window.location.pathname;

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
], {
  basename: basePath || '/'
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
