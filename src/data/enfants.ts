
import { create } from 'zustand';
import type { Enfant } from '@/types/enfant.types';
import { 
  fetchEnfantsFromDB,
  addEnfantToDB,
  updateEnfantInDB,
  deleteEnfantFromDB,
} from '@/services/enfantService';

type EnfantStore = {
  enfants: Enfant[];
  fetchEnfants: () => Promise<void>;
  ajouterEnfant: (enfant: Omit<Enfant, "id">) => Promise<void>;
  modifierEnfant: (enfant: Enfant) => Promise<void>;
  supprimerEnfant: (id: number) => Promise<void>;
  saveEnfants: () => Promise<void>;
};

export const useEnfantStore = create<EnfantStore>((set, get) => ({
  enfants: [],
  
  fetchEnfants: async () => {
    try {
      console.log("Fetching enfants from Supabase...");
      const formattedEnfants = await fetchEnfantsFromDB();
      console.log("Fetched enfants:", formattedEnfants);
      set({ enfants: formattedEnfants });
    } catch (error) {
      console.error("Error in fetchEnfants:", error);
      // Set empty array to prevent undefined issues
      set({ enfants: [] });
    }
  },

  ajouterEnfant: async (enfant) => {
    try {
      console.log("Adding new enfant:", enfant);
      await addEnfantToDB(enfant);
      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in ajouterEnfant:", error);
      throw error;
    }
  },

  modifierEnfant: async (enfant) => {
    try {
      console.log("Updating enfant:", enfant);
      await updateEnfantInDB(enfant);
      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in modifierEnfant:", error);
      throw error;
    }
  },

  supprimerEnfant: async (id) => {
    try {
      console.log("Deleting enfant:", id);
      await deleteEnfantFromDB(id);
      const store = useEnfantStore.getState();
      await store.fetchEnfants();
    } catch (error) {
      console.error("Error in supprimerEnfant:", error);
      throw error;
    }
  },

  saveEnfants: async () => {
    const { enfants } = get();
    try {
      for (const enfant of enfants) {
        await updateEnfantInDB(enfant);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des enfants:", error);
      throw error;
    }
  }
}));

// Re-export types from types file for backward compatibility
export type { Classe, Enfant, PaiementFraisInscription } from '@/types/enfant.types';
