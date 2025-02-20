
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
  typePaiement: "mensualite" | "inscription";
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
  const [totalMensualites, setTotalMensualites] = useState(0);
  const [totalInscriptions, setTotalInscriptions] = useState(0);
  const [totalJour, setTotalJour] = useState(0);

  useEffect(() => {
    const fetchEncaissements = async () => {
      // Récupérer les paiements mensuels
      const { data: paiementsMensuels, error: errorMensuels } = await supabase
        .from('paiements')
        .select(`
          id,
          enfant_id,
          montant,
          date_paiement,
          methode_paiement,
          mois_concerne,
          type_paiement,
          enfants (
            nom,
            prenom
          )
        `)
        .eq('date_paiement', dateSelectionnee);

      // Récupérer les frais d'inscription
      const { data: fraisInscription, error: errorInscription } = await supabase
        .from('paiements_inscription')
        .select(`
          id,
          enfant_id,
          montant,
          date_paiement,
          methode_paiement,
          enfants (
            nom,
            prenom
          )
        `)
        .eq('date_paiement', dateSelectionnee);

      if (errorMensuels) console.error('Erreur mensualités:', errorMensuels);
      if (errorInscription) console.error('Erreur inscriptions:', errorInscription);

      // Formatter les données avec un typage explicite
      const mensualitesFormatees: Encaissement[] = (paiementsMensuels || []).map(p => ({
        id: p.id,
        enfantId: p.enfant_id,
        nomComplet: `${p.enfants?.prenom} ${p.enfants?.nom}`,
        typePaiement: "mensualite",
        montant: p.montant,
        methodePaiement: p.methode_paiement || '',
        datePaiement: p.date_paiement,
        moisConcerne: p.mois_concerne
      }));

      const inscriptionsFormatees: Encaissement[] = (fraisInscription || []).map(f => ({
        id: f.id,
        enfantId: f.enfant_id,
        nomComplet: `${f.enfants?.prenom} ${f.enfants?.nom}`,
        typePaiement: "inscription",
        montant: f.montant,
        methodePaiement: f.methode_paiement || '',
        datePaiement: f.date_paiement
      }));

      const encaissementsFormats = [...mensualitesFormatees, ...inscriptionsFormatees];

      // Calculer les totaux
      const totalM = mensualitesFormatees.reduce((sum, e) => sum + e.montant, 0);
      const totalI = inscriptionsFormatees.reduce((sum, e) => sum + e.montant, 0);

      setEncaissements(encaissementsFormats);
      setTotalMensualites(totalM);
      setTotalInscriptions(totalI);
      setTotalJour(totalM + totalI);
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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Mensualités</h3>
          <p className="text-2xl font-bold">{totalMensualites} DH</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Inscriptions</h3>
          <p className="text-2xl font-bold">{totalInscriptions} DH</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total du Jour</h3>
          <p className="text-2xl font-bold">{totalJour} DH</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enfant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Mois concerné</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {encaissements.map((encaissement) => (
            <TableRow key={`${encaissement.typePaiement}-${encaissement.id}`}>
              <TableCell>{encaissement.nomComplet}</TableCell>
              <TableCell>
                {encaissement.typePaiement === "mensualite" ? "Mensualité" : "Frais d'inscription"}
              </TableCell>
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
