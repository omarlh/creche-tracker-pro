
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download } from "lucide-react";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import { usePaiementStore } from "@/data/paiements";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StatisticsCards } from "@/components/rapports/StatisticsCards";
import { RapportsTable } from "@/components/rapports/RapportsTable";
import { InscriptionsStats } from "@/components/rapports/InscriptionsStats";
import { EnfantsTable } from "@/components/rapports/EnfantsTable";
import { RapportDetails } from "@/components/rapports/RapportDetails";

const anneesDisponibles = [
  "2023/2024",
  "2024/2025",
  "2025/2026",
  "2026/2027",
  "2027/2028",
  "2028/2029",
  "2029/2030",
  "2030/2031",
  "2031/2032",
  "2032/2033"
];

const moisDisponibles = [
  "Tous les mois",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin"
];

export type RapportMensuel = {
  mois: string;
  totalPaiements: number;
  totalFraisInscription: number;
  nombreEnfants: number;
  paiementsComplets: number;
  paiementsAttente: number;
  tauxRecouvrement: number;
  enfantsPaye: number[];
  enfantsNonPaye: number[];
};

const Rapports: React.FC = () => {
  const [anneeScolaireSelectionnee, setAnneeScolaireSelectionnee] = useState<string>("2024/2025");
  const [moisSelectionne, setMoisSelectionne] = useState<string>("Tous les mois");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rapportSelectionne, setRapportSelectionne] = useState<RapportMensuel | null>(null);
  const [rapportsMensuels, setRapportsMensuels] = useState<RapportMensuel[]>([]);
  const { enfants } = useEnfantStore();
  const { paiements } = usePaiementStore();
  const { toast } = useToast();

  useEffect(() => {
    const genererRapportsMensuels = () => {
      const rapportsGeneres: RapportMensuel[] = [];
      
      const [anneeDebut, anneeFin] = anneeScolaireSelectionnee.split("/");
      console.log("Génération des rapports pour l'année scolaire:", anneeDebut, "-", anneeFin);
      
      const moisAGenerer = [];
      
      for (let mois = 8; mois < 12; mois++) {
        const date = new Date(parseInt(anneeDebut), mois);
        moisAGenerer.push(date);
      }
      
      for (let mois = 0; mois <= 6; mois++) {
        const date = new Date(parseInt(anneeFin), mois);
        moisAGenerer.push(date);
      }

      moisAGenerer.forEach(date => {
        if (date.getMonth() !== 7) {
          const moisCourant = date.toISOString().slice(0, 7);
          
          const paiementsDuMois = paiements.filter(paiement => {
            const datePaiement = new Date(paiement.datePaiement);
            return datePaiement.getMonth() === date.getMonth() && 
                   datePaiement.getFullYear() === date.getFullYear();
          });

          const enfantsAvecPaiement = new Set(paiementsDuMois.map(p => p.enfantId));
          
          const totalPaiements = paiementsDuMois.reduce((sum, paiement) => 
            sum + paiement.montant, 0
          );

          const totalFraisInscription = enfants
            .filter(enfant => {
              const dernierPaiement = new Date(enfant.dernierPaiement || '');
              return dernierPaiement.getMonth() === date.getMonth() && 
                     dernierPaiement.getFullYear() === date.getFullYear() &&
                     enfant.anneeScolaire === anneeScolaireSelectionnee.replace("/", "-");
            })
            .reduce((sum, enfant) => sum + (enfant.fraisInscription?.montantPaye || 0), 0);

          const enfantsActifs = enfants.filter(enfant => 
            enfant.anneeScolaire === anneeScolaireSelectionnee.replace("/", "-") &&
            enfant.statut === "actif"
          );

          const enfantsPaye = Array.from(enfantsAvecPaiement);
          const enfantsNonPaye = enfantsActifs
            .filter(enfant => !enfantsAvecPaiement.has(enfant.id))
            .map(enfant => enfant.id);

          rapportsGeneres.push({
            mois: moisCourant,
            totalPaiements,
            totalFraisInscription,
            nombreEnfants: enfantsActifs.length,
            paiementsComplets: enfantsPaye.length,
            paiementsAttente: enfantsActifs.length - enfantsPaye.length,
            tauxRecouvrement: enfantsActifs.length ? 
              (enfantsPaye.length / enfantsActifs.length) * 100 : 0,
            enfantsPaye,
            enfantsNonPaye,
          });
        }
      });

      rapportsGeneres.sort((a, b) => a.mois.localeCompare(b.mois));
      
      if (moisSelectionne !== "Tous les mois") {
        const moisIndex = moisDisponibles.indexOf(moisSelectionne) - 1;
        // Ajuster l'index pour les mois de septembre à décembre
        const moisAjuste = moisIndex >= 3 ? moisIndex - 3 : moisIndex + 9;
        setRapportsMensuels(rapportsGeneres.filter(rapport => 
          new Date(rapport.mois).getMonth() === moisAjuste
        ));
      } else {
        setRapportsMensuels(rapportsGeneres);
      }
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, moisSelectionne, enfants, paiements]);

  const enfantsParAnneeScolaire = anneesDisponibles.reduce((acc, annee) => {
    acc[annee] = enfants.filter(enfant => enfant.anneeScolaire === annee);
    return acc;
  }, {} as Record<string, Enfant[]>);

  const getStatistiquesAnnee = (annee: string) => {
    const enfantsAnnee = enfantsParAnneeScolaire[annee] || [];
    const total = enfantsAnnee.length;
    const actifs = enfantsAnnee.filter(e => e.statut === "actif").length;
    const inactifs = total - actifs;
    
    return {
      total,
      actifs,
      inactifs
    };
  };

  const handleExportRapport = () => {
    try {
      const data = rapportsMensuels.map(rapport => ({
        "Mois": new Date(rapport.mois).toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric"
        }),
        "Total des paiements (DH)": rapport.totalPaiements,
        "Total des frais d'inscription (DH)": rapport.totalFraisInscription,
        "Nombre d'enfants": rapport.nombreEnfants,
        "Paiements complétés": rapport.paiementsComplets,
        "Paiements en attente": rapport.paiementsAttente,
        "Taux de recouvrement (%)": rapport.tauxRecouvrement
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rapports Mensuels");
      XLSX.writeFile(workbook, `rapport_mensuel_${new Date().toISOString().slice(0, 7)}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le rapport a été exporté avec succès au format Excel",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export du rapport",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePrintRapport = () => {
    window.print();
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
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Rapports Mensuels</h2>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-semibold">Rapports Mensuels</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Select 
                        value={anneeScolaireSelectionnee}
                        onValueChange={setAnneeScolaireSelectionnee}
                      >
                        <SelectTrigger className="w-[200px] bg-gray-200 border-0">
                          <SelectValue placeholder="Année scolaire" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-100">
                          <SelectGroup>
                            <SelectLabel>Sélectionner une année scolaire</SelectLabel>
                            {anneesDisponibles.map(annee => (
                              <SelectItem key={annee} value={annee}>
                                Année scolaire {annee}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={moisSelectionne}
                        onValueChange={setMoisSelectionne}
                      >
                        <SelectTrigger className="w-[200px] bg-gray-200 border-0">
                          <SelectValue placeholder="Sélectionner un mois" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-100">
                          <SelectGroup>
                            <SelectLabel>Sélectionner un mois</SelectLabel>
                            {moisDisponibles.map(mois => (
                              <SelectItem key={mois} value={mois}>
                                {mois}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleExportRapport}>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>

                <StatisticsCards rapportsMensuels={rapportsMensuels} />
                <RapportsTable 
                  rapportsMensuels={rapportsMensuels}
                  onDetailsClick={handleDetailsClick}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Inscriptions par Année Scolaire</h2>
                </div>

                <InscriptionsStats
                  anneeScolaireSelectionnee={anneeScolaireSelectionnee}
                  getStatistiquesAnnee={getStatistiquesAnnee}
                />

                <EnfantsTable 
                  enfants={enfantsParAnneeScolaire[anneeScolaireSelectionnee] || []}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:w-full print:max-w-none print:overflow-visible">
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
              <RapportDetails
                rapport={rapportSelectionne}
                onPrint={handlePrintRapport}
                getEnfantById={getEnfantById}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
};

export default Rapports;
