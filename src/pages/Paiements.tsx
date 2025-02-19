import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Search, X, FileText, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { usePaiementStore, type Paiement } from "@/data/paiements";
import { PaiementTableau } from "@/components/paiements/PaiementTableau";
import { PaiementFormulaire } from "@/components/paiements/PaiementFormulaire";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEnfantStore } from "@/data/enfants";
import { Checkbox } from "@/components/ui/checkbox";

const getCurrentSchoolYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // Janvier est 0, Décembre est 11

  // L'année scolaire commence en septembre
  if (month >= 8) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

const getMoisAnneeScolaire = (anneeScolaire: string) => {
  const [anneeDebut, anneeFin] = anneeScolaire.split('-').map(Number);
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return mois;
};

const Paiements = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [anneeScolaire, setAnneeScolaire] = useState(getCurrentSchoolYear());
  const [deletePassword, setDeletePassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [moisDisponibles, setMoisDisponibles] = useState(getMoisAnneeScolaire(anneeScolaire));
  const [selectedEnfantId, setSelectedEnfantId] = useState<number | null>(null);
  const [defaultMontant, setDefaultMontant] = useState<number>(800); // Modification ici : 800 au lieu de 300

  const enfants = useEnfantStore((state) => state.enfants);
  const fetchEnfants = useEnfantStore((state) => state.fetchEnfants);
  const paiements = usePaiementStore((state) => state.paiements);
  const ajouterPaiement = usePaiementStore((state) => state.ajouterPaiement);
  const modifierPaiement = usePaiementStore((state) => state.modifierPaiement);
  const supprimerPaiement = usePaiementStore((state) => state.supprimerPaiement);
  const fetchPaiements = usePaiementStore((state) => state.fetchPaiements);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaiements();
    fetchEnfants();
  }, [fetchPaiements, fetchEnfants]);

  const handleAddClick = () => {
    setSelectedPaiement(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setIsSheetOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredPaiements = paiements.filter(paiement => {
    const enfant = enfants.find(e => e.id === paiement.enfantId);
    const nomComplet = enfant ? `${enfant.prenom} ${enfant.nom}`.toLowerCase() : '';

    return nomComplet.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = (data: any) => {
    const { enfantId, anneeScolaire, mois, montant, datePaiement, methodePaiement, commentaire } = data;

    const nouveauPaiement = {
      enfantId: parseInt(enfantId),
      anneeScolaire,
      mois,
      montant: parseFloat(montant),
      datePaiement,
      methodePaiement,
      commentaire,
    };

    if (selectedPaiement) {
      const paiementModifie = {
        ...nouveauPaiement,
        id: selectedPaiement.id,
      };
      modifierPaiement(paiementModifie);
      toast({
        title: "Modification réussie",
        description: `Le paiement a été mis à jour.`,
      });
    } else {
      ajouterPaiement(nouveauPaiement);
      toast({
        title: "Ajout réussi",
        description: `Le paiement a été ajouté à la liste.`,
      });
    }

    setIsSheetOpen(false);
  };

  const confirmDeletePaiement = (paiement: Paiement) => {
    setPaiementToDelete(paiement);
  };

  const cancelDeletePaiement = () => {
    setPaiementToDelete(null);
    setDeletePassword("");
    setIsPasswordError(false);
  };

  const handleDeletePaiement = async () => {
    if (deletePassword === "delete") {
      if (paiementToDelete) {
        await supprimerPaiement(paiementToDelete.id);
        toast({
          title: "Suppression réussie",
          description: "Le paiement a été supprimé avec succès.",
        });
      }
      cancelDeletePaiement();
    } else {
      setIsPasswordError(true);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">Gestion des Paiements de Scolarité</h1>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher un paiement par nom de l'enfant..."
                  className="pl-10 pr-10"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchTerm && isSearchFocused && (
                  <Button
                    onClick={() => handleSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleAddClick}>
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un paiement
              </Button>
            </div>

            <PaiementTableau
              paiements={filteredPaiements}
              enfants={enfants}
              onEdit={handleEditClick}
              confirmDeletePaiement={confirmDeletePaiement}
            />
          </div>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {selectedPaiement ? "Modifier un paiement" : "Ajouter un paiement"}
              </SheetTitle>
            </SheetHeader>
            <PaiementFormulaire
              selectedPaiement={selectedPaiement}
              onSubmit={handleSubmit}
              onCancel={() => setIsSheetOpen(false)}
              anneeScolaire={anneeScolaire}
              moisDisponibles={moisDisponibles}
              defaultMontant={defaultMontant}
              enfants={enfants}
            />
          </SheetContent>
        </Sheet>

        <AlertDialog open={paiementToDelete !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
                Veuillez entrer "delete" pour confirmer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="deletePassword">Tapez <span className="font-bold">delete</span> pour confirmer</Label>
              <Input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="delete"
              />
              {isPasswordError && (
                <p className="text-red-500 text-sm">Mot de passe incorrect.</p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeletePaiement}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePaiement}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
};

export default Paiements;
