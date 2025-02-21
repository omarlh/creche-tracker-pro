
import { type Enfant } from "@/data/enfants";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface EnfantSearchResultProps {
  enfant: Enfant;
  onEdit: (enfant: Enfant) => void;
  onPrint: (enfant: Enfant) => void;
  calculerMontantRestant: (enfant: Enfant) => number;
}

export const EnfantSearchResult = ({
  enfant,
  onEdit,
  onPrint,
  calculerMontantRestant,
}: EnfantSearchResultProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Détails de l'enfant</CardTitle>
            <CardDescription>
              Informations complètes de {enfant.prenom} {enfant.nom}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onPrint(enfant)}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Informations personnelles</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Nom complet</dt>
                <dd className="font-medium">
                  {enfant.prenom} {enfant.nom}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Date de naissance</dt>
                <dd>
                  {new Date(enfant.dateNaissance || "").toLocaleDateString(
                    "fr-FR"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Classe</dt>
                <dd>{enfant.classe}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Année scolaire</dt>
                <dd>{enfant.anneeScolaire}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Statut</dt>
                <dd>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enfant.statut === "actif"
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {enfant.statut === "actif" ? "Actif" : "Inactif"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="font-medium mb-2">Contact et paiements</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">GSM Maman</dt>
                <dd>{enfant.gsmMaman || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">GSM Papa</dt>
                <dd>{enfant.gsmPapa || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Frais d'inscription
                </dt>
                <dd className="font-medium">
                  {enfant.fraisInscription?.montantPaye || 0} DH /{" "}
                  {enfant.fraisInscription?.montantTotal || 0} DH
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Reste à payer</dt>
                <dd className="font-medium text-warning">
                  {calculerMontantRestant(enfant)} DH
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  Dernier paiement
                </dt>
                <dd>
                  {enfant.dernierPaiement
                    ? new Date(enfant.dernierPaiement).toLocaleDateString("fr-FR")
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {enfant.fraisInscription?.paiements &&
          enfant.fraisInscription.paiements.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Historique des paiements</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {enfant.fraisInscription.paiements.map((paiement) => (
                    <div
                      key={paiement.id}
                      className="flex justify-between items-center"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{paiement.montant} DH</span>
                        <span className="text-muted-foreground">
                          {" "}
                          -{" "}
                          {new Date(paiement.datePaiement).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                        {paiement.methodePaiement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onEdit(enfant)}>
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

