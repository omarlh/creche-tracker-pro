
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
  // Mois de l'année scolaire dans l'ordre (septembre à juin)
  const mois = [
    "Septembre", "Octobre", "Novembre", "Décembre",
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  return mois;
};

// Convertir un mois (nom) et une année scolaire en date YYYY-MM
export const moisVersDate = (mois: string, anneeScolaire: string): string => {
  const moisIndex = ["Septembre", "Octobre", "Novembre", "Décembre", 
                     "Janvier", "Février", "Mars", "Avril", "Mai", "Juin"].indexOf(mois);
  
  if (moisIndex === -1) return "";
  
  const [anneeDebut, anneeFin] = anneeScolaire.split('-');
  const annee = moisIndex <= 3 ? anneeDebut : anneeFin;
  const moisNum = moisIndex <= 3 ? moisIndex + 9 : moisIndex - 3;
  
  return `${annee}-${moisNum.toString().padStart(2, '0')}`;
};
