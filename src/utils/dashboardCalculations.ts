import { PaiementMensuel } from "@/types/dashboard.types";
import { getMoisAnneeScolaire, isDateInSchoolYear } from "@/lib/dateUtils";

// Calculate frais d'inscription par mois
export const getFraisInscriptionParMois = (
  data: Array<{ montant: number; date_paiement: string }>,
  anneeScolaire: string
): Record<string, number> => {
  const moisScolaires = getMoisAnneeScolaire();
  const parMois: Record<string, number> = {};
  
  data.forEach(p => {
    const date = new Date(p.date_paiement);
    let moisIndex;
    
    if (date.getMonth() >= 8) { // Septembre à Décembre
      moisIndex = date.getMonth() - 8;
    } else if (date.getMonth() <= 5) { // Janvier à Juin
      moisIndex = date.getMonth() + 4;
    } else {
      return; // Ignore July and August
    }
    
    if (moisIndex >= 0 && moisIndex < moisScolaires.length) {
      const moisNom = moisScolaires[moisIndex];
      parMois[moisNom] = (parMois[moisNom] || 0) + (Number(p.montant) || 0);
    }
  });
  
  return parMois;
};

// Calculate monthly payment data
export const calculerPaiementsMensuels = (
  paiements: any[],
  anneeScolaire: string,
  fraisInscriptionParMois: Record<string, number>
): PaiementMensuel[] => {
  const moisScolaires = getMoisAnneeScolaire();
  
  const paiementsAnnee = paiements.filter(p => {
    // Filter by explicit année scolaire if available
    if (p.anneeScolaire === anneeScolaire) {
      return true;
    }
    // Otherwise check if the date falls within the school year
    const datePaiement = new Date(p.datePaiement);
    return isDateInSchoolYear(datePaiement, anneeScolaire);
  });
  
  return moisScolaires.map((mois, index) => {
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
};

// Calculate derived statistics
export const calculateDashboardStats = (
  enfantsFiltres: any[], 
  paiementsMensuels: PaiementMensuel[],
  totalFraisInscription: number
) => {
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length;
  const totalMensualites = paiementsMensuels.reduce((sum, m) => sum + m.total, 0) || 0;
  const totalPaiements = totalMensualites + totalFraisInscription;
  const moyennePaiements = enfantsActifs ? (totalPaiements / enfantsActifs).toFixed(2) : "0";

  return {
    enfantsActifs,
    totalMensualites,
    totalPaiements,
    moyennePaiements
  };
};
