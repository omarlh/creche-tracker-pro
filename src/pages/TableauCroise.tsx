
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const TableauCroise = () => {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("2024-2025");

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
      p.moisConcerne === dateMois &&
      p.typePaiement === "mensualite"
    );
  };

  const getMontantInscriptionPaye = (enfantId: number) => {
    return paiements
      .filter(p => 
        p.enfantId === enfantId && 
        p.typePaiement === "inscription" &&
        p.anneeScolaire === selectedAnneeScolaire
      )
      .reduce((sum, p) => sum + p.montant, 0);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Tableau Croisé Dynamique Enfant
              </h1>
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
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                      <TableHead rowSpan={2} className="bg-muted">Date d'inscription</TableHead>
                      <TableHead rowSpan={2} className="bg-muted text-right">
                        Frais d'inscription payés
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
                      .map((enfant) => (
                        <TableRow key={enfant.id}>
                          <TableCell className="font-medium">
                            {enfant.prenom} {enfant.nom}
                          </TableCell>
                          <TableCell>
                            {enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {getMontantInscriptionPaye(enfant.id)} DH
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
                    ))}
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
