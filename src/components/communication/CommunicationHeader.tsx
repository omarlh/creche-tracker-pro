
import { MessageCircle } from "lucide-react";

export function CommunicationHeader() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-semibold tracking-tight">
          Communication avec les parents
        </h1>
      </div>
      <p className="text-muted-foreground mt-2">
        Recherchez et contactez les parents par enfant, classe ou année scolaire
      </p>
    </div>
  );
}
