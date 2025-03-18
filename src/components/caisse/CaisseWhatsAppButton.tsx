
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
    
    let toastId: string | undefined;
    
    try {
      setIsSending(true);
      toastId = toast.loading("Envoi du message WhatsApp en cours...");
      
      const today = new Date().toLocaleDateString('fr-FR');
      const message = `La recette d'aujourd'hui est de ${totalJour.toFixed(2)} DH`;
      
      // Utiliser le numéro fixe 212664091486
      const phoneNumber = "212664091486";
      
      console.log(`Envoi du message WhatsApp à ${phoneNumber}: ${message}`);
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: phoneNumber,
          message
        }
      });

      if (error) {
        console.error('Erreur de fonction Supabase:', error);
        toast.error(`Échec de l'appel à la fonction: ${error.message}`, { id: toastId });
        return;
      }

      if (data && !data.success) {
        console.error('Erreur API WhatsApp:', data.error, data.details);
        
        if (data.error && data.error.includes('token')) {
          toast.error(
            `Problème d'authentification avec l'API WhatsApp. Veuillez contacter l'administrateur.`, 
            { id: toastId, duration: 8000 }
          );
        } else if (data.error) {
          toast.error(data.error, { id: toastId, duration: 5000 });
        } else {
          toast.error(`Échec de l'envoi du message WhatsApp`, { id: toastId });
        }
        return;
      }

      console.log('Réponse d\'envoi WhatsApp:', data);

      toast.success("Le rapport a été envoyé avec succès par WhatsApp", {
        id: toastId
      });
    } catch (e) {
      console.error('Exception lors de l\'appel de la fonction Edge:', e);
      toast.error(`Erreur lors de l'appel de la fonction: ${e instanceof Error ? e.message : 'Erreur inconnue'}`, {
        id: toastId
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
