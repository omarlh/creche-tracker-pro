
import { Phone, MessageSquare, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Enfant } from "@/types/enfant.types";
import { toast } from 'sonner';

interface CommunicationTableActionsProps {
  enfant: Enfant;
}

export function CommunicationTableActions({ enfant }: CommunicationTableActionsProps) {
  // Détermine le numéro à utiliser (préfère maman, puis papa)
  const phoneNumber = enfant.gsmMaman || enfant.gsmPapa;
  
  const makePhoneCall = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber.replace(/\s/g, '')}`);
    } else {
      toast.error("Aucun numéro de téléphone disponible");
    }
  };
  
  const openWhatsApp = () => {
    if (phoneNumber) {
      // Formatage du numéro pour WhatsApp (retirer les espaces et autres caractères)
      const formattedNumber = phoneNumber.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      window.open(`https://wa.me/${formattedNumber.startsWith('+') ? formattedNumber.substring(1) : formattedNumber}`);
    } else {
      toast.error("Aucun numéro de téléphone disponible");
    }
  };
  
  const copyToClipboard = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      toast.success("Numéro copié dans le presse-papier");
    } else {
      toast.error("Aucun numéro de téléphone disponible");
    }
  };

  if (!phoneNumber) {
    return <div className="text-gray-400">Aucun numéro</div>;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={makePhoneCall}>
              <Phone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Appeler</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={openWhatsApp}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>WhatsApp</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
