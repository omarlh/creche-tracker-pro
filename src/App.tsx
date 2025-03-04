import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Enfants from './pages/Enfants';
import Paiements from './pages/Paiements';
import CaisseJournaliere from './pages/CaisseJournaliere';
import Rapports from './pages/Rapports';
import Retards from './pages/Retards';
import TableauCroise from './pages/TableauCroise';
import ListeAnnuelle from './pages/ListeAnnuelle';
import Depart from './pages/Depart';

import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(true);
  const { toast } = useToast();

  const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <main className="flex-1 ml-16 md:ml-64">
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Dashboard />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/enfants" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Enfants />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/paiements" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Paiements />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/caisse" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <CaisseJournaliere />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/rapports" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Rapports />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/retards" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Retards />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tableau-croise" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <TableauCroise />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/liste-annuelle" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <ListeAnnuelle />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/depart" 
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Depart />
              </LayoutWithSidebar>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
