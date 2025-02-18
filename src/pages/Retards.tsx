
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
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AlertTriangle, Printer, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore } from "@/data/enfants";

type RetardPaiement = {
  id: number;
  enfantId: number;
  enfantNom: string;
  enfantPrenom: string;
  moisConcerne: string;
  montantDu: number;
  joursRetard: number;
  dernierRappel: string | null;
};

const retardsTest: RetardPaiement[] = [
  {
    id: 1,
    enfantId: 1,
    enfantNom: "Dubois",
    enfantPrenom: "Sophie",
    moisConcerne: "2024-02",
    montantDu: 150,
    joursRetard: 15,
    dernierRappel: "2024-02-15",
  },
  {
    id: 2,
    enfantId: 2,
    enfantNom: "Martin",
    enfantPrenom: "Lucas",
    moisConcerne: "2024-02",
    montantDu: 150,
    joursRetard: 10,
    dernierRappel: null,
  },
  {
    id: 3,
    enfantId: 3,
    enfantNom: "Bernard",
    enfantPrenom: "Emma",
    moisConcerne: "2024-01",
    montantDu: 150,
    joursRetard: 30,
    dernierRappel: "2024-02-01",
  },
];

const Retards = () => {
  const [retards, setRetards] = useState<RetardPaiement[]>(retardsTest);
  const { toast } = useToast();
  const { enfants } = useEnfantStore();

  const getReliquatInscription = (enfantId: number) => {
    const enfant = enfants.find(e => e.id === enfantId);
    if (!enfant?.fraisInscription) return 0;
    return enfant.fraisInscription.montantTotal - enfant.fraisInscription.montantPaye;
  };

  const envoyerRappel = (retardId: number) => {
    const maintenant = new Date().toISOString().split('T')[0];
    setRetards(retards.map(retard => 
      retard.id === retardId 
        ? { ...retard, dernierRappel: maintenant }
        : retard
    ));
    
    toast({
      title: "Rappel envoyé",
      description: "Le rappel de paiement a été envoyé avec succès.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold">Gestion des Retards de Paiement</h1>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="print:hidden"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total des retards
                </h3>
                <p className="text-2xl font-semibold">{retards.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Montant total dû
                </h3>
                <p className="text-2xl font-semibold">
                  {retards.reduce((sum, r) => sum + r.montantDu, 0)} DH
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Retard moyen
                </h3>
                <p className="text-2xl font-semibold">
                  {Math.round(
                    retards.reduce((sum, r) => sum + r.joursRetard, 0) / retards.length
                  )} jours
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enfant</TableHead>
                    <TableHead>Mois concerné</TableHead>
                    <TableHead>Montant dû</TableHead>
                    <TableHead>Reliquat inscription</TableHead>
                    <TableHead>Jours de retard</TableHead>
                    <TableHead>Dernier rappel</TableHead>
                    <TableHead className="text-right print:hidden">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retards.map((retard) => (
                    <TableRow key={retard.id}>
                      <TableCell>
                        {retard.enfantPrenom} {retard.enfantNom}
                      </TableCell>
                      <TableCell>
                        {new Date(retard.moisConcerne).toLocaleDateString("fr-FR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{retard.montantDu} DH</TableCell>
                      <TableCell>
                        <span className={getReliquatInscription(retard.enfantId) > 0 ? "text-destructive font-medium" : ""}>
                          {getReliquatInscription(retard.enfantId)} DH
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          retard.joursRetard > 20
                            ? "bg-destructive/10 text-destructive"
                            : retard.joursRetard > 10
                            ? "bg-warning/10 text-warning"
                            : "bg-muted/10 text-muted-foreground"
                        }`}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {retard.joursRetard} jours
                        </span>
                      </TableCell>
                      <TableCell>
                        {retard.dernierRappel ? (
                          new Date(retard.dernierRappel).toLocaleDateString("fr-FR")
                        ) : (
                          <span className="text-muted-foreground">Aucun rappel</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right print:hidden">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => envoyerRappel(retard.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer rappel
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

export default Retards;
