
export const getMoisIndex = (moisNom: string, mois: string[]): number => {
  const moisIndex = mois.findIndex(m => m.toLowerCase() === moisNom.toLowerCase());
  return moisIndex < 4 ? moisIndex + 9 : moisIndex - 3;
};

export const getFormattedMoisConcerne = (anneeScolaire: string, moisNom: string, mois: string[]) => {
  const moisIndex = getMoisIndex(moisNom, mois);
  const [anneeDebut, anneeFin] = anneeScolaire.split('-');
  const annee = moisIndex >= 9 ? anneeDebut : anneeFin;
  return `${annee}-${String(moisIndex + 1).padStart(2, '0')}`;
};
