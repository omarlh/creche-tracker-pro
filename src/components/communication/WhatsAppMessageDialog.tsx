
import { useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWhatsAppSender } from "@/hooks/communication/useWhatsAppSender";
import type { Enfant } from "@/types/enfant.types";

interface WhatsAppMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enfants: Enfant[];
}

export function WhatsAppMessageDialog({ 
  open, 
  onOpenChange, 
  enfants 
}: WhatsAppMessageDialogProps) {
  const [message, setMessage] = useState("");
  const { isSending, sendWhatsAppMessages } = useWhatsAppSender();
  
  const handleSendMessage = async () => {
    const result = await sendWhatsAppMessages(message, enfants);
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Envoyer un message WhatsApp</DialogTitle>
        <DialogDescription>
          Envoyez un message à {enfants.length} parent{enfants.length > 1 ? "s" : ""} via WhatsApp
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
          onClick={() => onOpenChange(false)}
          disabled={isSending}
        >
          Annuler
        </Button>
        <Button 
          type="button" 
          onClick={handleSendMessage}
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
  );
}
