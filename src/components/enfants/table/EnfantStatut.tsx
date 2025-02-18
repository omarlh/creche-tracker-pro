
import { type Enfant } from "@/data/enfants";

interface EnfantStatutProps {
  statut: Enfant["statut"];
}

export const EnfantStatut = ({ statut }: EnfantStatutProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statut === "actif"
          ? "bg-success/10 text-success"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {statut === "actif" ? "Actif" : "Inactif"}
    </span>
  );
};
