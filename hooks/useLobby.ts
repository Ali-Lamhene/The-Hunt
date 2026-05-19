import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../services/firebase/config';
import { Lobby } from '../types/lobby';

/**
 * Hook personnalisé pour s'abonner aux données en temps réel d'un lobby spécifique.
 * Gère automatiquement la connexion, la mise à jour et la désinscription.
 */
export function useLobby(lobbyId: string | undefined) {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lobbyId) {
      setLobby(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const lobbyRef = ref(database, `lobbies/${lobbyId}`);

    // Écoute en temps réel de la Realtime Database
    const unsubscribe = onValue(
      lobbyRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Lobby;
          // Injection de l'ID pour faciliter son utilisation dans l'UI
          setLobby({ ...data, id: lobbyId });
        } else {
          setLobby(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Erreur d'écoute sur le lobby ${lobbyId}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    // Nettoyage de l'écouteur à la désinscription du composant
    return () => {
      unsubscribe();
    };
  }, [lobbyId]);

  return {
    lobby,
    loading,
    error,
  };
}
