
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculerTotalParMethode } from "@/utils/tableau-croise";
import { usePaiementStore } from "@/data/paiements";
import { TableauHeader } from "./TableauHeader";
import { TableauLigne } from "./TableauLigne";
import { TableauActions } from "./TableauActions";
import { CaisseWhatsAppButton } from "./CaisseWhatsAppButton";

export function CaisseJournaliereTableau() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { paiements } = usePaiementStore();
  
  const [totalMensualites, setTotalMensualites] = useState(0);
  const [totalInscriptions, setTotalInscriptions] = useState(0);
  const [totalPaiements, setTotalPaiements] = useState(0);

  useEffect(() => {
    // Filtrer les paiements pour la période sélectionnée
    const paiementsFiltres = paiements.filter(p => {
      const datePaiement = new Date(p.datePaiement);
      return datePaiement >= startDate && datePaiement <= endDate;
    });

    // Calculer les totaux
    const mensualites = paiementsFiltres.reduce((sum, p) => {
      if (!p.moisConcerne) return sum;
      return sum + p.montant;
    }, 0);

    const inscriptions = paiementsFiltres.reduce((sum, p) => {
      if (p.moisConcerne) return sum;
      return sum + p.montant;
    }, 0);

    setTotalMensualites(mensualites);
    setTotalInscriptions(inscriptions);
    setTotalPaiements(mensualites + inscriptions);
  }, [paiements, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Implémenter l'export Excel ici
    console.log("Export Excel");
  };

  const totauxParMethode = calculerTotalParMethode(paiements);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4">
        <TableauHeader
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <div className="flex gap-2">
          <CaisseWhatsAppButton 
            mensualites={totalMensualites} 
            inscriptions={totalInscriptions} 
          />
          <TableauActions
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
            totalPaiements={totalPaiements}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Méthode de paiement</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(totauxParMethode).map(([methode, total]) => (
            <TableauLigne key={methode} methode={methode} total={total} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
