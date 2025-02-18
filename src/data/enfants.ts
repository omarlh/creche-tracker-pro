
import { create } from 'zustand';

export type Enfant = {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  fraisInscription?: boolean;
  statut?: "actif" | "inactif";
  dernierPaiement?: string;
};

type EnfantStore = {
  enfants: Enfant[];
  ajouterEnfant: (enfant: Omit<Enfant, "id">) => void;
  modifierEnfant: (enfant: Enfant) => void;
};

// Store Zustand pour gérer l'état global des enfants
export const useEnfantStore = create<EnfantStore>((set) => ({
  enfants: [
    {
      id: 1,
      nom: "Dubois",
      prenom: "Sophie",
      dateNaissance: "2020-03-15",
      fraisInscription: true,
      statut: "actif",
      dernierPaiement: "2024-02-15",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Lucas",
      dateNaissance: "2021-05-20",
      fraisInscription: true,
      statut: "actif",
      dernierPaiement: "2024-02-10",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Emma",
      dateNaissance: "2020-11-08",
      fraisInscription: false,
      statut: "inactif",
      dernierPaiement: "2024-01-15",
    },
    {
      id: 4,
      nom: "BENNANI",
      prenom: "Youssef",
      dateNaissance: "2020-01-01",
      fraisInscription: true,
      statut: "actif",
      dernierPaiement: "2024-02-20",
    },
  ],
  ajouterEnfant: (enfant) =>
    set((state) => ({
      enfants: [
        ...state.enfants,
        { ...enfant, id: state.enfants.length + 1 },
      ],
    })),
  modifierEnfant: (enfant) =>
    set((state) => ({
      enfants: state.enfants.map((e) =>
        e.id === enfant.id ? enfant : e
      ),
    })),
}));
