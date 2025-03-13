
export type CaissePaiement = {
  id: number;
  montant: number;
  date_paiement: string;
  methode_paiement: string;
};

export type PaiementMethodSummary = {
  methode: string;
  montant: number;
};

export type PaiementJournalier = {
  date: string;
  totalScolarite: number;
  totalInscription: number;
  totalGeneral: number;
};
