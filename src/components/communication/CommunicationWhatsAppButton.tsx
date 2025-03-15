
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WhatsAppMessageDialog } from "./WhatsAppMessageDialog";
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
  const [open, setOpen] = useState(false);
  const { getValidNumbers } = useWhatsAppSender();
  
  // Filtre uniquement les enfants avec au moins un numéro de téléphone valide
  const filteredEnfants = enfants.filter(
    (enfant) => enfant.gsmMaman?.trim() || enfant.gsmPapa?.trim()
  );
  
  const contactsCount = getValidNumbers(filteredEnfants).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={className}
          disabled={contactsCount === 0}
          title={contactsCount === 0 ? "Aucun contact disponible" : ""}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp ({contactsCount})
        </Button>
      </DialogTrigger>
      <WhatsAppMessageDialog 
        open={open}
        onOpenChange={setOpen}
        enfants={filteredEnfants}
      />
    </Dialog>
  );
}
