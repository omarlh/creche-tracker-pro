
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnneeScolaireFilter } from "@/components/enfants/AnneeScolaireFilter";
import { useEnfantStore } from "@/data/enfants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ListeAnnuelle = () => {
  const { enfants, fetchEnfants } = useEnfantStore();
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("all");
  const [anneesScolaires, setAnneesScolaires] = useState<string[]>([]);

  useEffect(() => {
    fetchEnfants();
  }, [fetchEnfants]);

  useEffect(() => {
    // Extraire les années scolaires uniques de la liste des enfants
    const annees = [...new Set(enfants.map(enfant => enfant.anneeScolaire || "2024-2025"))];
    setAnneesScolaires(annees.sort());
  }, [enfants]);

  const filteredEnfants = enfants.filter(enfant => 
    selectedAnneeScolaire === "all" || enfant.anneeScolaire === selectedAnneeScolaire
  );

  const getStatutColor = (statut: "actif" | "inactif" | undefined) => {
    if (statut === "actif") return "text-green-600 bg-green-50";
    if (statut === "inactif") return "text-gray-600 bg-gray-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Liste des Enfants par Année Scolaire
              </h1>
            </div>

            <div className="mb-6">
              <AnneeScolaireFilter
                selectedAnneeScolaire={selectedAnneeScolaire}
                onAnneeScolaireChange={setSelectedAnneeScolaire}
                anneesScolaires={anneesScolaires}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {selectedAnneeScolaire === "all" 
                      ? "Tous les enfants" 
                      : `Enfants inscrits en ${selectedAnneeScolaire}`}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Total: {filteredEnfants.length} enfants
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Année Scolaire</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Frais Mensuel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnfants.map((enfant) => (
                      <TableRow key={enfant.id}>
                        <TableCell className="font-medium">{enfant.nom}</TableCell>
                        <TableCell>{enfant.prenom}</TableCell>
                        <TableCell>{enfant.classe}</TableCell>
                        <TableCell>{enfant.anneeScolaire}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(enfant.statut)}`}>
                            {enfant.statut || "Non défini"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {enfant.fraisScolariteMensuel} DH
                        </TableCell>
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

export default ListeAnnuelle;
