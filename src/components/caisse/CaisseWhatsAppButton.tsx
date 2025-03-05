
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface CaisseWhatsAppButtonProps {
  totalJour: number;
}

export function CaisseWhatsAppButton({ totalJour }: CaisseWhatsAppButtonProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const sendWhatsAppMessage = async () => {
    if (isSending) return;
    
    try {
      setIsSending(true);
      const today = new Date().toLocaleDateString('fr-FR');
      const message = `La recette d'aujourd'hui est de ${totalJour.toFixed(2)} DH`;
      
      // Format the phone number correctly for the WhatsApp API
      // The API requires the phone number to be in the format +COUNTRYCODEPHONENUMBER
      // For Morocco, the country code is 212
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
        throw error;
      }

      console.log('WhatsApp send response:', data);

      toast({
        title: "Message envoyé",
        description: "Le rapport a été envoyé avec succès par WhatsApp",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message WhatsApp. Vérifiez la console pour plus de détails.",
      });
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
      <MessageSquare className="h-4 w-4 mr-2" />
      {isSending ? "Envoi en cours..." : "WhatsApp"}
    </Button>
  );
}
