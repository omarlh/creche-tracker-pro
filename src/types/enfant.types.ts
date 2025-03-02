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
  dateFinInscription?: string;
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
  assurance_declaree?: boolean;
  date_assurance?: string;
  telephone?: string;
  paiements?: Array<{
    id: number;
    montant: number;
    datePaiement: string;
    moisConcerne: string;
    methodePaiement: string;
    statut: string;
    anneeScolaire?: string;
  }>;
};

export type EnfantRow = {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string | null;
  date_inscription: string | null;
  date_fin_inscription: string | null;
  classe: string | null;
  gsm_maman: string | null;
  gsm_papa: string | null;
  annee_scolaire: string | null;
  montant_total: number | null;
  montant_paye: number | null;
  frais_scolarite_mensuel: number | null;
  statut: string | null;
  dernier_paiement: string | null;
  assurance_declaree: boolean | null;
  date_assurance: string | null;
  paiements_inscription: Array<{
    id: number;
    montant: number;
    date_paiement: string | null;
    methode_paiement: string | null;
  }> | null;
};
