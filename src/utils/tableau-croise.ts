
import type { Enfant } from "@/types/enfant.types";
import type { Paiement } from "@/data/paiements";
import * as XLSX from 'xlsx';

export const moisScolaires = [
  "Septembre", "Octobre", "Novembre", "Décembre",
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
];

export const moisMapping = {
  "Septembre": "09",
  "Octobre": "10",
  "Novembre": "11",
  "Décembre": "12",
  "Janvier": "01",
  "Février": "02",
  "Mars": "03",
  "Avril": "04",
  "Mai": "05",
  "Juin": "06"
} as const;

export const exportToExcel = (
  enfants: Enfant[],
  selectedAnneeScolaire: string,
  selectedClasse: string,
  searchTerm: string,
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number },
  getPaiementMensuel: (enfantId: number, mois: string) => Paiement | undefined
) => {
  const data = enfants
    .filter(e => e.anneeScolaire === selectedAnneeScolaire)
    .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
    .filter(e => {
      const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .map(enfant => {
      const inscription = getMontantInscription(enfant.id);
      const row: any = {
        "Nom": `${enfant.prenom} ${enfant.nom}`,
        "Classe": enfant.classe || "-",
        "Date d'inscription": enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-",
        "Frais d'inscription": `${inscription.montantPaye}/${inscription.montantTotal} DH`,
      };

      moisScolaires.forEach(mois => {
        const paiement = getPaiementMensuel(enfant.id, mois);
        row[mois] = paiement ? `${paiement.montant} DH` : "-";
      });

      return row;
    });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tableau Croisé");
  XLSX.writeFile(wb, `tableau_croise_${selectedAnneeScolaire}.xlsx`);

  return data;
};
