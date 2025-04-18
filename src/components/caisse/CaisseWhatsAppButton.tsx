
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CaisseWhatsAppButtonProps {
  totalJour: number;
}

export function CaisseWhatsAppButton({ totalJour }: CaisseWhatsAppButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const sendWhatsAppMessage = async () => {
    if (isSending) return;
    
    let toastId: string | number;
    
    try {
      setIsSending(true);
      setErrorDetails(null);
      toastId = toast.loading("Envoi du message WhatsApp en cours...");
      
      const phoneNumber = "212664091486"; // Numéro de destination
      
      console.log(`Envoi du message WhatsApp à ${phoneNumber}: ${message}`);
      
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: phoneNumber,
          message
        }
      });

      if (error) {
        console.error('Erreur de fonction Supabase:', error);
        toast.error(`Échec de l'appel à la fonction: ${error.message}`, { id: toastId, duration: 7000 });
        setErrorDetails(`Détails de l'erreur: ${JSON.stringify(error)}`);
        return;
      }

      if (data && !data.success) {
        console.error('Erreur API WhatsApp:', data.error, data.details);
        
        if (data.error && data.error.includes('token')) {
          toast.error(
            `Problème d'authentification avec l'API WhatsApp. Veuillez contacter l'administrateur pour vérifier la configuration de WHATSAPP_TOKEN.`, 
            { id: toastId, duration: 10000 }
          );
          setErrorDetails(`Détails: ${JSON.stringify(data.details || {})}`);
        } else if (data.error) {
          toast.error(data.error, { id: toastId, duration: 7000 });
          setErrorDetails(`Détails: ${JSON.stringify(data.details || {})}`);
        } else {
          toast.error(`Échec de l'envoi du message WhatsApp`, { id: toastId, duration: 5000 });
        }
        return;
      }

      console.log('Réponse d\'envoi WhatsApp:', data);

      toast.success("Le message a été envoyé avec succès par WhatsApp", {
        id: toastId,
        duration: 5000
      });
      
      setIsDialogOpen(false);
      setMessage("");
    } catch (e) {
      console.error('Exception lors de l\'appel de la fonction Edge:', e);
      toast.error(`Erreur lors de l'appel de la fonction: ${e instanceof Error ? e.message : 'Erreur inconnue'}`, {
        id: toastId,
        duration: 7000
      });
      setErrorDetails(`Exception: ${e instanceof Error ? e.stack : 'Détails non disponibles'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenDialog = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    setMessage(`La recette d'aujourd'hui (${today}) est de ${totalJour.toFixed(2)} DH`);
    setErrorDetails(null);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleOpenDialog}
        variant="whatsapp" 
        size="sm"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envoyer un message WhatsApp</DialogTitle>
            <DialogDescription>
              Le message sera envoyé au numéro de téléphone fixe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Votre message</Label>
              <Textarea
                id="message"
                placeholder="Saisissez votre message ici..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            {errorDetails && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 whitespace-pre-wrap">
                <p className="font-semibold mb-1">Informations de débogage:</p>
                {errorDetails}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={sendWhatsAppMessage}
              disabled={isSending || !message.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
