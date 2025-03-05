
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

export const getMoisAnneeScolaire = () => {
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

// Convertir un mois et une année en index du mois dans l'année scolaire (0-9)
export const getMonthIndexInSchoolYear = (month: number, year: number, schoolYear: string): number => {
  const [startYear, endYear] = schoolYear.split('-').map(y => parseInt(y));
  
  // September (8) to December (11) of startYear
  if (year === startYear && month >= 8 && month <= 11) {
    return month - 8;
  }
  // January (0) to June (5) of endYear
  else if (year === endYear && month >= 0 && month <= 5) {
    return month + 4; // January is 4, February is 5, etc.
  }
  
  return -1; // Not in this school year
};

// Get the correct date range for a school year
export const getSchoolYearDateRange = (schoolYear: string): { start: Date; end: Date } => {
  const [startYear, endYear] = schoolYear.split('-').map(y => parseInt(y));
  
  const startDate = new Date(startYear, 8, 1); // September 1st of startYear
  const endDate = new Date(endYear, 5, 30); // June 30th of endYear
  
  return { start: startDate, end: endDate };
};

// Check if a date is within a school year
export const isDateInSchoolYear = (date: Date, schoolYear: string): boolean => {
  const { start, end } = getSchoolYearDateRange(schoolYear);
  return date >= start && date <= end;
};
