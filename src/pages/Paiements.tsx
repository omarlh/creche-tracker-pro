import { useState } from "react";
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
import { BadgeCheck, CreditCard, Plus, Receipt } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";

type Paiement = {
  id: number;
  enfantId: number;
  montant: number;
  datePaiement: string;
  moisConcerne: string;
  methodePaiement: "carte" | "especes" | "cheque";
  statut: "complete" | "en_attente";
};

type Enfant = {
  id: number;
  nom: string;
  prenom: string;
};

// Données de test mises à jour pour inclure le nouvel enfant
const enfantsTest: Enfant[] = [
  { id: 1, nom: "Dubois", prenom: "Sophie" },
  { id: 2, nom: "Martin", prenom: "Lucas" },
  { id: 3, nom: "Bernard", prenom: "Emma" },
  { id: 4, nom: "Petit", prenom: "Noah" },
  { id: 5, nom: "Robert", prenom: "Léa" },
  { id: 6, nom: "Moreau", prenom: "Louis" },
  { id: 7, nom: "BENNANI", prenom: "Youssef" },
];

const paiementsInitiaux: Paiement[] = [
  {
    id: 1,
    enfantId: 1,
    montant: 150,
    datePaiement: "2024-02-15",
    moisConcerne: "2024-02",
    methodePaiement: "carte",
    statut: "complete",
  },
  {
    id: 2,
    enfantId: 2,
    montant: 150,
    datePaiement: "2024-02-10",
    moisConcerne: "2024-02",
    methodePaiement: "cheque",
    statut: "complete",
  },
  {
    id: 3,
    enfantId: 3,
    montant: 150,
    datePaiement: "2024-02-01",
    moisConcerne: "2024-02",
    methodePaiement: "especes",
    statut: "en_attente",
  },
];

const Paiements = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paiements, setPaiements] = useState<Paiement[]>(paiementsInitiaux);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const { toast } = useToast();

  const handleAddClick = () => {
    setSelectedPaiement(null);
    setIsSheetOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const nouveauPaiement: Paiement = {
      id: selectedPaiement?.id || paiements.length + 1,
      enfantId: Number(formData.get("enfantId")),
      montant: Number(formData.get("montant")),
      datePaiement: (formData.get("datePaiement") as string) || new Date().toISOString().split('T')[0],
      moisConcerne: formData.get("moisConcerne") as string,
      methodePaiement: formData.get("methodePaiement") as "carte" | "especes" | "cheque",
      statut: formData.get("statut") as "complete" | "en_attente",
    };

    if (selectedPaiement) {
      setPaiements(paiements.map(p => p.id === selectedPaiement.id ? nouveauPaiement : p));
      toast({
        title: "Modification réussie",
        description: "Le paiement a été mis à jour.",
      });
    } else {
      setPaiements([...paiements, nouveauPaiement]);
      toast({
        title: "Paiement enregistré",
        description: "Le nouveau paiement a été ajouté avec succès.",
      });
    }

    setIsSheetOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Gestion des Paiements</h1>
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
                  {paiements.map((paiement) => {
                    const enfant = enfantsTest.find(e => e.id === paiement.enfantId);
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
                        <TableCell className="text-right">
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
                <label htmlFor="enfantId" className="text-sm font-medium">
                  Enfant
                </label>
                <select
                  id="enfantId"
                  name="enfantId"
                  defaultValue={selectedPaiement?.enfantId}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  {enfantsTest.map((enfant) => (
                    <option key={enfant.id} value={enfant.id}>
                      {enfant.prenom} {enfant.nom}
                    </option>
                  ))}
                </select>
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
