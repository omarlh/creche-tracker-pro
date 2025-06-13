
import { supabase } from "@/integrations/supabase/client";
import type { Enfant, EnfantRow } from "@/types/enfant.types";

// Fonction utilitaire pour normaliser les années scolaires
const normalizeSchoolYear = (year: string | undefined): string => {
  if (!year) return "";
  // Remplacer les / par des - et s'assurer qu'il n'y a pas d'espaces
  return year.trim().replace('/', '-');
};

export const formatEnfantFromRow = (enfant: EnfantRow): Enfant => {
  // Normaliser l'année scolaire lors de la conversion depuis la BD
  const anneeScolaire = normalizeSchoolYear(enfant.annee_scolaire || "2024-2025");
  
  return {
    id: enfant.id,
    nom: enfant.nom,
    prenom: enfant.prenom,
    dateNaissance: enfant.date_naissance || undefined,
    dateInscription: enfant.date_inscription || undefined,
    dateFinInscription: enfant.date_fin_inscription || undefined,
    classe: enfant.classe as Enfant["classe"],
    gsmMaman: enfant.gsm_maman || undefined,
    gsmPapa: enfant.gsm_papa || undefined,
    anneeScolaire: anneeScolaire,
    fraisScolariteMensuel: enfant.frais_scolarite_mensuel || undefined,
    fraisInscription: {
      montantTotal: enfant.montant_total || 0,
      montantPaye: enfant.montant_paye || 0,
      paiements: (enfant.paiements_inscription || []).map(p => ({
        id: p.id,
        montant: p.montant,
        datePaiement: p.date_paiement || '',
        methodePaiement: p.methode_paiement as "carte" | "especes" | "cheque" | "virement",
      }))
    },
    statut: enfant.statut as "actif" | "inactif",
    dernierPaiement: enfant.dernier_paiement || undefined,
    assurance_declaree: enfant.assurance_declaree || false,
    date_assurance: enfant.date_assurance || undefined,
  };
};

export const fetchEnfantsFromDB = async () => {
  console.log("Fetching enfants from database...");
  
  try {
    const { data: enfantsData, error } = await supabase
      .from('enfants')
      .select('*, paiements_inscription(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching enfants:", error);
      throw new Error(`Erreur de base de données: ${error.message}`);
    }

    console.log("Successfully fetched enfants:", enfantsData?.length || 0);
    return (enfantsData as EnfantRow[])?.map(formatEnfantFromRow) || [];
  } catch (error) {
    console.error("Network error fetching enfants:", error);
    throw error;
  }
};

export const addEnfantToDB = async (enfant: Omit<Enfant, "id">) => {
  console.log("Adding enfant to database:", enfant);
  
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const { data: newEnfant, error } = await supabase
      .from('enfants')
      .insert([{
        nom: enfant.nom,
        prenom: enfant.prenom,
        date_naissance: enfant.dateNaissance,
        date_inscription: enfant.dateInscription || currentDate,
        date_fin_inscription: enfant.dateFinInscription,
        classe: enfant.classe,
        gsm_maman: enfant.gsmMaman,
        gsm_papa: enfant.gsmPapa,
        annee_scolaire: enfant.anneeScolaire || "2024-2025",
        montant_total: enfant.fraisInscription?.montantTotal || 300,
        montant_paye: enfant.fraisInscription?.montantPaye || 0,
        frais_scolarite_mensuel: enfant.fraisScolariteMensuel || 800,
        statut: enfant.statut || "actif",
        dernier_paiement: enfant.dernierPaiement,
        assurance_declaree: enfant.assurance_declaree || false,
        date_assurance: enfant.date_assurance,
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error adding enfant:", error);
      throw new Error(`Erreur lors de l'ajout: ${error.message}`);
    }

    console.log("Successfully added enfant:", newEnfant);

    // Add payment records if any
    if (enfant.fraisInscription?.paiements?.length) {
      const { error: paiementError } = await supabase
        .from('paiements_inscription')
        .insert(
          enfant.fraisInscription.paiements.map(p => ({
            enfant_id: newEnfant.id,
            montant: p.montant,
            date_paiement: p.datePaiement,
            methode_paiement: p.methodePaiement,
          }))
        );

      if (paiementError) {
        console.error("Error adding paiements:", paiementError);
        // Don't throw here, the main record was created successfully
      }
    }

    return newEnfant;
  } catch (error) {
    console.error("Network error adding enfant:", error);
    throw error;
  }
};

export const updateEnfantInDB = async (enfant: Enfant) => {
  console.log("Updating enfant in database:", enfant);
  
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
        annee_scolaire: enfant.anneeScolaire || "2024-2025",
        montant_total: enfant.fraisInscription?.montantTotal,
        montant_paye: enfant.fraisInscription?.montantPaye,
        frais_scolarite_mensuel: enfant.fraisScolariteMensuel,
        statut: enfant.statut,
        dernier_paiement: enfant.dernierPaiement,
        assurance_declaree: enfant.assurance_declaree,
        date_assurance: enfant.date_assurance,
      })
      .eq('id', enfant.id);

    if (error) {
      console.error("Supabase error updating enfant:", error);
      throw new Error(`Erreur lors de la modification: ${error.message}`);
    }

    console.log("Successfully updated enfant");

    // Update payment records if any
    if (enfant.fraisInscription?.paiements?.length) {
      const { error: paiementError } = await supabase
        .from('paiements_inscription')
        .upsert(
          enfant.fraisInscription.paiements.map(p => ({
            id: p.id,
            enfant_id: enfant.id,
            montant: p.montant,
            date_paiement: p.datePaiement,
            methode_paiement: p.methodePaiement,
          }))
        );

      if (paiementError) {
        console.error("Error updating paiements:", paiementError);
      }
    }
  } catch (error) {
    console.error("Network error updating enfant:", error);
    throw error;
  }
};

export const deleteEnfantFromDB = async (id: number) => {
  console.log("Deleting enfant from database:", id);
  
  try {
    const { error } = await supabase
      .from('enfants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error deleting enfant:", error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }

    console.log("Successfully deleted enfant");
  } catch (error) {
    console.error("Network error deleting enfant:", error);
    throw error;
  }
};
