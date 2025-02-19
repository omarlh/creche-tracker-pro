
import { create } from 'zustand';

export type Paiement = {
  id: number;
  enfantId: number;
  montant: number;
  datePaiement: string;
  moisConcerne: string;
  methodePaiement: "carte" | "especes" | "cheque";
  statut: "complete" | "en_attente";
  anneeScolaire?: string;
  mois?: string;
  commentaire?: string;
};

interface PaiementStore {
  paiements: Paiement[];
  ajouterPaiement: (paiement: Omit<Paiement, "id">) => void;
  modifierPaiement: (paiement: Paiement) => void;
  supprimerPaiement: (id: number) => void;
  fetchPaiements: () => void;
}

export const usePaiementStore = create<PaiementStore>((set) => ({
  paiements: [],
  fetchPaiements: async () => {
    // Simulation d'un appel API
    set({
      paiements: [
        {
          id: 1,
          enfantId: 1,
          montant: 800,
          datePaiement: "2024-02-15",
          moisConcerne: "2024-02",
          methodePaiement: "carte",
          statut: "complete",
        },
        {
          id: 2,
          enfantId: 2,
          montant: 800,
          datePaiement: "2024-02-10",
          moisConcerne: "2024-02",
          methodePaiement: "cheque",
          statut: "complete",
        },
        {
          id: 3,
          enfantId: 3,
          montant: 800,
          datePaiement: "2024-02-01",
          moisConcerne: "2024-02",
          methodePaiement: "especes",
          statut: "en_attente",
        },
      ],
    });
  },
  ajouterPaiement: (paiement) =>
    set((state) => ({
      paiements: [...state.paiements, { ...paiement, id: Date.now() }],
    })),
  modifierPaiement: (paiement) =>
    set((state) => ({
      paiements: state.paiements.map((p) => (p.id === paiement.id ? paiement : p)),
    })),
  supprimerPaiement: (id) =>
    set((state) => ({
      paiements: state.paiements.filter((paiement) => paiement.id !== id),
    })),
}));
