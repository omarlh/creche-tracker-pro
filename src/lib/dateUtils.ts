
export const getCurrentSchoolYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // Janvier est 0, Décembre est 11

  // L'année scolaire commence en septembre
  if (month >= 8) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const getMoisAnneeScolaire = (anneeScolaire: string) => {
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return mois;
};
