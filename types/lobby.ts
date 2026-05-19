export type LobbyStatus = 'waiting' | 'ready' | 'starting';

export interface Player {
  displayName: string;
  role: 'hunter' | 'runner' | 'undecided';
  isReady: boolean;
  joinedAt: number;
  location?: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LobbyParams {
  center: Location;
  radius: number; // en mètres
  durationMinutes: number;
  maxPlayers: number;
}

export interface Lobby {
  id?: string; // Optionnel lors de la lecture/écriture Firebase
  hostId: string;
  status: LobbyStatus;
  params: LobbyParams;
  players: Record<string, Player>;
  createdAt: number;
}
