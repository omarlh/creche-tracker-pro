
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CaisseWhatsAppButtonProps {
  totalJour: number;
}

export function CaisseWhatsAppButton({ totalJour }: CaisseWhatsAppButtonProps) {
  const { toast } = useToast();

  const handleSendWhatsApp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: "212664091486",
          message: `Total recette de la journée: ${totalJour} DH`,
        }
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Le résumé de la caisse a été envoyé par WhatsApp",
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
