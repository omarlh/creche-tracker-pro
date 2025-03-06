
import { useState, useEffect } from "react";
import { useEnfantStore } from "@/data/enfants";
import { usePaiementStore } from "@/data/paiements";
import { supabase } from "@/integrations/supabase/client";
import {
  getMoisAnneeScolaire,
  getSchoolYearDateRange,
  isDateInSchoolYear
} from "@/lib/dateUtils";

export interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

export function useDashboardData(anneeScolaire: string) {
  const { enfants, fetchEnfants } = useEnfantStore();
  const { paiements, fetchPaiements } = usePaiementStore();
  const [totalFraisInscription, setTotalFraisInscription] = useState(0);
  const [paiementsMensuels, setPaiementsMensuels] = useState<PaiementMensuel[]>([]);
  const [fraisInscriptionParMois, setFraisInscriptionParMois] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchEnfants(), fetchPaiements()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchEnfants, fetchPaiements]);

  // Calculate frais d'inscription based on anneeScolaire
  useEffect(() => {
    const getFraisInscription = async () => {
      setTotalFraisInscription(0);
      setFraisInscriptionParMois({});

      const enfantIds = enfants
        .filter(e => e.anneeScolaire === anneeScolaire)
        .map(e => e.id);

      if (enfantIds.length === 0) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('paiements_inscription')
          .select('montant, date_paiement')
          .in('enfant_id', enfantIds);

        if (error) {
          console.error('Erreur lors de la récupération des frais d\'inscription:', error);
          return;
        }

        const { start, end } = getSchoolYearDateRange(anneeScolaire);
        const filteredData = data.filter(p => {
          const paymentDate = new Date(p.date_paiement);
          return paymentDate >= start && paymentDate <= end;
        });

        const total = filteredData.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
        setTotalFraisInscription(total);

        const parMois: Record<string, number> = {};
        
        filteredData.forEach(p => {
          const date = new Date(p.date_paiement);
          const moisScolaires = getMoisAnneeScolaire();
          let moisIndex;
          
          if (date.getMonth() >= 8) { // Septembre à Décembre
            moisIndex = date.getMonth() - 8;
          } else { // Janvier à Juin
            moisIndex = date.getMonth() + 4;
          }
          
          if (moisIndex >= 0 && moisIndex < moisScolaires.length) {
            const moisNom = moisScolaires[moisIndex];
            parMois[moisNom] = (parMois[moisNom] || 0) + (Number(p.montant) || 0);
          }
        });
        
        setFraisInscriptionParMois(parMois);
      } catch (error) {
        console.error("Error processing frais d'inscription:", error);
      }
    };

    if (enfants && enfants.length > 0) {
      getFraisInscription();
    }
  }, [anneeScolaire, enfants]);

  // Calculate paiements mensuels
  useEffect(() => {
    const calculerPaiementsMensuels = () => {
      try {
        const moisScolaires = getMoisAnneeScolaire();
        
        const paiementsAnnee = paiements.filter(p => {
          if (p.anneeScolaire === anneeScolaire) {
            return true;
          }
          const datePaiement = new Date(p.datePaiement);
          return isDateInSchoolYear(datePaiement, anneeScolaire);
        });
        
        const donneesParMois = moisScolaires.map((mois, index) => {
          const [anneeDebut, anneeFin] = anneeScolaire.split('-').map(y => parseInt(y));
          const moisNum = index <= 3 ? index + 8 : index - 4;
          const annee = index <= 3 ? anneeDebut : anneeFin;
          
          const dateDebut = new Date(annee, moisNum, 1);
          const dateFin = new Date(annee, moisNum + 1, 0);
          
          const paiementsMois = paiementsAnnee.filter(p => {
            const datePaiement = new Date(p.datePaiement);
            return datePaiement >= dateDebut && datePaiement <= dateFin;
          });
          
          const totalMois = paiementsMois.reduce((sum, p) => sum + Number(p.montant), 0);
          const fraisInscription = fraisInscriptionParMois[mois] || 0;
          
          return {
            mois,
            total: totalMois,
            fraisInscription,
            nbPaiements: paiementsMois.length
          };
        });
        
        setPaiementsMensuels(donneesParMois);
      } catch (error) {
        console.error("Error calculating paiements mensuels:", error);
        setPaiementsMensuels([]);
      }
    };
    
    if (paiements && paiements.length > 0) {
      calculerPaiementsMensuels();
    } else {
      setPaiementsMensuels([]);
    }
  }, [paiements, anneeScolaire, fraisInscriptionParMois]);

  // Calculate derived data
  const enfantsFiltres = enfants.filter(e => e.anneeScolaire === anneeScolaire);
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length;
  const totalMensualites = paiementsMensuels.reduce((sum, m) => sum + m.total, 0);
  const totalPaiements = totalMensualites + totalFraisInscription;
  const moyennePaiements = enfantsActifs ? (totalPaiements / enfantsActifs).toFixed(2) : "0";

  const reloadData = async () => {
    setIsLoading(true);
    try {
      // Reset states to avoid stale data
      setPaiementsMensuels([]);
      setTotalFraisInscription(0);
      setFraisInscriptionParMois({});
      
      // Fetch fresh data
      await Promise.all([fetchEnfants(), fetchPaiements()]);
    } catch (error) {
      console.error("Error reloading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    enfantsFiltres,
    enfantsActifs,
    totalMensualites,
    totalFraisInscription,
    totalPaiements,
    moyennePaiements,
    paiementsMensuels,
    reloadData
  };
}
