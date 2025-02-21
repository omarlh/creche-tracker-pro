
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Enfant } from "@/types/enfant.types";

interface TableauCroiseTableProps {
  enfants: Enfant[];
  selectedAnneeScolaire: string;
  selectedClasse: string;
  searchTerm: string;
  moisScolaires: string[];
  getPaiementMensuel: (enfantId: number, mois: string) => any;
  getMontantInscription: (enfantId: number) => { montantTotal: number; montantPaye: number };
}

export function TableauCroiseTable({
  enfants,
  selectedAnneeScolaire,
  selectedClasse,
  searchTerm,
  moisScolaires,
  getPaiementMensuel,
  getMontantInscription,
}: TableauCroiseTableProps) {
  const filteredEnfants = enfants
    .filter(e => e.anneeScolaire === selectedAnneeScolaire)
    .filter(e => selectedClasse === "all" || e.classe === selectedClasse)
    .filter(e => {
      const fullName = `${e.prenom} ${e.nom}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead rowSpan={2} className="bg-muted">Nom</TableHead>
          <TableHead rowSpan={2} className="bg-muted">Classe</TableHead>
          <TableHead rowSpan={2} className="bg-muted">Date d'inscription</TableHead>
          <TableHead rowSpan={2} className="bg-muted text-right">
            Frais d'inscription
          </TableHead>
          <TableHead colSpan={10} className="text-center bg-muted">
            Paiements mensuels
          </TableHead>
        </TableRow>
        <TableRow>
          {moisScolaires.map((mois) => (
            <TableHead key={mois} className="text-right bg-muted/50">
              {mois}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredEnfants.map((enfant) => {
          const inscription = getMontantInscription(enfant.id);
          return (
            <TableRow key={enfant.id}>
              <TableCell className="font-medium">
                {enfant.prenom} {enfant.nom}
              </TableCell>
              <TableCell>
                {enfant.classe || "-"}
              </TableCell>
              <TableCell>
                {enfant.dateInscription ? new Date(enfant.dateInscription).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className={`text-right ${
                inscription.montantPaye >= inscription.montantTotal 
                  ? "bg-green-50" 
                  : "bg-red-50"
              }`}>
                {inscription.montantPaye}/{inscription.montantTotal} DH
              </TableCell>
              {moisScolaires.map((mois) => {
                const paiement = getPaiementMensuel(enfant.id, mois);
                return (
                  <TableCell 
                    key={`${enfant.id}-${mois}`} 
                    className={`text-right ${paiement ? "bg-green-50" : "bg-red-50"}`}
                  >
                    {paiement ? `${paiement.montant} DH` : "-"}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
