
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BadgeCheck, Plus, UserX, Wallet } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore, type Enfant, type PaiementFraisInscription } from "@/data/enfants";

const Enfants = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  const { enfants, ajouterEnfant, modifierEnfant } = useEnfantStore();
  const { toast } = useToast();
  const [showPaiementForm, setShowPaiementForm] = useState(false);

  const handleAddClick = () => {
    setSelectedEnfant(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
    setIsSheetOpen(true);
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

  const calculerMontantRestant = (enfant: Enfant) => {
    const montantTotal = enfant.fraisInscription?.montantTotal || 0;
    const montantPaye = enfant.fraisInscription?.montantPaye || 0;
    return montantTotal - montantPaye;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Gestion des Enfants</h1>
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un enfant
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Date de naissance</TableHead>
                    <TableHead>Frais d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernier paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enfants.map((enfant) => (
                    <TableRow key={enfant.id}>
                      <TableCell className="font-medium">{enfant.nom}</TableCell>
                      <TableCell>{enfant.prenom}</TableCell>
                      <TableCell>
                        {new Date(enfant.dateNaissance || "").toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center ${
                            enfant.fraisInscription?.montantPaye === enfant.fraisInscription?.montantTotal
                              ? "text-success"
                              : "text-warning"
                          }`}>
                            <Wallet className="w-4 h-4 mr-1" />
                            {enfant.fraisInscription?.montantPaye || 0} DH / {enfant.fraisInscription?.montantTotal || 0} DH
                          </span>
                          {calculerMontantRestant(enfant) > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Reste à payer : {calculerMontantRestant(enfant)} DH
                            </span>
                          )}
                        </div>
                      </TableCell>
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
                      <TableCell>
                        {new Date(enfant.dernierPaiement || "").toLocaleDateString(
                          "fr-FR"
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(enfant)}
                        >
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm">
                          Voir
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
                {selectedEnfant ? "Modifier un enfant" : "Ajouter un enfant"}
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nom" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    defaultValue={selectedEnfant?.nom}
                    placeholder="Nom de l'enfant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="prenom" className="text-sm font-medium">
                    Prénom
                  </label>
                  <Input
                    id="prenom"
                    name="prenom"
                    defaultValue={selectedEnfant?.prenom}
                    placeholder="Prénom de l'enfant"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="dateNaissance" className="text-sm font-medium">
                  Date de naissance
                </label>
                <Input
                  id="dateNaissance"
                  name="dateNaissance"
                  type="date"
                  defaultValue={selectedEnfant?.dateNaissance}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="montantTotal" className="text-sm font-medium">
                    Montant total des frais d'inscription
                  </label>
                  <Input
                    id="montantTotal"
                    name="montantTotal"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={selectedEnfant?.fraisInscription?.montantTotal || 300}
                    required
                  />
                </div>

                {(showPaiementForm || !selectedEnfant) && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <label htmlFor="montantPaiement" className="text-sm font-medium">
                        Montant du paiement
                      </label>
                      <Input
                        id="montantPaiement"
                        name="montantPaiement"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Montant à payer maintenant"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="methodePaiement" className="text-sm font-medium">
                        Méthode de paiement
                      </label>
                      <select
                        id="methodePaiement"
                        name="methodePaiement"
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                        defaultValue="carte"
                      >
                        <option value="carte">Carte bancaire</option>
                        <option value="especes">Espèces</option>
                        <option value="cheque">Chèque</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedEnfant && !showPaiementForm && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPaiementForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un paiement
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="statut" className="text-sm font-medium">
                  Statut
                </label>
                <select
                  id="statut"
                  name="statut"
                  defaultValue={selectedEnfant?.statut || "actif"}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="pt-4 space-x-2 flex justify-end">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    setIsSheetOpen(false);
                    setShowPaiementForm(false);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
};

export default Enfants;
