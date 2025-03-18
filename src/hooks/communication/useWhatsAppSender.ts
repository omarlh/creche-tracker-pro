
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useWhatsAppSender() {
  const [isSending, setIsSending] = useState(false);

  const getValidNumbers = (enfants: Array<{ gsmMaman?: string; gsmPapa?: string }>) => {
    const numbers: string[] = [];
    
    enfants.forEach((enfant) => {
      // Ajouter le numéro de la maman s'il existe
      if (enfant.gsmMaman && enfant.gsmMaman.trim() !== "") {
        const formattedNumber = enfant.gsmMaman
          .replace(/\s+/g, "")
          .replace(/[^\d+]/g, "");
        
        if (!numbers.includes(formattedNumber)) {
          numbers.push(formattedNumber);
        }
      }
      
      // Ajouter le numéro du papa s'il existe
      if (enfant.gsmPapa && enfant.gsmPapa.trim() !== "") {
        const formattedNumber = enfant.gsmPapa
          .replace(/\s+/g, "")
          .replace(/[^\d+]/g, "");
        
        if (!numbers.includes(formattedNumber)) {
          numbers.push(formattedNumber);
        }
      }
    });
    
    return numbers;
  };
  
  const sendWhatsAppMessages = async (message: string, enfants: Array<{ gsmMaman?: string; gsmPapa?: string }>) => {
    if (!message.trim()) {
      toast.error("Veuillez saisir un message");
      return { success: false };
    }
    
    const validNumbers = getValidNumbers(enfants);
    
    if (validNumbers.length === 0) {
      toast.error("Aucun numéro valide trouvé");
      return { success: false };
    }
    
    setIsSending(true);
    const toastId = toast.loading(`Envoi de messages à ${validNumbers.length} contact(s)...`);
    
    try {
      let successCount = 0;
      let failCount = 0;
      let errorMessages: string[] = [];
      let hasAuthError = false;
      
      // Envoyer des messages à tous les numéros valides
      for (const number of validNumbers) {
        try {
          console.log(`Envoi de message à ${number}`);
          
          const { data, error } = await supabase.functions.invoke('send-whatsapp', {
            body: {
              to: number,
              message: message
            }
          });
          
          if (error) {
            console.error("Erreur lors de l'envoi au numéro", number, error);
            failCount++;
            errorMessages.push(`${number}: ${error.message}`);
          } else if (data && !data.success) {
            console.error("Erreur retournée par la fonction", number, data);
            failCount++;
            errorMessages.push(`${number}: ${data.error || "Erreur inconnue"}`);
            
            // Check for auth errors to report them only once
            if (data.error && data.error.includes('token')) {
              hasAuthError = true;
            }
          } else {
            console.log("Message envoyé avec succès au numéro", number, data);
            successCount++;
          }
          
          // If we've encountered an auth error, stop trying with other numbers
          if (hasAuthError) {
            break;
          }
        } catch (err) {
          console.error("Exception lors de l'envoi au numéro", number, err);
          failCount++;
          errorMessages.push(`${number}: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
        }
        
        // Petite pause entre les envois pour éviter des limitations d'API
        if (!hasAuthError) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // If there's an auth error, show it prominently
      if (hasAuthError) {
        toast.error("Problème d'authentification avec l'API WhatsApp. Veuillez contacter l'administrateur.", {
          id: toastId,
          duration: 8000
        });
        return { success: false };
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} message(s) envoyé(s) avec succès`, {
          id: toastId
        });
      }
      
      if (failCount > 0 && !hasAuthError) {
        toast.error(`Échec de l'envoi pour ${failCount} contact(s): ${errorMessages.slice(0, 3).join(', ')}${errorMessages.length > 3 ? '...' : ''}`, {
          id: toastId,
          duration: 5000
        });
      }
      
      return { success: successCount > 0 };
    } catch (error) {
      console.error("Erreur globale lors de l'envoi des messages", error);
      toast.error(`Une erreur est survenue: ${error instanceof Error ? error.message : "Erreur inconnue"}`, {
        id: toastId
      });
      return { success: false };
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    sendWhatsAppMessages,
    getValidNumbers
  };
}
