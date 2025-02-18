import { create } from 'zustand';

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
  statut?: "actif" | "inactif";
  dernierPaiement?: string;
};

type EnfantStore = {
  enfants: Enfant[];
  ajouterEnfant: (enfant: Omit<Enfant, "id">) => void;
  modifierEnfant: (enfant: Enfant) => void;
  supprimerEnfant: (id: number) => void;
};

export const useEnfantStore = create<EnfantStore>((set, get) => ({
  enfants: [
    {
      id: 1,
      nom: "Dubois",
      prenom: "Sophie",
      dateNaissance: "2020-03-15",
      classe: "MS",
      gsmMaman: "0612345678",
      gsmPapa: "0687654321",
      anneeScolaire: "2023-2024",
      fraisInscription: {
        montantTotal: 300,
        montantPaye: 300,
        paiements: [{
          id: 1,
          montant: 300,
          datePaiement: "2024-02-15",
          methodePaiement: "carte"
        }]
      },
      statut: "actif",
      dernierPaiement: "2024-02-15",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Lucas",
      dateNaissance: "2021-05-20",
      classe: "PS",
      anneeScolaire: "2023-2024",
      fraisInscription: {
        montantTotal: 300,
        montantPaye: 150,
        paiements: [{
          id: 1,
          montant: 150,
          datePaiement: "2024-02-10",
          methodePaiement: "cheque"
        }]
      },
      statut: "actif",
      dernierPaiement: "2024-02-10",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Emma",
      dateNaissance: "2020-11-08",
      classe: "MS",
      anneeScolaire: "2023-2024",
      fraisInscription: {
        montantTotal: 300,
        montantPaye: 0,
        paiements: []
      },
      statut: "inactif",
      dernierPaiement: "2024-01-15",
    },
    {
      id: 4,
      nom: "BENNANI",
      prenom: "Youssef",
      dateNaissance: "2020-01-01",
      classe: "GS",
      anneeScolaire: "2024-2025",
      fraisInscription: {
        montantTotal: 300,
        montantPaye: 300,
        paiements: [{
          id: 1,
          montant: 300,
          datePaiement: "2024-02-20",
          methodePaiement: "carte"
        }]
      },
      statut: "actif",
      dernierPaiement: "2024-02-20",
    },
  ],
  ajouterEnfant: (enfant) =>
    set((state) => ({
      enfants: [
        ...state.enfants,
        { 
          ...enfant, 
          id: Math.max(...state.enfants.map(e => e.id), 0) + 1,
          fraisInscription: {
            ...enfant.fraisInscription,
            paiements: enfant.fraisInscription?.paiements || []
          }
        },
      ],
    })),
  modifierEnfant: (enfant) =>
    set((state) => ({
      enfants: state.enfants.map((e) =>
        e.id === enfant.id ? enfant : e
      ),
    })),
  supprimerEnfant: (id) =>
    set((state) => {
      const enfantASupprimer = state.enfants.find(e => e.id === id);
      if (enfantASupprimer) {
        console.log(`Suppression de l'enfant: ${enfantASupprimer.prenom} ${enfantASupprimer.nom}`);
        return {
          enfants: state.enfants.filter(e => e.id !== id)
        };
      }
      return state;
    }),
}));
