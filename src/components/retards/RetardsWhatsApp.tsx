
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { RetardPaiement } from "./RetardsTable";

interface RetardsWhatsAppProps {
  retard: RetardPaiement;
}

export function RetardsWhatsApp({ retard }: RetardsWhatsAppProps) {
  const { toast } = useToast();

  const handleSendWhatsApp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: retard.telephone, // We'll need to add this to the RetardPaiement type
          message: `Bonjour, nous vous rappelons que le paiement de ${retard.montantDu} DH pour ${retard.enfantPrenom} ${retard.enfantNom} est en retard de ${retard.joursRetard} jours. Merci de régulariser la situation dès que possible.`,
        }
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: `Un message WhatsApp a été envoyé concernant ${retard.enfantPrenom} ${retard.enfantNom}`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message WhatsApp",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSendWhatsApp}
      className="text-green-600 hover:text-green-700"
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
  );
}

