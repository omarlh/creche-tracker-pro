import { useState, useMemo, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useEnfantStore } from "@/data/enfants";
import { RetardsHeader } from "@/components/retards/RetardsHeader";
import { RetardsStats } from "@/components/retards/RetardsStats";
import { RetardsTable, RetardPaiement } from "@/components/retards/RetardsTable";
import { addMonths, startOfMonth, isBefore, format } from "date-fns";

const Retards = () => {
  const [retards, setRetards] = useState<RetardPaiement[]>([]);
  const [selectedAnnee, setSelectedAnnee] = useState<string>("2023-2024");
  const { toast } = useToast();
  const { enfants } = useEnfantStore();

  const getAnneeScolaire = (date: string) => {
    const dateObj = new Date(date);
    const mois = dateObj.getMonth();
    const annee = dateObj.getFullYear();
    
    if (mois >= 8) {
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
            <RetardsHeader
              selectedAnnee={selectedAnnee}
              setSelectedAnnee={setSelectedAnnee}
              handlePrint={handlePrint}
            />
            <RetardsStats
              totalRetards={retardsFiltres.length}
              montantTotal={getTotalRetards()}
              moyenneJours={getMoyenneJoursRetard()}
            />
            <RetardsTable
              retards={retardsFiltres}
              onEnvoyerRappel={envoyerRappel}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Retards;
