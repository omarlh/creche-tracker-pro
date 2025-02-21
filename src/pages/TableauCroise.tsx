
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import { EnfantSearchBar } from "@/components/enfants/search/EnfantSearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Classe } from "@/data/enfants";

const moisScolaires = [
  "Septembre", "Octobre", "Novembre", "Décembre",
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
];

const moisMapping = {
  "Septembre": "09",
  "Octobre": "10",
  "Novembre": "11",
  "Décembre": "12",
  "Janvier": "01",
  "Février": "02",
  "Mars": "03",
  "Avril": "04",
  "Mai": "05",
  "Juin": "06"
};

const classes: Classe[] = ["TPS", "PS", "MS", "GS"];

const TableauCroise = () => {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("2024-2025");
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const genererAnnesScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    return anneesDisponibles;
  };

  useEffect(() => {
    fetchEnfants();
    fetchPaiements();
  }, [fetchEnfants, fetchPaiements]);

  const getPaiementMensuel = (enfantId: number, mois: string) => {
    const moisNum = moisMapping[mois as keyof typeof moisMapping];
    const [anneeDebut, anneeFin] = selectedAnneeScolaire.split("-");
    const annee = parseInt(moisNum) > 8 ? anneeDebut : anneeFin;
    const dateMois = `${annee}-${moisNum}-01`;

    return paiements.find(p => 
      p.enfantId === enfantId && 
      p.moisConcerne === dateMois
    );
  };

  const getMontantInscription = (enfantId: number) => {
    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant || !enfant.fraisInscription) {
      return {
        montantTotal: 800,
        montantPaye: 0
      };
    }
    return {
      montantTotal: enfant.fraisInscription.montantTotal,
      montantPaye: enfant.fraisInscription.montantPaye
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    try {
      const data = enfants
        .filter(e => e.anneeScolaire === selectedAnneeScolaire)
        .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
        .filter(e => {
          const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        })
        .map(enfant => {
          const inscription = getMontantInscription(enfant.id);
          const row: any = {
            "Nom": `${enfant.prenom} ${enfant.nom}`,
            "Classe": enfant.classe || "-",
            "Date d'inscription": enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-",
            "Frais d'inscription": `${inscription.montantPaye}/${inscription.montantTotal} DH`,
          };

          moisScolaires.forEach(mois => {
            const paiement = getPaiementMensuel(enfant.id, mois);
            row[mois] = paiement ? `${paiement.montant} DH` : "-";
          });

          return row;
        });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tableau Croisé");
      XLSX.writeFile(wb, `tableau_croise_${selectedAnneeScolaire}.xlsx`);

      toast({
        title: "Export réussi",
        description: "Le tableau a été exporté avec succès en Excel",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur s'est produite pendant l'export",
        variant: "destructive",
      });
      console.error("Erreur d'export:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Suivi des Paiements Annuels par Enfant
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Année scolaire:</span>
                  <Select 
                    value={selectedAnneeScolaire} 
                    onValueChange={setSelectedAnneeScolaire}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      {genererAnnesScolaires().map((annee) => (
                        <SelectItem key={annee} value={annee}>
                          {annee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Classe:</span>
                  <Select 
                    value={selectedClasse} 
                    onValueChange={setSelectedClasse}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les classes</SelectItem>
                      {classes.map((classe) => (
                        <SelectItem key={classe} value={classe}>
                          {classe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportExcel}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exporter Excel
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <EnfantSearchBar
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Suivi des paiements par enfant - {selectedAnneeScolaire}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead rowSpan={2} className="bg-muted">Nom</TableHead>
                      <TableHead rowSpan={2} className="bg-muted">Classe</TableHead>
                      <TableHead rowSpan={2} className="bg-muted">Date d'inscription</TableHead>
                      <TableHead rowSpan={2} className="bg-muted text-right">
                        Frais d'inscription
                      </TableHead>
                      <TableHead colSpan={10} className="text-center bg-muted">
                        Paiements mensuels
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      {moisScolaires.map((mois) => (
                        <TableHead key={mois} className="text-right bg-muted/50">
                          {mois}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enfants
                      .filter(e => e.anneeScolaire === selectedAnneeScolaire)
                      .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
                      .filter(e => {
                        const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
                        return fullName.includes(searchTerm.toLowerCase());
                      })
                      .map((enfant) => {
                        const inscription = getMontantInscription(enfant.id);
                        return (
                          <TableRow key={enfant.id}>
                            <TableCell className="font-medium">
                              {enfant.prenom} {enfant.nom}
                            </TableCell>
                            <TableCell>
                              {enfant.classe || "-"}
                            </TableCell>
                            <TableCell>
                              {enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className={`text-right ${
                              inscription.montantPaye >= inscription.montantTotal 
                                ? "bg-green-50" 
                                : "bg-red-50"
                            }`}>
                              {inscription.montantPaye}/{inscription.montantTotal} DH
                            </TableCell>
                            {moisScolaires.map((mois) => {
                              const paiement = getPaiementMensuel(enfant.id, mois);
                              return (
                                <TableCell 
                                  key={`${enfant.id}-${mois}`} 
                                  className={`text-right ${paiement ? "bg-green-50" : "bg-red-50"}`}
                                >
                                  {paiement ? `${paiement.montant} DH` : "-"}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TableauCroise;

