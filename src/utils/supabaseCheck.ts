
import supabase from '@/lib/supabase';

/**
 * Utility per verificare la connessione a Supabase
 * @returns Promise che si risolve con true se la connessione è attiva
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error("Errore durante la verifica della connessione a Supabase:", error.message);
      return false;
    }
    console.log("Connessione a Supabase verificata con successo");
    return true;
  } catch (err) {
    console.error("Errore durante la verifica della connessione a Supabase:", err);
    return false;
  }
};

// Esegui la verifica all'avvio dell'applicazione
checkSupabaseConnection().then(isConnected => {
  if (!isConnected) {
    console.warn("Attenzione: La connessione a Supabase non è attiva. Alcune funzionalità potrebbero non funzionare correttamente.");
  }
});
