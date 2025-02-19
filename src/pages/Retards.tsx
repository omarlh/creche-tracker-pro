
import { useState, useMemo, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addMonths, differenceInMonths, startOfMonth, isBefore } from "date-fns";
import { fr } from "date-fns/locale";

type RetardPaiement = {
  id: number;
  enfantId: number;
  enfantNom: string;
  enfantPrenom: string;
  moisConcerne: string;
  montantDu: number;
  joursRetard: number;
  dernierRappel: string | null;
  type: 'inscription' | 'mensuel';
};

const anneesDisponibles = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
  "2027-2028",
];

const Retards = () => {
  const [retards, setRetards] = useState<RetardPaiement[]>([]);
  const [selectedAnnee, setSelectedAnnee] = useState<string>("2023-2024");
  const { toast } = useToast();
  const { enfants } = useEnfantStore();

  const getAnneeScolaire = (date: string) => {
    const dateObj = new Date(date);
    const mois = dateObj.getMonth();
    const annee = dateObj.getFullYear();
    
    if (mois >= 8) { // À partir de septembre
      return `${annee}-${annee + 1}`;
    } else {
      return `${annee - 1}-${annee}`;
    }
  };

  useEffect(() => {
    const genererRetards = () => {
      const retardsGeneres: RetardPaiement[] = [];
      const maintenant = new Date();
      
      enfants.forEach(enfant => {
        if (enfant.statut === "actif" && enfant.dateInscription) {
          // Gestion des retards de frais d'inscription
          const montantInscriptionDu = enfant.fraisInscription?.montantTotal || 0;
          const montantInscriptionPaye = enfant.fraisInscription?.montantPaye || 0;
          
          if (montantInscriptionDu > montantInscriptionPaye) {
            const dateInscription = new Date(enfant.dateInscription);
            const joursRetardInscription = Math.floor((maintenant.getTime() - dateInscription.getTime()) / (1000 * 3600 * 24));
            
            retardsGeneres.push({
              id: Math.random(),
              enfantId: enfant.id,
              enfantNom: enfant.nom,
              enfantPrenom: enfant.prenom,
              moisConcerne: enfant.dateInscription,
              montantDu: montantInscriptionDu - montantInscriptionPaye,
              joursRetard: joursRetardInscription,
              dernierRappel: null,
              type: 'inscription'
            });
          }

          // Gestion des retards mensuels
          const dateInscription = new Date(enfant.dateInscription);
          const dernierPaiement = enfant.dernierPaiement ? new Date(enfant.dernierPaiement) : null;
          const fraisMensuels = enfant.fraisScolariteMensuel || 0;
          
          let moisCourant = startOfMonth(dateInscription);
          
          while (isBefore(moisCourant, maintenant)) {
            const moisFormate = format(moisCourant, 'yyyy-MM');
            const anneeScolaire = getAnneeScolaire(moisFormate);
            
            if (anneeScolaire === selectedAnnee) {
              const joursRetard = Math.floor((maintenant.getTime() - moisCourant.getTime()) / (1000 * 3600 * 24));
              
              // Si pas de dernier paiement ou si le dernier paiement est avant le mois courant
              if (!dernierPaiement || isBefore(dernierPaiement, moisCourant)) {
                retardsGeneres.push({
                  id: Math.random(),
                  enfantId: enfant.id,
                  enfantNom: enfant.nom,
                  enfantPrenom: enfant.prenom,
                  moisConcerne: moisFormate,
                  montantDu: fraisMensuels,
                  joursRetard,
                  dernierRappel: null,
                  type: 'mensuel'
                });
              }
            }
            
            moisCourant = addMonths(moisCourant, 1);
          }
        }
      });

      setRetards(retardsGeneres);
    };

    genererRetards();
  }, [selectedAnnee, enfants]);

  const retardsFiltres = useMemo(() => {
    return retards.filter(retard => {
      const anneeScolaire = getAnneeScolaire(retard.moisConcerne);
      return anneeScolaire === selectedAnnee;
    });
  }, [retards, selectedAnnee]);

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

  const getTotalRetards = () => {
    return retardsFiltres.reduce((sum, r) => sum + r.montantDu, 0);
  };

  const getMoyenneJoursRetard = () => {
    const total = retardsFiltres.reduce((sum, r) => sum + r.joursRetard, 0);
    return retardsFiltres.length > 0 ? Math.round(total / retardsFiltres.length) : 0;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full animate-fadeIn">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold">Gestion des Retards de Paiement</h1>
                <div className="w-[200px]">
                  <Select
                    value={selectedAnnee}
                    onValueChange={setSelectedAnnee}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Sélectionner une année" />
                    </SelectTrigger>
                    <SelectContent>
                      {anneesDisponibles.map((annee) => (
                        <SelectItem key={annee} value={annee}>
                          Année {annee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                <p className="text-2xl font-semibold">{retardsFiltres.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Montant total dû
                </h3>
                <p className="text-2xl font-semibold">
                  {getTotalRetards()} DH
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Retard moyen
                </h3>
                <p className="text-2xl font-semibold">
                  {getMoyenneJoursRetard()} jours
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enfant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Mois concerné</TableHead>
                    <TableHead>Montant dû</TableHead>
                    <TableHead>Jours de retard</TableHead>
                    <TableHead>Dernier rappel</TableHead>
                    <TableHead className="text-right print:hidden">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retardsFiltres.map((retard) => (
                    <TableRow key={retard.id}>
                      <TableCell>
                        {retard.enfantPrenom} {retard.enfantNom}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          retard.type === 'inscription'
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {retard.type === 'inscription' ? 'Inscription' : 'Mensuel'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(retard.moisConcerne), 'MMMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>{retard.montantDu} DH</TableCell>
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
