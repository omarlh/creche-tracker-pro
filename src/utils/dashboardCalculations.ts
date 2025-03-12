
import { PaiementMensuel } from "@/types/dashboard.types";
import { getMoisAnneeScolaire, isDateInSchoolYear } from "@/lib/dateUtils";

// Calculate frais d'inscription par mois
export const getFraisInscriptionParMois = (
  data: Array<{ montant: number; date_paiement: string }>,
  anneeScolaire: string
): Record<string, number> => {
  const moisScolaires = getMoisAnneeScolaire();
  const parMois: Record<string, number> = {};
  
  // Initialize with zero values
  moisScolaires.forEach(mois => {
    parMois[mois] = 0;
  });
  
  // For each payment, add the amount to the corresponding month
  data.forEach(p => {
    if (!p.date_paiement) return;
    
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
      const montant = typeof p.montant === 'number' ? p.montant : Number(p.montant) || 0;
      parMois[moisNom] = (parMois[moisNom] || 0) + montant;
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
  
  // Initialize results with all months
  const resultats: Record<string, PaiementMensuel> = {};
  moisScolaires.forEach(mois => {
    resultats[mois] = {
      mois,
      total: 0,
      fraisInscription: fraisInscriptionParMois[mois] || 0,
      nbPaiements: 0
    };
  });
  
  // Filter paiements by school year
  const paiementsAnnee = paiements.filter(p => {
    // Filter by explicit année scolaire if available
    if (p.anneeScolaire === anneeScolaire) {
      return true;
    }
    
    // Otherwise check if the date falls within the school year
    const datePaiement = new Date(p.datePaiement || p.date_paiement);
    return isDateInSchoolYear(datePaiement, anneeScolaire);
  });
  
  // Process each month
  moisScolaires.forEach((mois, index) => {
    const [anneeDebut, anneeFin] = anneeScolaire.split('-').map(y => parseInt(y));
    const moisNum = index <= 3 ? index + 8 : index - 4;
    const annee = index <= 3 ? anneeDebut : anneeFin;
    
    const dateDebut = new Date(annee, moisNum, 1);
    const dateFin = new Date(annee, moisNum + 1, 0);
    
    // Find payments for this month
    const paiementsMois = paiementsAnnee.filter(p => {
      const datePaiement = new Date(p.datePaiement || p.date_paiement);
      return datePaiement >= dateDebut && datePaiement <= dateFin;
    });
    
    if (paiementsMois.length > 0) {
      const totalMois = paiementsMois.reduce((sum, p) => {
        const montant = typeof p.montant === 'number' ? p.montant : Number(p.montant) || 0;
        return sum + montant;
      }, 0);
      
      resultats[mois] = {
        mois,
        total: totalMois,
        fraisInscription: fraisInscriptionParMois[mois] || 0,
        nbPaiements: paiementsMois.length
      };
    }
  });
  
  // Convert to array and return
  return moisScolaires.map(mois => resultats[mois]);
};

// Calculate derived statistics
export const calculateDashboardStats = (
  enfantsFiltres: any[], 
  paiementsMensuels: PaiementMensuel[],
  totalFraisInscription: number
) => {
  // Count active enfants
  const enfantsActifs = enfantsFiltres.filter(e => e.statut === "actif").length;
  
  // Calculate total mensualites
  const totalMensualites = paiementsMensuels.reduce((sum, m) => {
    // Remove fraisInscription from the total as they're counted separately
    const montantMensuel = typeof m.total === 'number' ? m.total : Number(m.total) || 0;
    return sum + montantMensuel;
  }, 0);
  
  // Ensure totalFraisInscription is a number
  const safeTotalFraisInscription = typeof totalFraisInscription === 'number' 
    ? totalFraisInscription 
    : Number(totalFraisInscription) || 0;
  
  // Calculate total payments
  const totalPaiements = totalMensualites + safeTotalFraisInscription;
  
  // Calculate average payment per active enfant
  const moyennePaiements = enfantsActifs > 0 
    ? (totalPaiements / enfantsActifs).toFixed(2) 
    : "0";

  return {
    enfantsActifs,
    totalMensualites,
    totalPaiements,
    moyennePaiements
  };
};
