
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CaisseWhatsAppButtonProps {
  totalJour: number;
}

export function CaisseWhatsAppButton({ totalJour }: CaisseWhatsAppButtonProps) {
  const { toast } = useToast();

  const sendWhatsAppMessage = async () => {
    try {
      const today = new Date().toLocaleDateString('fr-FR');
      const message = `Rapport de caisse du ${today}: Total ${totalJour} DH`;
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: '00212664091486',
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
    }
  };

  return (
    <Button onClick={sendWhatsAppMessage} variant="whatsapp" size="sm">
      <MessageSquare className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
  );
}
