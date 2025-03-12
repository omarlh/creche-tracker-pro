
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface DetaillePaiementJourProps {
  date: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaiementDetail = {
  id: number;
  montant: number;
  date_paiement: string;
  methode_paiement: string;
  type: "scolarite" | "inscription";
  enfant_id?: number;
  enfant_nom?: string;
  enfant_prenom?: string;
};

export function DetaillePaiementJour({ date, isOpen, onOpenChange }: DetaillePaiementJourProps) {
  const [paiementsDetail, setPaiementsDetail] = useState<PaiementDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (date && isOpen) {
      fetchPaiementsDetail(date);
    }
  }, [date, isOpen]);

  const fetchPaiementsDetail = async (selectedDate: string) => {
    try {
      setLoading(true);
      
      // Get regular payments with student info
      const { data: paiementsData, error: paiementsError } = await supabase
        .from('paiements')
        .select(`
          id, 
          montant, 
          date_paiement, 
          methode_paiement,
          enfant_id,
          enfants:enfant_id (nom, prenom)
        `)
        .eq('date_paiement', selectedDate);

      if (paiementsError) throw paiementsError;

      // Get inscription payments with student info
      const { data: inscriptionsData, error: inscriptionsError } = await supabase
        .from('paiements_inscription')
        .select(`
          id, 
          montant, 
          date_paiement, 
          methode_paiement,
          enfant_id,
          enfants:enfant_id (nom, prenom)
        `)
        .eq('date_paiement', selectedDate);

      if (inscriptionsError) throw inscriptionsError;

      // Format the data for display
      const formattedPaiements = paiementsData?.map(p => ({
        id: p.id,
        montant: typeof p.montant === 'number' ? p.montant : parseFloat(p.montant as any) || 0,
        date_paiement: p.date_paiement,
        methode_paiement: p.methode_paiement || 'Non spécifié',
        type: 'scolarite' as const,
        enfant_id: p.enfant_id,
        enfant_nom: p.enfants?.nom,
        enfant_prenom: p.enfants?.prenom
      })) || [];

      const formattedInscriptions = inscriptionsData?.map(p => ({
        id: p.id,
        montant: typeof p.montant === 'number' ? p.montant : parseFloat(p.montant as any) || 0,
        date_paiement: p.date_paiement,
        methode_paiement: p.methode_paiement || 'Non spécifié',
        type: 'inscription' as const,
        enfant_id: p.enfant_id,
        enfant_nom: p.enfants?.nom,
        enfant_prenom: p.enfants?.prenom
      })) || [];

      // Combine and sort by student name
      const allPaiements = [...formattedPaiements, ...formattedInscriptions].sort((a, b) => {
        if (a.enfant_nom && b.enfant_nom) {
          return a.enfant_nom.localeCompare(b.enfant_nom);
        }
        return 0;
      });

      setPaiementsDetail(allPaiements);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails des paiements."
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  // Calculate totals
  const totalScolarite = paiementsDetail
    .filter(p => p.type === 'scolarite')
    .reduce((sum, p) => sum + p.montant, 0);
    
  const totalInscription = paiementsDetail
    .filter(p => p.type === 'inscription')
    .reduce((sum, p) => sum + p.montant, 0);
    
  const totalGeneral = totalScolarite + totalInscription;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto print:w-full print:max-w-none print:overflow-visible">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex justify-between items-center">
            <span>
              Détails des paiements - {date ? formatDate(date) : ''}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="no-print hover:bg-secondary/80"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="print-content space-y-6 py-6">
          {loading ? (
            <div className="text-center py-4">Chargement des détails...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Total frais de scolarité</h4>
                  <p className="text-lg font-semibold mt-1">{totalScolarite.toFixed(2)} DH</p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Total frais d'inscription</h4>
                  <p className="text-lg font-semibold mt-1">{totalInscription.toFixed(2)} DH</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Total général</h4>
                  <p className="text-lg font-semibold mt-1">{totalGeneral.toFixed(2)} DH</p>
                </div>
              </div>
              
              {/* Detailed Payments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Enfant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paiementsDetail.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          Aucun paiement détaillé trouvé pour cette date
                        </TableCell>
                      </TableRow>
                    ) : (
                      paiementsDetail.map((paiement) => (
                        <TableRow key={`${paiement.type}-${paiement.id}`}>
                          <TableCell>
                            {paiement.enfant_nom && paiement.enfant_prenom 
                              ? `${paiement.enfant_prenom} ${paiement.enfant_nom}`
                              : "Non spécifié"}
                          </TableCell>
                          <TableCell>
                            {paiement.type === 'scolarite' ? 'Frais de scolarité' : 'Frais d\'inscription'}
                          </TableCell>
                          <TableCell>{paiement.methode_paiement}</TableCell>
                          <TableCell className="text-right">{paiement.montant.toFixed(2)} DH</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
