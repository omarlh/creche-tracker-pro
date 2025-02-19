
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Enfants from "@/pages/Enfants";
import Paiements from "@/pages/Paiements";
import ListeAnnuelle from "@/pages/ListeAnnuelle";
import Depart from "@/pages/Depart";

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
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
