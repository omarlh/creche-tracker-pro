
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/enfants" 
          element={
            <ProtectedRoute>
              <Enfants />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/paiements" 
          element={
            <ProtectedRoute>
              <Paiements />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/caisse" 
          element={
            <ProtectedRoute>
              <CaisseJournaliere />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/rapports" 
          element={
            <ProtectedRoute>
              <Rapports />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/retards" 
          element={
            <ProtectedRoute>
              <Retards />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tableau-croise" 
          element={
            <ProtectedRoute>
              <TableauCroise />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/liste-annuelle" 
          element={
            <ProtectedRoute>
              <ListeAnnuelle />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/depart" 
          element={
            <ProtectedRoute>
              <Depart />
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
