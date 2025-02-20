
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";

export type Classe = "TPS" | "PS" | "MS" | "GS";

export type PaiementFraisInscription = {
  id: number;
  montant: number;
  datePaiement: string;
  methodePaiement: "carte" | "especes" | "cheque" | "virement";
};

export type Enfant = {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  dateInscription?: string;
  classe?: Classe;
  gsmMaman?: string;
  gsmPapa?: string;
  anneeScolaire?: string;
  fraisInscription?: {
    montantTotal: number;
    montantPaye: number;
    paiements: PaiementFraisInscription[];
  };
  fraisScolariteMensuel?: number;
  statut?: "actif" | "inactif";
  dernierPaiement?: string;
};

type EnfantStore = {
  enfants: Enfant[];
  fetchEnfants: () => Promise<void>;
  ajouterEnfant: (enfant: Omit<Enfant, "id">) => Promise<void>;
  modifierEnfant: (enfant: Enfant) => Promise<void>;
  supprimerEnfant: (id: number) => Promise<void>;
  saveEnfants: () => Promise<void>;
};

type EnfantRow = {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  date_inscription: string | null;
  classe: string | null;
  gsm_maman: string | null;
  gsm_papa: string | null;
  annee_scolaire: string | null;
  montant_total: number | null;
  montant_paye: number | null;
  frais_scolarite_mensuel: number | null;
  statut: string | null;
  dernier_paiement: string | null;
  paiements_inscription: Array<{
    id: number;
    montant: number;
    date_paiement: string | null;
    methode_paiement: string | null;
  }> | null;
};

export const useEnfantStore = create<EnfantStore>((set, get) => ({
  enfants: [],
  
  fetchEnfants: async () => {
    try {
      console.log("Fetching enfants from Supabase...");
      const { data: enfantsData, error } = await supabase
        .from('enfants')
        .select('*, paiements_inscription(*)');

      if (error) {
        console.error("Error fetching enfants:", error);
        return;
      }

      const formattedEnfants: Enfant[] = (enfantsData as EnfantRow[])?.map(enfant => ({
        id: enfant.id,
        nom: enfant.nom,
        prenom: enfant.prenom,
        dateNaissance: enfant.date_naissance || undefined,
        dateInscription: enfant.date_inscription || undefined,
        classe: enfant.classe as Classe,
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
      })) || [];

      console.log("Fetched enfants:", formattedEnfants);
      set({ enfants: formattedEnfants });
    } catch (error) {
      console.error("Error in fetchEnfants:", error);
    }
  },

  ajouterEnfant: async (enfant) => {
    try {
      console.log("Adding new enfant:", enfant);
      const currentDate = new Date().toISOString().split('T')[0];
      
      const { data: newEnfant, error } = await supabase
        .from('enfants')
        .insert([{
          nom: enfant.nom,
          prenom: enfant.prenom,
          date_naissance: enfant.dateNaissance,
          date_inscription: enfant.dateInscription || currentDate,
          classe: enfant.classe,
          gsm_maman: enfant.gsmMaman,
          gsm_papa: enfant.gsmPapa,
          annee_scolaire: enfant.anneeScolaire || "2024-2025",
          montant_total: enfant.fraisInscription?.montantTotal || 800,
          montant_paye: enfant.fraisInscription?.montantPaye || 0,
          frais_scolarite_mensuel: enfant.fraisScolariteMensuel || 800, // Modification ici
          statut: enfant.statut || "actif",
          dernier_paiement: enfant.dernierPaiement,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error adding enfant:", error);
        return;
      }

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
        }
      }

      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in ajouterEnfant:", error);
    }
  },

  modifierEnfant: async (enfant) => {
    try {
      console.log("Updating enfant:", enfant);
      const { error } = await supabase
        .from('enfants')
        .update({
          nom: enfant.nom,
          prenom: enfant.prenom,
          date_naissance: enfant.dateNaissance,
          date_inscription: enfant.dateInscription,
          classe: enfant.classe,
          gsm_maman: enfant.gsmMaman,
          gsm_papa: enfant.gsmPapa,
          annee_scolaire: enfant.anneeScolaire || "2024-2025",
          montant_total: enfant.fraisInscription?.montantTotal,
          montant_paye: enfant.fraisInscription?.montantPaye,
          frais_scolarite_mensuel: enfant.fraisScolariteMensuel,
          statut: enfant.statut,
          dernier_paiement: enfant.dernierPaiement,
        })
        .eq('id', enfant.id);

      if (error) {
        console.error("Error updating enfant:", error);
        return;
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
              methode_paiement: p.methodePaiement,
            }))
          );

        if (paiementError) {
          console.error("Error updating paiements:", paiementError);
        }
      }

      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in modifierEnfant:", error);
    }
  },

  supprimerEnfant: async (id) => {
    try {
      console.log("Deleting enfant:", id);
      const { error } = await supabase
        .from('enfants')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting enfant:", error);
        return;
      }

      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in supprimerEnfant:", error);
    }
  },

  saveEnfants: async () => {
    const { enfants } = get();
    try {
      // Sauvegarder tous les enfants
      const { error } = await supabase
        .from('enfants')
        .upsert(
          enfants.map(enfant => ({
            id: enfant.id,
            nom: enfant.nom,
            prenom: enfant.prenom,
            date_naissance: enfant.dateNaissance,
            date_inscription: enfant.dateInscription,
            classe: enfant.classe,
            gsm_maman: enfant.gsmMaman,
            gsm_papa: enfant.gsmPapa,
            annee_scolaire: enfant.anneeScolaire,
            montant_total: enfant.fraisInscription?.montantTotal,
            montant_paye: enfant.fraisInscription?.montantPaye,
            frais_scolarite_mensuel: enfant.fraisScolariteMensuel,
            statut: enfant.statut,
            dernier_paiement: enfant.dernierPaiement,
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des enfants:", error);
      throw error;
    }
  }
}));
