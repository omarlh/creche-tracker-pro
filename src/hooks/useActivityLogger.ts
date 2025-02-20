
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useActivityLogger = () => {
  const location = useLocation();

  const logActivity = async (action: string, page: string, details?: any) => {
    try {
      const { error } = await supabase
        .from('logs_utilisation')
        .insert([
          {
            action,
            page,
            details
          }
        ]);

      if (error) {
        console.error('Erreur lors de l\'enregistrement du log:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  };

  useEffect(() => {
    // Log la navigation vers une nouvelle page
    logActivity('navigation', location.pathname);
  }, [location.pathname]);

  return { logActivity };
};
