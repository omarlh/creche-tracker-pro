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
import { Input } from "@/components/ui/input";
import { BadgeCheck, CreditCard, Keyboard, Plus, Receipt, Trash2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { useEnfantStore } from "@/data/enfants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaiementStore, type Paiement } from "@/data/paiements";

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

const Paiements = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { paiements, ajouterPaiement, modifierPaiement, supprimerPaiement } = usePaiementStore();
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anneeScolaire, setAnneeScolaire] = useState("2023-2024");
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const { enfants } = useEnfantStore();
  const { toast } = useToast();

  const filteredEnfants = enfants.filter(enfant => 
    enfant.anneeScolaire === anneeScolaire &&
    `${enfant.prenom} ${enfant.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaiements = paiements.filter(paiement => {
    const enfant = enfants.find(e => e.id === paiement.enfantId);
    return enfant && enfant.anneeScolaire === anneeScolaire;
  });

  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'F2' && isSheetOpen) {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder="Rechercher un enfant..."]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        setIsSearchFocused(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isSheetOpen]);

  const handleAddClick = () => {
    setSelectedPaiement(null);
    setIsSheetOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nouveauPaiement: Omit<Paiement, "id"> = {
      enfantId: Number(formData.get("enfantId")),
      montant: Number(formData.get("montant")),
      datePaiement: (formData.get("datePaiement") as string) || new Date().toISOString().split('T')[0],
      moisConcerne: formData.get("moisConcerne") as string,
      methodePaiement: formData.get("methodePaiement") as "carte" | "especes" | "cheque",
      statut: formData.get("statut") as "complete" | "en_attente",
    };

    if (selectedPaiement) {
      modifierPaiement({ ...nouveauPaiement, id: selectedPaiement.id });
      toast({
        title: "Modification réussie",
        description: "Le paiement a été mis à jour.",
      });
    } else {
      ajouterPaiement(nouveauPaiement);
      toast({
        title: "Paiement enregistré",
        description: "Le nouveau paiement a été ajouté avec succès.",
      });
    }

    setIsSheetOpen(false);
  };

  const handleDelete = () => {
    if (deletePassword === "radia" && paiementToDelete) {
      supprimerPaiement(paiementToDelete.id);
      toast({
        title: "Suppression réussie",
        description: "Le paiement a été supprimé avec succès.",
      });
      setDeletePassword("");
      setIsPasswordError(false);
      setPaiementToDelete(null);
    } else {
      setIsPasswordError(true);
      toast({
        title: "Erreur de suppression",
        description: "Le mot de passe est incorrect.",
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
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Gestion des Paiements</h1>
                <Select
                  value={anneeScolaire}
                  onValueChange={setAnneeScolaire}
                >
                  <SelectTrigger className="w-[180px] bg-[#F6F6F7] text-gray-700 border-gray-200">
                    <SelectValue placeholder="Année scolaire" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F6F6F7] border-gray-200">
                    {anneesDisponibles.map((annee) => (
                      <SelectItem key={annee} value={annee} className="hover:bg-gray-200">
                        {annee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un paiement
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enfant</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date de paiement</TableHead>
                    <TableHead>Mois concerné</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaiements.map((paiement) => {
                    const enfant = enfants.find(e => e.id === paiement.enfantId);
                    return (
                      <TableRow key={paiement.id}>
                        <TableCell>
                          {enfant ? `${enfant.prenom} ${enfant.nom}` : "Inconnu"}
                        </TableCell>
                        <TableCell>{paiement.montant} DH</TableCell>
                        <TableCell>
                          {new Date(paiement.datePaiement).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          {new Date(paiement.moisConcerne).toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center">
                            {paiement.methodePaiement === "carte" && <CreditCard className="w-4 h-4 mr-1" />}
                            {paiement.methodePaiement === "especes" && <Receipt className="w-4 h-4 mr-1" />}
                            {paiement.methodePaiement === "cheque" && <Receipt className="w-4 h-4 mr-1" />}
                            {paiement.methodePaiement.charAt(0).toUpperCase() + paiement.methodePaiement.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              paiement.statut === "complete"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {paiement.statut === "complete" ? (
                              <>
                                <BadgeCheck className="w-4 h-4 mr-1" />
                                Complété
                              </>
                            ) : (
                              "En attente"
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPaiement(paiement);
                              setIsSheetOpen(true);
                            }}
                          >
                            Modifier
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setPaiementToDelete(paiement)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce paiement ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le paiement sera définitivement supprimé.
                                  <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2">
                                      Veuillez entrer le mot de passe pour confirmer la suppression
                                    </label>
                                    <Input
                                      type="password"
                                      value={deletePassword}
                                      onChange={(e) => {
                                        setDeletePassword(e.target.value);
                                        setIsPasswordError(false);
                                      }}
                                      className={isPasswordError ? "border-destructive" : ""}
                                      placeholder="Entrez le mot de passe"
                                    />
                                    {isPasswordError && (
                                      <p className="text-sm text-destructive mt-1">
                                        Mot de passe incorrect
                                      </p>
                                    )}
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => {
                                  setDeletePassword("");
                                  setIsPasswordError(false);
                                  setPaiementToDelete(null);
                                }}>
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>
                {selectedPaiement ? "Modifier le paiement" : "Nouveau paiement"}
              </SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Enfant
                  <span className="text-xs text-muted-foreground inline-flex items-center">
                    <Keyboard className="w-4 h-4 mr-1" />
                    Appuyez sur F2 pour rechercher
                  </span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un enfant..."
                    className="w-full"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                  />
                  {(searchTerm || isSearchFocused) && (
                    <div className="absolute w-full bg-white border rounded-md mt-1 shadow-lg max-h-48 overflow-auto z-50">
                      {filteredEnfants.length > 0 ? (
                        filteredEnfants.map((enfant) => (
                          <div
                            key={enfant.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSearchTerm(`${enfant.prenom} ${enfant.nom}`);
                              const hiddenInput = document.createElement('input');
                              hiddenInput.type = 'hidden';
                              hiddenInput.name = 'enfantId';
                              hiddenInput.value = enfant.id.toString();
                              const form = document.querySelector('form');
                              if (form) {
                                const oldInput = form.querySelector('input[name="enfantId"]');
                                if (oldInput) {
                                  oldInput.remove();
                                }
                                form.appendChild(hiddenInput);
                              }
                            }}
                          >
                            {enfant.prenom} {enfant.nom} - {enfant.classe}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">Aucun résultat</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="montant" className="text-sm font-medium">
                  Montant (DH)
                </label>
                <Input
                  id="montant"
                  name="montant"
                  type="number"
                  defaultValue={selectedPaiement?.montant || 150}
                  min={0}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="moisConcerne" className="text-sm font-medium">
                  Mois concerné
                </label>
                <Input
                  id="moisConcerne"
                  name="moisConcerne"
                  type="month"
                  defaultValue={selectedPaiement?.moisConcerne || new Date().toISOString().slice(0, 7)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="methodePaiement" className="text-sm font-medium">
                  Méthode de paiement
                </label>
                <select
                  id="methodePaiement"
                  name="methodePaiement"
                  defaultValue={selectedPaiement?.methodePaiement}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="carte">Carte</option>
                  <option value="especes">Espèces</option>
                  <option value="cheque">Chèque</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="statut" className="text-sm font-medium">
                  Statut
                </label>
                <select
                  id="statut"
                  name="statut"
                  defaultValue={selectedPaiement?.statut}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="complete">Complété</option>
                  <option value="en_attente">En attente</option>
                </select>
              </div>

              <div className="pt-4 space-x-2 flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
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

export default Paiements;
