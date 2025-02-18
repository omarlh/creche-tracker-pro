
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Download, Filter } from "lucide-react";

type RapportMensuel = {
  mois: string;
  totalPaiements: number;
  nombreEnfants: number;
  paiementsComplets: number;
  paiementsAttente: number;
  tauxRecouvrement: number;
};

// Données de test pour les rapports mensuels
const rapportsMensuels: RapportMensuel[] = [
  {
    mois: "2024-02",
    totalPaiements: 1500,
    nombreEnfants: 10,
    paiementsComplets: 8,
    paiementsAttente: 2,
    tauxRecouvrement: 80,
  },
  {
    mois: "2024-01",
    totalPaiements: 1350,
    nombreEnfants: 9,
    paiementsComplets: 9,
    paiementsAttente: 0,
    tauxRecouvrement: 100,
  },
  {
    mois: "2023-12",
    totalPaiements: 1200,
    nombreEnfants: 8,
    paiementsComplets: 7,
    paiementsAttente: 1,
    tauxRecouvrement: 87.5,
  },
];

const Rapports = () => {
  const [moisSelectionne, setMoisSelectionne] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const handleExportRapport = () => {
    // TODO: Implémenter l'export en PDF ou Excel
    console.log("Export du rapport pour", moisSelectionne);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Rapports Mensuels</h1>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button onClick={handleExportRapport}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Résumé du mois en cours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total des paiements
                </h3>
                <p className="text-2xl font-semibold">1 500 €</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Nombre d'enfants
                </h3>
                <p className="text-2xl font-semibold">10</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Taux de recouvrement
                </h3>
                <p className="text-2xl font-semibold">80%</p>
              </div>
            </div>

            {/* Tableau des rapports mensuels */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Total des paiements</TableHead>
                    <TableHead>Nombre d'enfants</TableHead>
                    <TableHead>Paiements complétés</TableHead>
                    <TableHead>Paiements en attente</TableHead>
                    <TableHead>Taux de recouvrement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rapportsMensuels.map((rapport) => (
                    <TableRow key={rapport.mois}>
                      <TableCell>
                        {new Date(rapport.mois).toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{rapport.totalPaiements} €</TableCell>
                      <TableCell>{rapport.nombreEnfants}</TableCell>
                      <TableCell>
                        <span className="text-success">{rapport.paiementsComplets}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-warning">{rapport.paiementsAttente}</span>
                      </TableCell>
                      <TableCell>{rapport.tauxRecouvrement}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Rapports;
