
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { RetardPaiement } from "./RetardsTable";

interface RetardsWhatsAppProps {
  retard: RetardPaiement;
}

export function RetardsWhatsApp({ retard }: RetardsWhatsAppProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendWhatsApp = async () => {
    if (isSending) return;
    
    try {
      setIsSending(true);
      const toastId = toast.loading("Envoi du message WhatsApp en cours...");
      
      const message = `Bonjour, nous vous rappelons que le paiement de ${retard.montantDu} DH pour ${retard.enfantPrenom} ${retard.enfantNom} est en retard de ${retard.joursRetard} jours. Merci de régulariser la situation dès que possible.`;
      
      console.log(`Sending WhatsApp message to ${retard.telephone}: ${message}`);
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: retard.telephone,
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

      toast.success(`Message WhatsApp envoyé avec succès concernant ${retard.enfantPrenom} ${retard.enfantNom}`, {
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
      variant="outline"
      size="sm"
      onClick={handleSendWhatsApp}
      className="text-green-600 hover:text-green-700"
      disabled={isSending}
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Envoi...
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
