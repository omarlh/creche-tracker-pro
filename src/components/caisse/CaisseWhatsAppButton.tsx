
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CaisseWhatsAppButtonProps {
  mensualites: number;
  inscriptions: number;
}

export function CaisseWhatsAppButton({ mensualites, inscriptions }: CaisseWhatsAppButtonProps) {
  const { toast } = useToast();
  const total = mensualites + inscriptions;

  const handleSendWhatsApp = async () => {
    try {
      const message = `Caisse de ce jour:\n` + 
        `Mensualités: ${mensualites} DH\n` +
        `Frais d'inscription: ${inscriptions} DH\n` +
        `Total: ${total} DH`;

      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: "0664091486",
          message
        }
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Le récapitulatif de caisse a été envoyé par WhatsApp",
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
