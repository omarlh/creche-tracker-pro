
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
import { toast } from "@/components/ui/use-toast";

interface EnfantActionsProps {
  enfant: Enfant;
  onEdit: (enfant: Enfant) => void;
  onPrint: (enfant: Enfant) => void;
}

export const EnfantActions = ({ enfant, onEdit, onPrint }: EnfantActionsProps) => {
  const handleDelete = (enfant: Enfant) => {
    const { supprimerEnfant } = useEnfantStore.getState();
    supprimerEnfant(enfant.id);
    toast({
      title: "Suppression réussie",
      description: `${enfant.prenom} ${enfant.nom} a été supprimé(e) de la liste.`,
    });
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
      <AlertDialog>
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(enfant)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
