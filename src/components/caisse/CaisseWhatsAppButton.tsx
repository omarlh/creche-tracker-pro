
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
      const message = `Rapport de caisse du ${today}: Total ${totalJour.toFixed(2)} DH`;
      
      // Ensure the phone number is correctly formatted (removing any spaces or special characters)
      const formattedPhoneNumber = '00212664091486'.replace(/\s+/g, '');
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: formattedPhoneNumber,
          message
        }
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Le rapport a été envoyé avec succès par WhatsApp",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message WhatsApp",
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
