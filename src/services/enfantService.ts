
import { supabase } from "@/integrations/supabase/client";
import type { Enfant, EnfantRow } from "@/types/enfant.types";

export const fetchEnfantsFromDB = async (): Promise<Enfant[]> => {
  try {
    console.log("Fetching enfants from database...");
    
    // Remove created_at from the query since it doesn't exist in the table
    const { data: enfantsData, error: enfantsError } = await supabase
      .from('enfants')
      .select(`
        *
      `)
      .order('nom', { ascending: true });

    if (enfantsError) {
      console.error("Supabase error fetching enfants:", enfantsError);
      throw new Error(`Erreur de base de données: ${enfantsError.message}`);
    }

    // Fetch payments for inscription for each enfant
    const { data: paiementsInscription, error: paiementsError } = await supabase
      .from('paiements_inscription')
      .select('*');

    if (paiementsError) {
      console.error("Error fetching paiements inscription:", paiementsError);
    }

    const formattedEnfants: Enfant[] = (enfantsData as EnfantRow[]).map(row => {
      const paiementsEnfant = paiementsInscription?.filter(p => p.enfant_id === row.id) || [];
      
      return {
        id: row.id,
        nom: row.nom,
        prenom: row.prenom,
        dateNaissance: row.date_naissance || undefined,
        dateInscription: row.date_inscription || undefined,
        dateFinInscription: row.date_fin_inscription || undefined,
        classe: row.classe as "TPS" | "PS" | "MS" | "GS" || undefined,
        gsmMaman: row.gsm_maman || undefined,
        gsmPapa: row.gsm_papa || undefined,
        anneeScolaire: row.annee_scolaire || undefined,
        fraisInscription: {
          montantTotal: row.montant_total || 0,
          montantPaye: row.montant_paye || 0,
          paiements: paiementsEnfant.map(p => ({
            id: p.id,
            montant: p.montant,
            datePaiement: p.date_paiement || '',
            methodePaiement: p.methode_paiement as "carte" | "especes" | "cheque" | "virement" || "especes"
          }))
        },
        fraisScolariteMensuel: row.frais_scolarite_mensuel || 0,
        statut: row.statut as "actif" | "inactif" || "actif",
        dernierPaiement: row.dernier_paiement || undefined,
        assurance_declaree: row.assurance_declaree || false,
        date_assurance: row.date_assurance || undefined
      };
    });

    console.log("Formatted enfants:", formattedEnfants);
    return formattedEnfants;
  } catch (error) {
    console.error("Network error fetching enfants:", error);
    throw error;
  }
};

export const addEnfantToDB = async (enfant: Omit<Enfant, "id">): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('enfants')
      .insert([{
        nom: enfant.nom,
        prenom: enfant.prenom,
        date_naissance: enfant.dateNaissance,
        date_inscription: enfant.dateInscription,
        date_fin_inscription: enfant.dateFinInscription,
        classe: enfant.classe,
        gsm_maman: enfant.gsmMaman,
        gsm_papa: enfant.gsmPapa,
        annee_scolaire: enfant.anneeScolaire,
        montant_total: enfant.fraisInscription?.montantTotal || 0,
        montant_paye: enfant.fraisInscription?.montantPaye || 0,
        frais_scolarite_mensuel: enfant.fraisScolariteMensuel,
        statut: enfant.statut,
        dernier_paiement: enfant.dernierPaiement,
        assurance_declaree: enfant.assurance_declaree,
        date_assurance: enfant.date_assurance
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding enfant:", error);
      throw new Error(`Erreur lors de l'ajout: ${error.message}`);
    }

    // Add inscription payments if any
    if (enfant.fraisInscription?.paiements && enfant.fraisInscription.paiements.length > 0) {
      const paiementsToInsert = enfant.fraisInscription.paiements.map(p => ({
        enfant_id: data.id,
        montant: p.montant,
        date_paiement: p.datePaiement,
        methode_paiement: p.methodePaiement
      }));

      const { error: paiementError } = await supabase
        .from('paiements_inscription')
        .insert(paiementsToInsert);

      if (paiementError) {
        console.error("Error adding paiements inscription:", paiementError);
      }
    }
  } catch (error) {
    console.error("Error in addEnfantToDB:", error);
    throw error;
  }
};

export const updateEnfantInDB = async (enfant: Enfant): Promise<void> => {
  try {
    const { error } = await supabase
      .from('enfants')
      .update({
        nom: enfant.nom,
        prenom: enfant.prenom,
        date_naissance: enfant.dateNaissance,
        date_inscription: enfant.dateInscription,
        date_fin_inscription: enfant.dateFinInscription,
        classe: enfant.classe,
        gsm_maman: enfant.gsmMaman,
        gsm_papa: enfant.gsmPapa,
        annee_scolaire: enfant.anneeScolaire,
        montant_total: enfant.fraisInscription?.montantTotal || 0,
        montant_paye: enfant.fraisInscription?.montantPaye || 0,
        frais_scolarite_mensuel: enfant.fraisScolariteMensuel,
        statut: enfant.statut,
        dernier_paiement: enfant.dernierPaiement,
        assurance_declaree: enfant.assurance_declaree,
        date_assurance: enfant.date_assurance
      })
      .eq('id', enfant.id);

    if (error) {
      console.error("Error updating enfant:", error);
      throw new Error(`Erreur lors de la modification: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in updateEnfantInDB:", error);
    throw error;
  }
};

export const deleteEnfantFromDB = async (id: number): Promise<void> => {
  try {
    // First delete related paiements_inscription
    await supabase
      .from('paiements_inscription')
      .delete()
      .eq('enfant_id', id);

    // Then delete the enfant
    const { error } = await supabase
      .from('enfants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting enfant:", error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteEnfantFromDB:", error);
    throw error;
  }
};
