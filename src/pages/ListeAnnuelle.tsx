
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Classe } from "@/data/enfants";

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
  "2028-2029",
  "2029-2030",
  "2030-2031",
  "2031-2032",
  "2032-2033"
];

const classes: Classe[] = ["TPS", "PS", "MS", "GS"];

const ListeAnnuelle = () => {
  const { enfants, fetchEnfants } = useEnfantStore();
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("all");
  const [selectedClasse, setSelectedClasse] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchEnfants();
  }, [fetchEnfants]);

  const filteredEnfants = enfants.filter(enfant => {
    const matchesAnnee = selectedAnneeScolaire === "all" || enfant.anneeScolaire === selectedAnneeScolaire;
    const matchesClasse = selectedClasse === "all" || enfant.classe === selectedClasse;
    return matchesAnnee && matchesClasse;
  });

  const getStatutColor = (statut: "actif" | "inactif" | undefined) => {
    if (statut === "actif") return "text-green-600 bg-green-50";
    if (statut === "inactif") return "text-gray-600 bg-gray-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const handleAssuranceChange = async (enfantId: number, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('enfants')
        .update({ assurance_declaree: checked })
        .eq('id', enfantId);

      if (error) throw error;

      await fetchEnfants();
      
      toast({
        title: "Mise à jour réussie",
        description: "Le statut d'assurance a été mis à jour avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut d\'assurance:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut d'assurance.",
        variant: "destructive",
      });
    }
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

            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <AnneeScolaireFilter
                  selectedAnneeScolaire={selectedAnneeScolaire}
                  onAnneeScolaireChange={setSelectedAnneeScolaire}
                  anneesScolaires={anneesDisponibles}
                />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 mb-2 text-sm font-medium">
                  Classe
                </label>
                <Select 
                  value={selectedClasse} 
                  onValueChange={setSelectedClasse}
                >
                  <SelectTrigger className="w-full">
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
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {selectedAnneeScolaire === "all" 
                      ? "Tous les enfants" 
                      : `Enfants inscrits en ${selectedAnneeScolaire}`}
                    {selectedClasse !== "all" && ` - Classe ${selectedClasse}`}
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
                      <TableHead className="text-right">Frais Mensuel Négocié</TableHead>
                      <TableHead className="text-center">Assurance</TableHead>
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
                        <TableCell className="text-center">
                          <Checkbox
                            checked={enfant.assurance_declaree}
                            onCheckedChange={(checked) => {
                              handleAssuranceChange(enfant.id, checked as boolean);
                            }}
                            aria-label="Assurance déclarée"
                          />
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

