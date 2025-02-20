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
  const [formData, setFormData] = useState({
    enfantId: selectedPaiement?.enfantId?.toString() || "",
    anneeScolaire: selectedPaiement?.anneeScolaire || anneeScolaire,
    montant: selectedPaiement?.montant || defaultMontant,
    datePaiement: selectedPaiement?.datePaiement || new Date().toISOString().split('T')[0],
    moisConcerne: selectedPaiement?.moisConcerne || new Date().toISOString().slice(0, 7),
    methodePaiement: selectedPaiement?.methodePaiement || "especes",
    statut: selectedPaiement?.statut || "en_attente",
    typePaiement: selectedPaiement?.typePaiement || "mensualite",
    commentaire: selectedPaiement?.commentaire || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      moisConcerne: getFormattedMoisConcerne(formData.anneeScolaire, formData.moisConcerne)
    };
    
    onSubmit(data);
  };

  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  const genererAnnesScolaires = () => {
    const anneesDisponibles = [];
    const currentYear = new Date().getFullYear();
    for (let i = -5; i <= 5; i++) {
      const anneeDebut = currentYear + i;
      const anneeFin = anneeDebut + 1;
      anneesDisponibles.push(`${anneeDebut}-${anneeFin}`);
    }
    return anneesDisponibles;
  };

  const getMoisIndex = (moisNom: string): number => {
    const moisIndex = mois.findIndex(m => m.toLowerCase() === moisNom.toLowerCase());
    return moisIndex < 4 ? moisIndex + 9 : moisIndex - 3;
  };

  const getFormattedMoisConcerne = (anneeScolaire: string, moisNom: string) => {
    const moisIndex = getMoisIndex(moisNom);
    const [anneeDebut, anneeFin] = anneeScolaire.split('-');
    const annee = moisIndex >= 9 ? anneeDebut : anneeFin;
    return `${annee}-${String(moisIndex + 1).padStart(2, '0')}`;
  };

  const handleMoisChange = (selectedMois: string) => {
    const moisConcerne = getFormattedMoisConcerne(formData.anneeScolaire, selectedMois);
    setFormData({ ...formData, moisConcerne });
  };

  const selectTriggerStyle = "bg-[#8E9196] text-white hover:bg-[#8E9196]/90";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="enfant">Enfant</Label>
          <Select 
            value={formData.enfantId}
            onValueChange={(value) => setFormData({ ...formData, enfantId: value })}
          >
            <SelectTrigger id="enfant" className={selectTriggerStyle}>
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
              {genererAnnesScolaires().map((annee) => (
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
            <SelectTrigger id="moisConcerne" className={selectTriggerStyle}>
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
            onValueChange={(value: "carte" | "especes" | "cheque") => 
              setFormData({ ...formData, methodePaiement: value })
            }
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
          <Label htmlFor="typePaiement">Type de paiement</Label>
          <Select 
            value={formData.typePaiement}
            onValueChange={(value: "mensualite" | "inscription") => 
              setFormData({ ...formData, typePaiement: value })
            }
          >
            <SelectTrigger id="typePaiement">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensualite">Mensualité</SelectItem>
              <SelectItem value="inscription">Frais d'inscription</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select 
            value={formData.statut}
            onValueChange={(value: "complete" | "en_attente") => 
              setFormData({ ...formData, statut: value })
            }
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

        <div>
          <Label htmlFor="commentaire">Commentaire</Label>
          <Input
            id="commentaire"
            value={formData.commentaire}
            onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
            placeholder="Ajouter un commentaire (optionnel)"
          />
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
