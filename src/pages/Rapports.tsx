import React from "react";
import { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Download, BadgeCheck, AlertCircle, Printer } from "lucide-react";
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

type RapportMensuel = {
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

const Rapports = () => {
  const [anneeScolaireSelectionnee, setAnneeScolaireSelectionnee] = useState<string>("2024/2025");
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
      
      console.log("Rapports générés:", rapportsGeneres);
      setRapportsMensuels(rapportsGeneres);
    };

    genererRapportsMensuels();
  }, [anneeScolaireSelectionnee, enfants, paiements]);

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
                  </div>
                  <Button onClick={handleExportRapport}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Total des paiements
                  </h3>
                  <p className="text-2xl font-semibold">
                    {rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalPaiements, 0)} DH
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Total des frais d'inscription
                  </h3>
                  <p className="text-2xl font-semibold">
                    {rapportsMensuels.reduce((sum, rapport) => sum + rapport.totalFraisInscription, 0)} DH
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Nombre d'enfants
                  </h3>
                  <p className="text-2xl font-semibold">
                    {rapportsMensuels[0]?.nombreEnfants || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mois</TableHead>
                      <TableHead>Paiements Mensuels</TableHead>
                      <TableHead>Frais d'inscription</TableHead>
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
                        <TableCell>{rapport.totalFraisInscription} DH</TableCell>
                        <TableCell>{rapport.nombreEnfants}</TableCell>
                        <TableCell>
                          <span className="text-success">{rapport.paiementsComplets}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-warning">{rapport.paiementsAttente}</span>
                        </TableCell>
                        <TableCell>{rapport.tauxRecouvrement.toFixed(1)}%</TableCell>
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

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Inscriptions par Année Scolaire</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total des inscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getStatistiquesAnnee(anneeScolaireSelectionnee).total}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Élèves actifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {getStatistiquesAnnee(anneeScolaireSelectionnee).actifs}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Élèves inactifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-500">
                      {getStatistiquesAnnee(anneeScolaireSelectionnee).inactifs}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Taux d'activité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getStatistiquesAnnee(anneeScolaireSelectionnee).total > 0 
                        ? Math.round((getStatistiquesAnnee(anneeScolaireSelectionnee).actifs / 
                            getStatistiquesAnnee(anneeScolaireSelectionnee).total) * 100)
                        : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Date de naissance</TableHead>
                      <TableHead>GSM Maman</TableHead>
                      <TableHead>GSM Papa</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableHead>
                  </TableHeader>
                  <TableBody>
                    {enfantsParAnneeScolaire[anneeScolaireSelectionnee]?.map((enfant) => (
                      <TableRow key={enfant.id}>
                        <TableCell>{enfant.nom}</TableCell>
                        <TableCell>{enfant.prenom}</TableCell>
                        <TableCell>{enfant.classe}</TableCell>
                        <TableCell>
                          {new Date(enfant.dateNaissance || "").toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>{enfant.gsmMaman || "-"}</TableCell>
                        <TableCell>{enfant.gsmPapa || "-"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              enfant.statut === "actif"
                                ? "bg-success/10 text-success"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {enfant.statut === "actif" ? "Actif" : "Inactif"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:w-full print:max-w-none print:overflow-visible">
          <SheetHeader>
            <SheetTitle>
              Détails du rapport - {rapportSelectionne && new Date(rapportSelectionne.mois).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </SheetTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrintRapport}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
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
                    <h4 className="text-sm font-medium text-gray-500">Total des frais d'inscription</h4>
                    <p className="text-lg font-semibold mt-1">{rapportSelectionne.totalFraisInscription} DH</p>
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
  );
};

export default Rapports;
