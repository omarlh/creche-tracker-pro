
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
  typePaiement: "mensualite" | "inscription";
  anneeScolaire?: string;
  mois?: string;
  commentaire?: string;
};

interface PaiementStore {
  paiements: Paiement[];
  ajouterPaiement: (paiement: Omit<Paiement, "id">) => Promise<void>;
  modifierPaiement: (paiement: Paiement) => Promise<void>;
  supprimerPaiement: (id: number) => Promise<void>;
  fetchPaiements: () => Promise<void>;
}

export const usePaiementStore = create<PaiementStore>((set) => ({
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
      typePaiement: p.type_paiement as "mensualite" | "inscription",
      commentaire: p.commentaire
    }));

    set({ paiements: formattedData });
  },

  ajouterPaiement: async (paiement) => {
    const { data, error } = await supabase
      .from('paiements')
      .insert([{
        enfant_id: paiement.enfantId,
        montant: paiement.montant,
        date_paiement: paiement.datePaiement,
        mois_concerne: paiement.moisConcerne,
        methode_paiement: paiement.methodePaiement,
        statut: paiement.statut,
        type_paiement: paiement.typePaiement,
        commentaire: paiement.commentaire
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
      methodePaiement: data.methode_paiement,
      statut: data.statut,
      typePaiement: data.type_paiement,
      commentaire: data.commentaire
    };

    set(state => ({
      paiements: [...state.paiements, nouveauPaiement]
    }));
  },

  modifierPaiement: async (paiement) => {
    const { error } = await supabase
      .from('paiements')
      .update({
        enfant_id: paiement.enfantId,
        montant: paiement.montant,
        date_paiement: paiement.datePaiement,
        mois_concerne: paiement.moisConcerne,
        methode_paiement: paiement.methodePaiement,
        statut: paiement.statut,
        type_paiement: paiement.typePaiement,
        commentaire: paiement.commentaire
      })
      .eq('id', paiement.id);

    if (error) {
      console.error('Erreur lors de la modification du paiement:', error);
      return;
    }

    set(state => ({
      paiements: state.paiements.map(p => p.id === paiement.id ? paiement : p)
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
}));
