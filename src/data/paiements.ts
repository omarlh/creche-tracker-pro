
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
    // Déterminer l'année scolaire en fonction du mois concerné
    const dateMoisConcerne = new Date(paiement.moisConcerne);
    const mois = dateMoisConcerne.getMonth(); // 0-11
    const annee = dateMoisConcerne.getFullYear();
    
    // Si le mois est entre septembre et décembre (8-11), l'année scolaire commence cette année
    // Si le mois est entre janvier et juillet (0-6), l'année scolaire a commencé l'année précédente
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
        type_paiement: paiement.typePaiement,
        commentaire: paiement.commentaire,
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
      typePaiement: data.type_paiement as "mensualite" | "inscription",
      commentaire: data.commentaire,
      anneeScolaire: data.annee_scolaire
    };

    set(state => ({
      paiements: [...state.paiements, nouveauPaiement]
    }));
  },

  modifierPaiement: async (paiement) => {
    // Mise à jour de l'année scolaire lors de la modification
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
        type_paiement: paiement.typePaiement,
        commentaire: paiement.commentaire,
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
}));
