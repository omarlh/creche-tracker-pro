
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Paiement } from "@/data/paiements";

interface DeletePaiementDialogProps {
  paiementToDelete: Paiement | null;
  deletePassword: string;
  isPasswordError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  setDeletePassword: (password: string) => void;
}

export const DeletePaiementDialog = ({
  paiementToDelete,
  deletePassword,
  isPasswordError,
  onCancel,
  onConfirm,
  setDeletePassword,
}: DeletePaiementDialogProps) => {
  return (
    <AlertDialog open={paiementToDelete !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
            Veuillez entrer "delete" pour confirmer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="deletePassword">
            Tapez <span className="font-bold">delete</span> pour confirmer
          </Label>
          <Input
            id="deletePassword"
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="delete"
          />
          {isPasswordError && (
            <p className="text-red-500 text-sm">Mot de passe incorrect.</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
