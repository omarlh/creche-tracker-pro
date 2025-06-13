
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppSender } from "@/hooks/communication/useWhatsAppSender";
import type { Enfant } from "@/types/enfant.types";

interface CommunicationWhatsAppButtonProps {
  enfants: Enfant[];
  className?: string;
}

export function CommunicationWhatsAppButton({
  enfants,
  className,
}: CommunicationWhatsAppButtonProps) {
  const { getValidNumbers } = useWhatsAppSender();
  
  // Filtre uniquement les enfants avec au moins un numéro de téléphone valide
  const filteredEnfants = enfants.filter(
    (enfant) => enfant.gsmMaman?.trim() || enfant.gsmPapa?.trim()
  );
  
  const contactsCount = getValidNumbers(filteredEnfants).length;

  const handleWhatsAppClick = () => {
    const validNumbers = getValidNumbers(filteredEnfants);
    
    if (validNumbers.length === 0) {
      return;
    }

    // Si un seul numéro, ouvrir directement WhatsApp
    if (validNumbers.length === 1) {
      const formattedNumber = validNumbers[0].replace(/\s+/g, '').replace(/[^\d+]/g, '');
      const whatsappNumber = formattedNumber.startsWith('+') ? formattedNumber.substring(1) : formattedNumber;
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
      return;
    }

    // Si plusieurs numéros, ouvrir WhatsApp Web avec le premier numéro
    // L'utilisateur peut ensuite naviguer vers les autres contacts
    const firstNumber = validNumbers[0].replace(/\s+/g, '').replace(/[^\d+]/g, '');
    const whatsappNumber = firstNumber.startsWith('+') ? firstNumber.substring(1) : firstNumber;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <Button
      className={className}
      disabled={contactsCount === 0}
      title={contactsCount === 0 ? "Aucun contact disponible" : "Ouvrir WhatsApp"}
      onClick={handleWhatsAppClick}
      variant="whatsapp"
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      WhatsApp ({contactsCount})
    </Button>
  );
}
