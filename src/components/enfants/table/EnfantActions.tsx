
import { Button } from "@/components/ui/button";
import { Printer, Trash2 } from "lucide-react";
import { type Enfant, useEnfantStore } from "@/data/enfants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface EnfantActionsProps {
  enfant: Enfant;
  onEdit: (enfant: Enfant) => void;
  onPrint: (enfant: Enfant) => void;
}

export const EnfantActions = ({ enfant, onEdit, onPrint }: EnfantActionsProps) => {
  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supprimerEnfant = useEnfantStore((state) => state.supprimerEnfant);

  const handleDelete = () => {
    if (password === "radia") {
      console.log("Tentative de suppression de l'enfant:", enfant);
      supprimerEnfant(enfant.id);
      setIsDialogOpen(false);
      toast({
        title: "Suppression réussie",
        description: `${enfant.prenom} ${enfant.nom} a été supprimé(e) de la liste.`,
      });
      setPassword("");
      setIsPasswordError(false);
    } else {
      setIsPasswordError(true);
      toast({
        title: "Erreur de suppression",
        description: "Le mot de passe est incorrect.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-right space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(enfant)}
      >
        Modifier
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPrint(enfant)}
      >
        <Printer className="w-4 h-4 mr-1" />
        Imprimer
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet enfant ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les informations concernant {enfant.prenom} {enfant.nom} seront définitivement supprimées.
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Veuillez entrer le mot de passe pour confirmer la suppression
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsPasswordError(false);
                  }}
                  className={isPasswordError ? "border-destructive" : ""}
                  placeholder="Entrez le mot de passe"
                />
                {isPasswordError && (
                  <p className="text-sm text-destructive mt-1">
                    Mot de passe incorrect
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPassword("");
              setIsPasswordError(false);
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
