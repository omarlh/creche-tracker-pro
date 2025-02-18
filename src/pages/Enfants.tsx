
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, LogOut, Search, X } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore, type Enfant, type PaiementFraisInscription } from "@/data/enfants";
import { EnfantTableau } from "@/components/enfants/EnfantTableau";
import { EnfantFormulaire } from "@/components/enfants/EnfantFormulaire";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Enfants = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  const { enfants, ajouterEnfant, modifierEnfant } = useEnfantStore();
  const { toast } = useToast();
  const [showPaiementForm, setShowPaiementForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedEnfant, setSearchedEnfant] = useState<Enfant | null>(null);

  const handleAddClick = () => {
    setSelectedEnfant(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
    setIsSheetOpen(true);
  };

  const handleViewClick = (enfant: Enfant) => {
    console.log("Voir enfant:", enfant);
  };

  const calculerMontantRestant = (enfant: Enfant) => {
    const montantTotal = enfant.fraisInscription?.montantTotal || 0;
    const montantPaye = enfant.fraisInscription?.montantPaye || 0;
    return montantTotal - montantPaye;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchedEnfant(null);
      return;
    }

    const found = enfants.find(enfant => 
      `${enfant.prenom} ${enfant.nom}`.toLowerCase().includes(term.toLowerCase()) ||
      enfant.nom.toLowerCase().includes(term.toLowerCase()) ||
      enfant.prenom.toLowerCase().includes(term.toLowerCase())
    );

    setSearchedEnfant(found || null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const montantTotal = Number(formData.get("montantTotal") || 300);
    const montantPaiement = Number(formData.get("montantPaiement") || 0);
    const methodePaiement = formData.get("methodePaiement") as "carte" | "especes" | "cheque";

    const nouveauPaiement: PaiementFraisInscription | null = montantPaiement > 0 ? {
      id: Date.now(),
      montant: montantPaiement,
      datePaiement: new Date().toISOString().split('T')[0],
      methodePaiement,
    } : null;

    const nouvelEnfant = {
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      dateNaissance: formData.get("dateNaissance") as string,
      classe: formData.get("classe") as "TPS" | "PS" | "MS" | "GS",
      gsmMaman: formData.get("gsmMaman") as string,
      gsmPapa: formData.get("gsmPapa") as string,
      fraisInscription: {
        montantTotal,
        montantPaye: montantPaiement,
        paiements: nouveauPaiement ? [nouveauPaiement] : [],
      },
      statut: (formData.get("statut") as "actif" | "inactif") || "actif",
      dernierPaiement: new Date().toISOString().split('T')[0],
    };

    if (selectedEnfant) {
      const paiementsExistants = selectedEnfant.fraisInscription?.paiements || [];
      const montantDejaRegle = selectedEnfant.fraisInscription?.montantPaye || 0;
      
      const enfantModifie = {
        ...nouvelEnfant,
        id: selectedEnfant.id,
        fraisInscription: {
          ...nouvelEnfant.fraisInscription,
          montantPaye: montantDejaRegle + (montantPaiement || 0),
          paiements: nouveauPaiement 
            ? [...paiementsExistants, nouveauPaiement]
            : paiementsExistants,
        },
      };

      modifierEnfant(enfantModifie);
      toast({
        title: "Modification réussie",
        description: `Les informations de ${nouvelEnfant.prenom} ont été mises à jour.`,
      });
    } else {
      ajouterEnfant(nouvelEnfant);
      toast({
        title: "Ajout réussi",
        description: `${nouvelEnfant.prenom} a été ajouté(e) à la liste.`,
      });
    }

    setIsSheetOpen(false);
    setShowPaiementForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-2 mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">Inscription d'un Enfant</h1>
              <Button 
                variant="link" 
                className="text-xl text-muted-foreground tracking-tight p-0 h-auto font-normal hover:no-underline"
                onClick={() => navigate('/depart')}
              >
                <LogOut className="w-4 h-4 mr-2 inline" />
                Départ d'un Enfant
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher un enfant..."
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un enfant
              </Button>
            </div>

            {searchedEnfant && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Détails de l'enfant</CardTitle>
                  <CardDescription>
                    Informations complètes de {searchedEnfant.prenom} {searchedEnfant.nom}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Informations personnelles</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">Nom complet</dt>
                          <dd className="font-medium">{searchedEnfant.prenom} {searchedEnfant.nom}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Date de naissance</dt>
                          <dd>{new Date(searchedEnfant.dateNaissance || "").toLocaleDateString("fr-FR")}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Classe</dt>
                          <dd>{searchedEnfant.classe}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Année scolaire</dt>
                          <dd>{searchedEnfant.anneeScolaire}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Statut</dt>
                          <dd>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              searchedEnfant.statut === "actif"
                                ? "bg-success/10 text-success"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {searchedEnfant.statut === "actif" ? "Actif" : "Inactif"}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Contact et paiements</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">GSM Maman</dt>
                          <dd>{searchedEnfant.gsmMaman || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">GSM Papa</dt>
                          <dd>{searchedEnfant.gsmPapa || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Frais d'inscription</dt>
                          <dd className="font-medium">
                            {searchedEnfant.fraisInscription?.montantPaye || 0} DH / {searchedEnfant.fraisInscription?.montantTotal || 0} DH
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Reste à payer</dt>
                          <dd className="font-medium text-warning">
                            {calculerMontantRestant(searchedEnfant)} DH
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted-foreground">Dernier paiement</dt>
                          <dd>{searchedEnfant.dernierPaiement ? new Date(searchedEnfant.dernierPaiement).toLocaleDateString("fr-FR") : "-"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {searchedEnfant.fraisInscription?.paiements && searchedEnfant.fraisInscription.paiements.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Historique des paiements</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {searchedEnfant.fraisInscription.paiements.map((paiement) => (
                            <div key={paiement.id} className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="font-medium">{paiement.montant} DH</span>
                                <span className="text-muted-foreground"> - {new Date(paiement.datePaiement).toLocaleDateString("fr-FR")}</span>
                              </div>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                                {paiement.methodePaiement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleEditClick(searchedEnfant)}>
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <EnfantTableau 
              enfants={enfants}
              onEdit={handleEditClick}
              onView={handleViewClick}
              calculerMontantRestant={calculerMontantRestant}
            />
          </div>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedEnfant ? "Modifier un enfant" : "Ajouter un enfant"}
              </SheetTitle>
            </SheetHeader>
            <EnfantFormulaire 
              selectedEnfant={selectedEnfant}
              showPaiementForm={showPaiementForm}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsSheetOpen(false);
                setShowPaiementForm(false);
              }}
              setShowPaiementForm={setShowPaiementForm}
            />
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
};

export default Enfants;
