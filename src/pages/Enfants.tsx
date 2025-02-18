
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeCheck, Plus, UserX } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Types pour la gestion des enfants
type Enfant = {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  fraisInscription: boolean;
  statut: "actif" | "inactif";
  dernierPaiement: string;
};

// Données de test
const enfants: Enfant[] = [
  {
    id: 1,
    nom: "Dubois",
    prenom: "Sophie",
    dateNaissance: "2020-03-15",
    fraisInscription: true,
    statut: "actif",
    dernierPaiement: "2024-02-15",
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Lucas",
    dateNaissance: "2021-05-20",
    fraisInscription: true,
    statut: "actif",
    dernierPaiement: "2024-02-10",
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Emma",
    dateNaissance: "2020-11-08",
    fraisInscription: false,
    statut: "inactif",
    dernierPaiement: "2024-01-15",
  },
];

const Enfants = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Gestion des Enfants</h1>
              <Button>
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
                        {new Date(enfant.dateNaissance).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        {enfant.fraisInscription ? (
                          <span className="inline-flex items-center text-success">
                            <BadgeCheck className="w-4 h-4 mr-1" />
                            Payés
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-destructive">
                            <UserX className="w-4 h-4 mr-1" />
                            Non payés
                          </span>
                        )}
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
                        {new Date(enfant.dernierPaiement).toLocaleDateString(
                          "fr-FR"
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">
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
      </div>
    </SidebarProvider>
  );
};

export default Enfants;
