
export type CaissePaiement = {
  id: number;
  montant: number;
  date_paiement: string;
  methode_paiement: string;
  type?: 'scolarite' | 'inscription';
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

export type CaisseReportData = {
  paiements: CaissePaiement[];
  totalScolarite: number;
  totalInscription: number;
  totalGeneral: number;
  paiementsByMethod: PaiementMethodSummary[];
  paiementsByDate: PaiementJournalier[];
};
