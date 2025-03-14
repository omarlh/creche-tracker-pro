
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Enfant } from "@/types/enfant.types";

interface CommunicationWhatsAppButtonProps {
  enfants: Enfant[];
  className?: string;
}

export function CommunicationWhatsAppButton({
  enfants,
  className,
}: CommunicationWhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const contactsCount = enfants.filter(
    (enfant) => enfant.gsmMaman || enfant.gsmPapa
  ).length;
  
  const getValidNumbers = () => {
    const numbers: string[] = [];
    
    enfants.forEach((enfant) => {
      // Ajouter le numéro de la maman s'il existe
      if (enfant.gsmMaman && enfant.gsmMaman.trim() !== "") {
        const formattedNumber = enfant.gsmMaman
          .replace(/\s+/g, "")
          .replace(/[^\d+]/g, "");
        
        if (!numbers.includes(formattedNumber)) {
          numbers.push(formattedNumber);
        }
      }
      
      // Ajouter le numéro du papa s'il existe
      if (enfant.gsmPapa && enfant.gsmPapa.trim() !== "") {
        const formattedNumber = enfant.gsmPapa
          .replace(/\s+/g, "")
          .replace(/[^\d+]/g, "");
        
        if (!numbers.includes(formattedNumber)) {
          numbers.push(formattedNumber);
        }
      }
    });
    
    return numbers;
  };
  
  const sendWhatsAppMessages = () => {
    if (!message.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }
    
    const validNumbers = getValidNumbers();
    
    if (validNumbers.length === 0) {
      toast.error("Aucun numéro valide trouvé");
      return;
    }
    
    // Pour un seul numéro, ouvrir directement WhatsApp
    if (validNumbers.length === 1) {
      const number = validNumbers[0];
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${number.startsWith('+') ? number.substring(1) : number}?text=${encodedMessage}`,
        "_blank"
      );
      setOpen(false);
      return;
    }
    
    // Pour plusieurs numéros, on utilise un message groupé
    // Note: La fonctionnalité de groupe n'est pas directement supportée par l'API WhatsApp
    // Nous affichons donc un toast pour informer l'utilisateur
    toast.info(`${validNumbers.length} contacts détectés. Vous devez les contacter un par un ou créer un groupe WhatsApp manuellement.`);
    
    // On ouvre le premier numéro comme exemple
    const firstNumber = validNumbers[0];
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${firstNumber.startsWith('+') ? firstNumber.substring(1) : firstNumber}?text=${encodedMessage}`,
      "_blank"
    );
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={className}
          disabled={contactsCount === 0}
          title={contactsCount === 0 ? "Aucun contact disponible" : ""}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp ({contactsCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer un message WhatsApp</DialogTitle>
          <DialogDescription>
            Envoyez un message à {contactsCount} parent{contactsCount > 1 ? "s" : ""} via WhatsApp
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              placeholder="Saisissez votre message ici..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button type="button" onClick={sendWhatsAppMessages}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
