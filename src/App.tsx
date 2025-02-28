
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Enfants from "@/pages/Enfants";
import Paiements from "@/pages/Paiements";
import ListeAnnuelle from "@/pages/ListeAnnuelle";
import Depart from "@/pages/Depart";
import Rapports from "@/pages/Rapports";
import Retards from "@/pages/Retards";
import TableauCroise from "@/pages/TableauCroise";
import CaisseJournaliere from "@/pages/CaisseJournaliere";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/enfants",
    element: (
      <ProtectedRoute>
        <Enfants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/paiements",
    element: (
      <ProtectedRoute>
        <Paiements />
      </ProtectedRoute>
    ),
  },
  {
    path: "/liste-annuelle",
    element: (
      <ProtectedRoute>
        <ListeAnnuelle />
      </ProtectedRoute>
    ),
  },
  {
    path: "/depart",
    element: (
      <ProtectedRoute>
        <Depart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/rapports",
    element: (
      <ProtectedRoute>
        <Rapports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/retards",
    element: (
      <ProtectedRoute>
        <Retards />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tableau-croise",
    element: (
      <ProtectedRoute>
        <TableauCroise />
      </ProtectedRoute>
    ),
  },
  {
    path: "/caisse-journaliere",
    element: (
      <ProtectedRoute>
        <CaisseJournaliere />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SidebarProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
