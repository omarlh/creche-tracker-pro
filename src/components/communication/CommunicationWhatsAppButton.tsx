
import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
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
  const [isSending, setIsSending] = useState(false);
  
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
  
  const sendWhatsAppMessages = async () => {
    if (!message.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }
    
    const validNumbers = getValidNumbers();
    
    if (validNumbers.length === 0) {
      toast.error("Aucun numéro valide trouvé");
      return;
    }
    
    setIsSending(true);
    const toastId = toast.loading(`Envoi de messages à ${validNumbers.length} contact(s)...`);
    
    try {
      let successCount = 0;
      let failCount = 0;
      let errorMessages: string[] = [];
      
      // Envoyer des messages à tous les numéros valides
      for (const number of validNumbers) {
        try {
          console.log(`Envoi de message à ${number}`);
          
          const { data, error } = await supabase.functions.invoke('send-whatsapp', {
            body: {
              to: number,
              message: message
            }
          });
          
          if (error) {
            console.error("Erreur lors de l'envoi au numéro", number, error);
            failCount++;
            errorMessages.push(`${number}: ${error.message}`);
          } else if (data && !data.success) {
            console.error("Erreur retournée par la fonction", number, data);
            failCount++;
            errorMessages.push(`${number}: ${data.error || "Erreur inconnue"}`);
          } else {
            console.log("Message envoyé avec succès au numéro", number, data);
            successCount++;
          }
        } catch (err) {
          console.error("Exception lors de l'envoi au numéro", number, err);
          failCount++;
          errorMessages.push(`${number}: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
        }
        
        // Petite pause entre les envois pour éviter des limitations d'API
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} message(s) envoyé(s) avec succès`, {
          id: toastId
        });
      }
      
      if (failCount > 0) {
        toast.error(`Échec de l'envoi pour ${failCount} contact(s): ${errorMessages.slice(0, 3).join(', ')}${errorMessages.length > 3 ? '...' : ''}`, {
          id: toastId,
          duration: 5000
        });
      }
      
      if (successCount > 0) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Erreur globale lors de l'envoi des messages", error);
      toast.error(`Une erreur est survenue: ${error instanceof Error ? error.message : "Erreur inconnue"}`, {
        id: toastId
      });
    } finally {
      setIsSending(false);
    }
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
            disabled={isSending}
          >
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={sendWhatsAppMessages}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
