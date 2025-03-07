
export interface PaiementMensuel {
  mois: string;
  total: number;
  fraisInscription: number;
  nbPaiements: number;
}

export interface DashboardData {
  isLoading: boolean;
  error: Error | null;
  enfantsFiltres: any[];
  enfantsActifs: number;
  totalMensualites: number;
  totalFraisInscription: number;
  totalPaiements: number;
  moyennePaiements: string;
  paiementsMensuels: PaiementMensuel[];
  reloadData: () => Promise<void>;
}
