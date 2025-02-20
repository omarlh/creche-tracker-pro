
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Encaissement {
  id: number;
  enfantId: number;
  nomComplet: string;
  montant: number;
  methodePaiement: string;
  datePaiement: string;
  moisConcerne?: string;
}

interface CaisseJournaliereTableauProps {
  dateSelectionnee: string;
}

export const CaisseJournaliereTableau = ({
  dateSelectionnee,
}: CaisseJournaliereTableauProps) => {
  const [encaissements, setEncaissements] = useState<Encaissement[]>([]);
  const [totalJour, setTotalJour] = useState(0);

  useEffect(() => {
    const fetchEncaissements = async () => {
      const { data: paiements, error: errorPaiements } = await supabase
        .from('paiements')
        .select(`
          id,
          enfant_id,
          montant,
          date_paiement,
          methode_paiement,
          mois_concerne,
          enfants (
            nom,
            prenom
          )
        `)
        .eq('date_paiement', dateSelectionnee);

      if (errorPaiements) {
        console.error('Erreur paiements:', errorPaiements);
        return;
      }

      // Formatter les données
      const encaissementsFormats: Encaissement[] = (paiements || []).map(p => ({
        id: p.id,
        enfantId: p.enfant_id,
        nomComplet: `${p.enfants?.prenom} ${p.enfants?.nom}`,
        montant: p.montant,
        methodePaiement: p.methode_paiement || '',
        datePaiement: p.date_paiement,
        moisConcerne: p.mois_concerne
      }));

      setEncaissements(encaissementsFormats);
      setTotalJour(encaissementsFormats.reduce((sum, e) => sum + e.montant, 0));
    };

    fetchEncaissements();
  }, [dateSelectionnee]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total du Jour</h3>
          <p className="text-2xl font-bold">{totalJour} DH</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enfant</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Mois concerné</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encaissements.map((encaissement) => (
            <TableRow key={encaissement.id}>
              <TableCell>{encaissement.nomComplet}</TableCell>
              <TableCell>{encaissement.montant} DH</TableCell>
              <TableCell>{encaissement.methodePaiement}</TableCell>
              <TableCell>
                {encaissement.moisConcerne ? formatDate(encaissement.moisConcerne) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
