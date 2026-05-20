import { ref, push, set, update, remove, get } from 'firebase/database';
import { database } from './config';
import { Lobby, LobbyParams, Player, LobbyStatus } from '../../types/lobby';

/**
 * Génère un identifiant unique à 6 chiffres pour un nouveau lobby.
 */
async function generateUniqueLobbyId(): Promise<string> {
  let isUnique = false;
  let code = '';
  while (!isUnique) {
    // Génère un code à 6 chiffres
    code = Math.floor(100000 + Math.random() * 900000).toString();
    const lobbyRef = ref(database, `lobbies/${code}`);
    const snapshot = await get(lobbyRef);
    if (!snapshot.exists()) {
      isUnique = true;
    }
  }
  return code;
}

/**
 * Crée un nouveau lobby dans la base de données et y ajoute le créateur (host) comme premier joueur.
 */
export async function createLobby(
  hostId: string,
  hostName: string,
  initialParams: LobbyParams
): Promise<string> {
  const lobbyId = await generateUniqueLobbyId();
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);

  const hostPlayer: Player = {
    displayName: hostName,
    role: 'undecided',
    isReady: true, // Le créateur est prêt par défaut
    joinedAt: Date.now(),
  };

  const newLobby: Lobby = {
    hostId,
    status: 'waiting',
    params: initialParams,
    players: {
      [hostId]: hostPlayer,
    },
    createdAt: Date.now(),
  };

  await set(lobbyRef, newLobby);
  return lobbyId;
}

/**
 * Permet à un joueur de rejoindre un lobby existant.
 */
export async function joinLobby(
  lobbyId: string,
  userId: string,
  displayName: string
): Promise<void> {
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  const snapshot = await get(lobbyRef);

  if (!snapshot.exists()) {
    throw new Error('Le lobby demandé n\'existe pas.');
  }

  const lobbyData = snapshot.val() as Lobby;
  
  // Vérification de la capacité max
  const currentPlayersCount = Object.keys(lobbyData.players || {}).length;
  if (currentPlayersCount >= lobbyData.params.maxPlayers) {
    throw new Error('Ce lobby a atteint sa capacité maximale.');
  }

  const playerRef = ref(database, `lobbies/${lobbyId}/players/${userId}`);
  const newPlayer: Player = {
    displayName,
    role: 'undecided',
    isReady: false,
    joinedAt: Date.now(),
  };

  await set(playerRef, newPlayer);
}

/**
 * Permet à un joueur de quitter un lobby.
 * Si le joueur était le host, on peut soit transférer le rôle de host, soit supprimer le lobby.
 */
export async function leaveLobby(lobbyId: string, userId: string): Promise<void> {
  const lobbyRef = ref(database, `lobbies/${lobbyId}`);
  const snapshot = await get(lobbyRef);

  if (!snapshot.exists()) return;

  const lobby = snapshot.val() as Lobby;
  const playerIds = Object.keys(lobby.players || {});

  // Si c'est le dernier joueur, on supprime le lobby
  if (playerIds.length <= 1) {
    await remove(lobbyRef);
    return;
  }

  // Si le partant est le host, on transfère la responsabilité au joueur suivant
  if (lobby.hostId === userId) {
    const nextHostId = playerIds.find((id) => id !== userId);
    if (nextHostId) {
      await update(lobbyRef, { hostId: nextHostId });
    }
  }

  // Supprime le joueur
  const playerRef = ref(database, `lobbies/${lobbyId}/players/${userId}`);
  await remove(playerRef);
}

/**
 * Change l'état de préparation d'un joueur (Prêt / Pas prêt).
 */
export async function toggleReady(
  lobbyId: string,
  userId: string,
  isReady: boolean
): Promise<void> {
  const readyRef = ref(database, `lobbies/${lobbyId}/players/${userId}/isReady`);
  await set(readyRef, isReady);
}

/**
 * Modifie le rôle d'un joueur dans la partie (Hunter / Runner / Undecided).
 */
export async function updatePlayerRole(
  lobbyId: string,
  userId: string,
  role: Player['role']
): Promise<void> {
  const roleRef = ref(database, `lobbies/${lobbyId}/players/${userId}/role`);
  await set(roleRef, role);
}

/**
 * Met à jour les paramètres de la partie (uniquement par le host).
 */
export async function updateLobbyParams(
  lobbyId: string,
  newParams: Partial<LobbyParams>
): Promise<void> {
  const paramsRef = ref(database, `lobbies/${lobbyId}/params`);
  await update(paramsRef, newParams);
}

/**
 * Change le statut global du lobby (waiting -> starting -> ...).
 */
export async function updateLobbyStatus(
  lobbyId: string,
  status: LobbyStatus
): Promise<void> {
  const statusRef = ref(database, `lobbies/${lobbyId}/status`);
  await set(statusRef, status);
}

/**
 * Met à jour la position GPS d'un joueur en temps réel dans le lobby.
 */
export async function updatePlayerLocation(
  lobbyId: string,
  userId: string,
  location: { latitude: number; longitude: number }
): Promise<void> {
  const locRef = ref(database, `lobbies/${lobbyId}/players/${userId}/location`);
  await set(locRef, location);
}
