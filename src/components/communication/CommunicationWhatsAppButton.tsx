
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
      
      // Envoyer des messages à tous les numéros valides
      for (const number of validNumbers) {
        try {
          // Vérifier si le numéro est au format international
          let formattedNumber = number;
          
          // Assurez-vous que le numéro est au format international (commençant par +)
          if (!formattedNumber.startsWith('+')) {
            // Si le numéro commence par 00, remplacer par +
            if (formattedNumber.startsWith('00')) {
              formattedNumber = '+' + formattedNumber.substring(2);
            } else if (formattedNumber.startsWith('0')) {
              // Si le numéro commence par 0, supposer que c'est un numéro marocain
              formattedNumber = '+212' + formattedNumber.substring(1);
            } else {
              // Sinon, supposer que c'est un numéro marocain sans le 0
              formattedNumber = '+212' + formattedNumber;
            }
          }
          
          console.log(`Envoi de message à ${formattedNumber}`);
          
          const { data, error } = await supabase.functions.invoke('send-whatsapp', {
            body: {
              to: formattedNumber,
              message: message
            }
          });
          
          if (error) {
            console.error("Erreur lors de l'envoi au numéro", formattedNumber, error);
            failCount++;
          } else {
            console.log("Message envoyé avec succès au numéro", formattedNumber, data);
            successCount++;
          }
        } catch (err) {
          console.error("Exception lors de l'envoi au numéro", number, err);
          failCount++;
        }
        
        // Petite pause entre les envois pour éviter des limitations d'API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} message(s) envoyé(s) avec succès`, {
          id: toastId
        });
      }
      
      if (failCount > 0) {
        toast.error(`Échec de l'envoi pour ${failCount} contact(s)`, {
          id: toastId
        });
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Erreur globale lors de l'envoi des messages", error);
      toast.error("Une erreur est survenue lors de l'envoi des messages", {
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
