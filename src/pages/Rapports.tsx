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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Download, Filter, BadgeCheck, AlertCircle } from "lucide-react";
import { useEnfantStore, type Enfant } from "@/data/enfants";

type RapportMensuel = {
  mois: string;
  totalPaiements: number;
  nombreEnfants: number;
  paiementsComplets: number;
  paiementsAttente: number;
  tauxRecouvrement: number;
  enfantsPaye: number[];
  enfantsNonPaye: number[];
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
    enfantsPaye: [1, 2, 4],
    enfantsNonPaye: [3],
  },
  {
    mois: "2024-01",
    totalPaiements: 1350,
    nombreEnfants: 9,
    paiementsComplets: 9,
    paiementsAttente: 0,
    tauxRecouvrement: 100,
    enfantsPaye: [1, 2, 3, 4],
    enfantsNonPaye: [],
  },
  {
    mois: "2023-12",
    totalPaiements: 1200,
    nombreEnfants: 8,
    paiementsComplets: 7,
    paiementsAttente: 1,
    tauxRecouvrement: 87.5,
    enfantsPaye: [1, 2, 4],
    enfantsNonPaye: [3],
  },
];

const Rapports = () => {
  const [moisSelectionne, setMoisSelectionne] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rapportSelectionne, setRapportSelectionne] = useState<RapportMensuel | null>(null);
  const { enfants } = useEnfantStore();

  const handleExportRapport = () => {
    // TODO: Implémenter l'export en PDF ou Excel
    console.log("Export du rapport pour", moisSelectionne);
  };

  const handleDetailsClick = (rapport: RapportMensuel) => {
    setRapportSelectionne(rapport);
    setIsSheetOpen(true);
  };

  const getEnfantById = (id: number): Enfant | undefined => {
    return enfants.find(enfant => enfant.id === id);
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
                <p className="text-2xl font-semibold">1 500 DH</p>
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
                      <TableCell>{rapport.totalPaiements} DH</TableCell>
                      <TableCell>{rapport.nombreEnfants}</TableCell>
                      <TableCell>
                        <span className="text-success">{rapport.paiementsComplets}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-warning">{rapport.paiementsAttente}</span>
                      </TableCell>
                      <TableCell>{rapport.tauxRecouvrement}%</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDetailsClick(rapport)}
                        >
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

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                Détails du rapport - {rapportSelectionne && new Date(rapportSelectionne.mois).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              {rapportSelectionne && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total des paiements</h4>
                      <p className="text-lg font-semibold mt-1">{rapportSelectionne.totalPaiements} DH</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Nombre d'enfants</h4>
                      <p className="text-lg font-semibold mt-1">{rapportSelectionne.nombreEnfants}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Paiements complétés</h4>
                      <p className="text-lg font-semibold text-success mt-1">{rapportSelectionne.paiementsComplets}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Paiements en attente</h4>
                      <p className="text-lg font-semibold text-warning mt-1">{rapportSelectionne.paiementsAttente}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Taux de recouvrement</h4>
                    <p className="text-lg font-semibold mt-1">{rapportSelectionne.tauxRecouvrement}%</p>
                  </div>

                  {/* Liste des enfants ayant payé */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <BadgeCheck className="w-4 h-4 mr-2 text-success" />
                      Enfants ayant payé
                    </h4>
                    <div className="space-y-2">
                      {rapportSelectionne.enfantsPaye.map((enfantId) => {
                        const enfant = getEnfantById(enfantId);
                        return enfant ? (
                          <div key={enfant.id} className="p-2 bg-success/5 rounded-md">
                            <p className="text-sm font-medium">
                              {enfant.prenom} {enfant.nom}
                            </p>
                            <p className="text-xs text-gray-500">
                              Classe: {enfant.classe}
                            </p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Liste des enfants n'ayant pas payé */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-warning" />
                      Enfants en attente de paiement
                    </h4>
                    <div className="space-y-2">
                      {rapportSelectionne.enfantsNonPaye.map((enfantId) => {
                        const enfant = getEnfantById(enfantId);
                        return enfant ? (
                          <div key={enfant.id} className="p-2 bg-warning/5 rounded-md">
                            <p className="text-sm font-medium">
                              {enfant.prenom} {enfant.nom}
                            </p>
                            <p className="text-xs text-gray-500">
                              Classe: {enfant.classe}
                            </p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
};

export default Rapports;
