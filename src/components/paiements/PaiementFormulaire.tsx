
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Paiement } from "@/data/paiements";
import type { Enfant } from "@/data/enfants";

interface PaiementFormulaireProps {
  selectedPaiement: Paiement | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  anneeScolaire: string;
  moisDisponibles: string[];
  defaultMontant: number;
  enfants: Enfant[];
}

export const PaiementFormulaire = ({
  selectedPaiement,
  onSubmit,
  onCancel,
  anneeScolaire,
  moisDisponibles,
  defaultMontant,
  enfants,
}: PaiementFormulaireProps) => {
  // Liste des années scolaires (on peut ajouter plus d'années si nécessaire)
  const anneesDisponibles = [
    "2023-2024",
    "2024-2025",
    "2025-2026"
  ];

  const [formData, setFormData] = useState({
    enfantId: selectedPaiement?.enfantId?.toString() || "",
    anneeScolaire: selectedPaiement?.anneeScolaire || anneeScolaire,
    mois: selectedPaiement?.mois || "",
    montant: selectedPaiement?.montant || defaultMontant,
    datePaiement: selectedPaiement?.datePaiement || new Date().toISOString().split('T')[0],
    moisConcerne: selectedPaiement?.moisConcerne || new Date().toISOString().slice(0, 7),
    methodePaiement: selectedPaiement?.methodePaiement || "especes",
    statut: selectedPaiement?.statut || "en_attente",
    commentaire: selectedPaiement?.commentaire || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [annee, mois] = formData.moisConcerne.split('-');
    const moisConcerneDate = new Date(parseInt(annee), parseInt(mois) - 1, 1);
    
    onSubmit({
      ...formData,
      enfantId: parseInt(formData.enfantId),
      montant: parseFloat(formData.montant.toString()),
      moisConcerne: moisConcerneDate.toISOString()
    });
  };

  const getMoisAvecAnnee = (mois: string) => {
    const [anneeDebut, anneeFin] = formData.anneeScolaire.split('-');
    const annee = ['septembre', 'octobre', 'novembre', 'décembre'].includes(mois.toLowerCase())
      ? anneeDebut
      : anneeFin;
    return { mois, annee };
  };

  // Liste des mois de l'année scolaire (septembre à juin)
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  const getMoisIndex = (selectedMois: string): number => {
    const moisIndex = mois.findIndex(m => m.toLowerCase() === selectedMois.toLowerCase());
    // Pour janvier-juin, on ajoute 1 au mois
    // Pour septembre-décembre, on ajoute 9 pour obtenir le bon numéro de mois
    return moisIndex < 4 ? moisIndex + 9 : moisIndex - 3;
  };

  const handleMoisChange = (selectedMois: string) => {
    const { mois, annee } = getMoisAvecAnnee(selectedMois);
    const moisIndex = getMoisIndex(selectedMois);
    const moisConcerne = `${annee}-${String(moisIndex).padStart(2, '0')}`;
    setFormData({ ...formData, moisConcerne });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="enfant">Enfant</Label>
          <Select 
            value={formData.enfantId}
            onValueChange={(value) => setFormData({ ...formData, enfantId: value })}
          >
            <SelectTrigger id="enfant">
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent>
              {enfants.map((enfant) => (
                <SelectItem key={enfant.id} value={enfant.id.toString()}>
                  {enfant.prenom} {enfant.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="anneeScolaire">Année scolaire</Label>
          <Select 
            value={formData.anneeScolaire}
            onValueChange={(value) => setFormData({ ...formData, anneeScolaire: value })}
          >
            <SelectTrigger id="anneeScolaire">
              <SelectValue placeholder="Sélectionner une année scolaire" />
            </SelectTrigger>
            <SelectContent>
              {anneesDisponibles.map((annee) => (
                <SelectItem key={annee} value={annee}>
                  {annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="montant">Montant (DH)</Label>
          <Input
            id="montant"
            type="number"
            value={formData.montant}
            onChange={(e) => setFormData({ ...formData, montant: parseFloat(e.target.value) })}
            min={0}
            required
          />
        </div>

        <div>
          <Label htmlFor="datePaiement">Date de paiement</Label>
          <Input
            id="datePaiement"
            type="date"
            value={formData.datePaiement}
            onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="moisConcerne">Mois concerné</Label>
          <Select 
            value={formData.moisConcerne.split('-')[1]}
            onValueChange={handleMoisChange}
          >
            <SelectTrigger id="moisConcerne">
              <SelectValue placeholder="Sélectionner le mois" />
            </SelectTrigger>
            <SelectContent>
              {mois.map((mois) => (
                <SelectItem 
                  key={mois} 
                  value={mois.toLowerCase()}
                >
                  {mois}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="methodePaiement">Méthode de paiement</Label>
          <Select 
            value={formData.methodePaiement}
            onValueChange={(value) => setFormData({ ...formData, methodePaiement: value as "carte" | "especes" | "cheque" })}
          >
            <SelectTrigger id="methodePaiement">
              <SelectValue placeholder="Sélectionner une méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carte">Carte</SelectItem>
              <SelectItem value="especes">Espèces</SelectItem>
              <SelectItem value="cheque">Chèque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select 
            value={formData.statut}
            onValueChange={(value) => setFormData({ ...formData, statut: value as "complete" | "en_attente" })}
          >
            <SelectTrigger id="statut">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Complété</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit">
          {selectedPaiement ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};
