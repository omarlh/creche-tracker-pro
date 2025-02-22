import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";

export type Paiement = {
  id: number;
  enfantId: number;
  montant: number;
  datePaiement: string;
  moisConcerne: string;
  methodePaiement: "carte" | "especes" | "cheque";
  statut: "complete" | "en_attente";
  anneeScolaire: string;
  commentaire?: string;
  dernierRappel?: string | null;
};

interface PaiementStore {
  paiements: Paiement[];
  ajouterPaiement: (paiement: Omit<Paiement, "id" | "anneeScolaire">) => Promise<void>;
  modifierPaiement: (paiement: Paiement) => Promise<void>;
  supprimerPaiement: (id: number) => Promise<void>;
  fetchPaiements: () => Promise<void>;
  savePaiements: () => Promise<void>;
}

export const usePaiementStore = create<PaiementStore>((set, get) => ({
  paiements: [],
  
  fetchPaiements: async () => {
    const { data, error } = await supabase
      .from('paiements')
      .select('*')
      .order('date_paiement', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      return;
    }

    const formattedData: Paiement[] = data.map(p => ({
      id: p.id,
      enfantId: p.enfant_id,
      montant: p.montant,
      datePaiement: p.date_paiement,
      moisConcerne: p.mois_concerne,
      methodePaiement: p.methode_paiement as "carte" | "especes" | "cheque",
      statut: p.statut as "complete" | "en_attente",
      commentaire: p.commentaire,
      dernierRappel: p.dernier_rappel,
      anneeScolaire: p.annee_scolaire || ''
    }));

    set({ paiements: formattedData });
  },

  ajouterPaiement: async (paiement) => {
    const dateMoisConcerne = new Date(paiement.moisConcerne);
    const mois = dateMoisConcerne.getMonth();
    const annee = dateMoisConcerne.getFullYear();
    
    const anneeScolaire = mois >= 8 
      ? `${annee}-${annee + 1}`
      : `${annee - 1}-${annee}`;

    const { data, error } = await supabase
      .from('paiements')
      .insert([{
        enfant_id: paiement.enfantId,
        montant: paiement.montant,
        date_paiement: paiement.datePaiement,
        mois_concerne: paiement.moisConcerne,
        methode_paiement: paiement.methodePaiement,
        statut: paiement.statut,
        commentaire: paiement.commentaire,
        dernier_rappel: paiement.dernierRappel,
        annee_scolaire: anneeScolaire
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout du paiement:', error);
      return;
    }

    const nouveauPaiement: Paiement = {
      id: data.id,
      enfantId: data.enfant_id,
      montant: data.montant,
      datePaiement: data.date_paiement,
      moisConcerne: data.mois_concerne,
      methodePaiement: data.methode_paiement as "carte" | "especes" | "cheque",
      statut: data.statut as "complete" | "en_attente",
      commentaire: data.commentaire,
      dernierRappel: data.dernier_rappel,
      anneeScolaire: data.annee_scolaire || ''
    };

    set(state => ({
      paiements: [...state.paiements, nouveauPaiement]
    }));
  },

  modifierPaiement: async (paiement) => {
    const dateMoisConcerne = new Date(paiement.moisConcerne);
    const mois = dateMoisConcerne.getMonth();
    const annee = dateMoisConcerne.getFullYear();
    
    const anneeScolaire = mois >= 8 
      ? `${annee}-${annee + 1}`
      : `${annee - 1}-${annee}`;

    const { error } = await supabase
      .from('paiements')
      .update({
        enfant_id: paiement.enfantId,
        montant: paiement.montant,
        date_paiement: paiement.datePaiement,
        mois_concerne: paiement.moisConcerne,
        methode_paiement: paiement.methodePaiement,
        statut: paiement.statut,
        commentaire: paiement.commentaire,
        dernier_rappel: paiement.dernierRappel,
        annee_scolaire: anneeScolaire
      })
      .eq('id', paiement.id);

    if (error) {
      console.error('Erreur lors de la modification du paiement:', error);
      return;
    }

    set(state => ({
      paiements: state.paiements.map(p => p.id === paiement.id ? {...paiement, anneeScolaire} : p)
    }));
  },

  supprimerPaiement: async (id) => {
    const { error } = await supabase
      .from('paiements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du paiement:', error);
      return;
    }

    set(state => ({
      paiements: state.paiements.filter(paiement => paiement.id !== id)
    }));
  },

  savePaiements: async () => {
    const { paiements } = get();
    try {
      const { error } = await supabase
        .from('paiements')
        .upsert(
          paiements.map(p => ({
            id: p.id,
            enfant_id: p.enfantId,
            montant: p.montant,
            date_paiement: p.datePaiement,
            mois_concerne: p.moisConcerne,
            methode_paiement: p.methodePaiement,
            statut: p.statut,
            commentaire: p.commentaire,
            dernier_rappel: p.dernierRappel,
            annee_scolaire: p.anneeScolaire
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paiements:", error);
      throw error;
    }
  }
}));
