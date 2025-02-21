import { supabase } from "@/integrations/supabase/client";
import type { Enfant, EnfantRow } from "@/types/enfant.types";

export const formatEnfantFromRow = (enfant: EnfantRow): Enfant => ({
  id: enfant.id,
  nom: enfant.nom,
  prenom: enfant.prenom,
  dateNaissance: enfant.date_naissance || undefined,
  dateInscription: enfant.date_inscription || undefined,
  dateFinInscription: enfant.date_fin_inscription || undefined,
  classe: enfant.classe as Enfant["classe"],
  gsmMaman: enfant.gsm_maman || undefined,
  gsmPapa: enfant.gsm_papa || undefined,
  anneeScolaire: enfant.annee_scolaire || undefined,
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
});

export const fetchEnfantsFromDB = async () => {
  const { data: enfantsData, error } = await supabase
    .from('enfants')
    .select('*, paiements_inscription(*)');

  if (error) {
    console.error("Error fetching enfants:", error);
    throw error;
  }

  return (enfantsData as EnfantRow[])?.map(formatEnfantFromRow) || [];
};

export const addEnfantToDB = async (enfant: Omit<Enfant, "id">) => {
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
      montant_total: enfant.fraisInscription?.montantTotal || 800,
      montant_paye: enfant.fraisInscription?.montantPaye || 0,
      frais_scolarite_mensuel: enfant.fraisScolariteMensuel || 800,
      statut: enfant.statut || "actif",
      dernier_paiement: enfant.dernierPaiement,
      assurance_declaree: enfant.assurance_declaree || false,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error adding enfant:", error);
    throw error;
  }

  if (enfant.fraisInscription?.paiements?.length) {
    const { error: paiementError } = await supabase
      .from('paiements_inscription')
      .insert(
        enfant.fraisInscription.paiements.map(p => ({
          enfant_id: newEnfant.id,
          montant: p.montant,
          date_paiement: p.datePaiement,
          methode_paiement: p.methode_paiement,
        }))
      );

    if (paiementError) {
      console.error("Error adding paiements:", paiementError);
      throw paiementError;
    }
  }

  return newEnfant;
};

export const updateEnfantInDB = async (enfant: Enfant) => {
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
    console.error("Error updating enfant:", error);
    throw error;
  }

  if (enfant.fraisInscription?.paiements?.length) {
    const { error: paiementError } = await supabase
      .from('paiements_inscription')
      .upsert(
        enfant.fraisInscription.paiements.map(p => ({
          id: p.id,
          enfant_id: enfant.id,
          montant: p.montant,
          date_paiement: p.datePaiement,
          methode_paiement: p.methode_paiement,
        }))
      );

    if (paiementError) {
      console.error("Error updating paiements:", paiementError);
      throw paiementError;
    }
  }
};

export const deleteEnfantFromDB = async (id: number) => {
  const { error } = await supabase
    .from('enfants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting enfant:", error);
    throw error;
  }
};
