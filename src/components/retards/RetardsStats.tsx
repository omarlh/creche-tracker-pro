
interface RetardsStatsProps {
  totalRetards: number;
  montantTotal: number;
  moyenneJours: number;
}

export const RetardsStats = ({ totalRetards, montantTotal, moyenneJours }: RetardsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Total des retards
        </h3>
        <p className="text-2xl font-semibold">{totalRetards}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Montant total dû
        </h3>
        <p className="text-2xl font-semibold">
          {montantTotal} DH
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Retard moyen
        </h3>
        <p className="text-2xl font-semibold">
          {moyenneJours} jours
        </p>
      </div>
    </div>
  );
};
