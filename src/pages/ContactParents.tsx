
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useEnfantStore, type Enfant } from "@/data/enfants";
import { EnfantSearchBar } from "@/components/enfants/search/EnfantSearchBar";
import { AnneeScolaireFilter } from "@/components/enfants/AnneeScolaireFilter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Phone, User, Calendar } from "lucide-react";

const ContactParents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnneeScolaire, setSelectedAnneeScolaire] = useState("all");
  const [filteredEnfants, setFilteredEnfants] = useState<Enfant[]>([]);
  const enfants = useEnfantStore((state) => state.enfants);
  const fetchEnfants = useEnfantStore((state) => state.fetchEnfants);

  // Récupérer les années scolaires uniques
  const anneesScolaires = [...new Set(enfants.map(e => e.anneeScolaire).filter(Boolean))];

  useEffect(() => {
    fetchEnfants();
  }, [fetchEnfants]);

  useEffect(() => {
    let filtered = [...enfants];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(enfant => 
        enfant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enfant.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par année scolaire
    if (selectedAnneeScolaire !== "all") {
      filtered = filtered.filter(enfant => enfant.anneeScolaire === selectedAnneeScolaire);
    }
    
    setFilteredEnfants(filtered);
  }, [enfants, searchTerm, selectedAnneeScolaire]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // Feedback visuel pourrait être ajouté ici (ex: toast)
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">
                Contacts Parents
              </h1>
              <p className="text-muted-foreground">
                Rechercher et accéder aux coordonnées des parents
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <EnfantSearchBar 
                searchTerm={searchTerm}
                onSearch={handleSearch}
              />
              <AnneeScolaireFilter
                selectedAnneeScolaire={selectedAnneeScolaire}
                onAnneeScolaireChange={setSelectedAnneeScolaire}
                anneesScolaires={anneesScolaires}
              />
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Coordonnées des parents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">#</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prénom</TableHead>
                        <TableHead>GSM Maman</TableHead>
                        <TableHead>GSM Papa</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnfants.length > 0 ? (
                        filteredEnfants.map((enfant, index) => (
                          <TableRow key={enfant.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{enfant.nom}</TableCell>
                            <TableCell>{enfant.prenom}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {enfant.gsmMaman || "-"}
                                {enfant.gsmMaman && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(enfant.gsmMaman)}
                                    title="Copier le numéro"
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {enfant.gsmPapa || "-"}
                                {enfant.gsmPapa && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => copyToClipboard(enfant.gsmPapa)}
                                    title="Copier le numéro"
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {enfant.dateInscription 
                                ? new Date(enfant.dateInscription).toLocaleDateString("fr-FR")
                                : "-"
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  const combined = `${enfant.nom} ${enfant.prenom}\nMaman: ${enfant.gsmMaman || 'N/A'}\nPapa: ${enfant.gsmPapa || 'N/A'}`;
                                  copyToClipboard(combined);
                                }}
                              >
                                Copier tout
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            {searchTerm || selectedAnneeScolaire !== "all" 
                              ? "Aucun résultat trouvé pour cette recherche" 
                              : "Aucun enfant inscrit"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ContactParents;
