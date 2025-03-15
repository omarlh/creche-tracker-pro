
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface CaisseWhatsAppButtonProps {
  totalJour: number;
}

export function CaisseWhatsAppButton({ totalJour }: CaisseWhatsAppButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const sendWhatsAppMessage = async () => {
    if (isSending) return;
    
    try {
      setIsSending(true);
      const toastId = toast.loading("Envoi du message WhatsApp en cours...");
      
      const today = new Date().toLocaleDateString('fr-FR');
      const message = `La recette d'aujourd'hui est de ${totalJour.toFixed(2)} DH`;
      
      // Always use the fixed number 212664091486
      const phoneNumber = "212664091486";
      
      console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: phoneNumber,
          message
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast.error(`Échec de l'envoi du message: ${error.message}`, { id: toastId });
        throw error;
      }

      if (data && !data.success) {
        console.error('WhatsApp API error:', data.error);
        toast.error(`Échec de l'envoi du message: ${data.error}`, { id: toastId });
        throw new Error(data.error);
      }

      console.log('WhatsApp send response:', data);

      toast.success("Le rapport a été envoyé avec succès par WhatsApp", {
        id: toastId
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
      toast.error("Impossible d'envoyer le message WhatsApp. Vérifiez les logs pour plus de détails.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button 
      onClick={sendWhatsAppMessage} 
      variant="whatsapp" 
      size="sm"
      disabled={isSending}
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Envoi en cours...
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp
        </>
      )}
    </Button>
  );
}
