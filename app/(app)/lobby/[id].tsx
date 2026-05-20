import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useLobby } from '@/hooks/useLobby';
import { joinLobby, leaveLobby, toggleReady, updateLobbyStatus, updatePlayerLocation } from '@/services/firebase/lobby.service';
import RadarBackground from '@/components/lobby/RadarBackground';
import PlayerList from '@/components/lobby/PlayerList';
import LobbyQrCode from '@/components/lobby/LobbyQrCode';
import { ChevronLeft, Maximize2, X, Play } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import MapView, { Marker, Circle as MapCircle } from '@/components/ui/MapViewWrapper';
import * as Location from 'expo-location';

const tacticalMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a2d1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7a5c3a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0802" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#2d6a4f" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1a2d1a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#162216" }] },
  { featureType: "poi", elementType: "labels.text", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#3d5c3a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2d6a4f" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d0802" }] }
];

export default function LobbyScreen() {
  const { id: lobbyId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const { lobby, loading, error } = useLobby(lobbyId);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const bigMapRef = useRef<MapView | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [savedCamera, setSavedCamera] = useState<any>(null);
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);

  const expandMap = async () => {
    if (mapRef.current) {
      const cam = await mapRef.current.getCamera();
      setSavedCamera(cam);
    }
    setIsMapExpanded(true);
  };

  const closeMap = async () => {
    if (bigMapRef.current) {
      const cam = await bigMapRef.current.getCamera();
      mapRef.current?.animateCamera(cam, { duration: 0 });
    }
    setIsMapExpanded(false);
  };

  // Suivi GPS en temps réel de l'utilisateur connecté
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 5,
          },
          async (loc) => {
            if (lobbyId && user) {
              await updatePlayerLocation(lobbyId, user.id, {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });
            }
          }
        );
      } catch (err) {
        console.error("Erreur de géolocalisation :", err);
      }
    }

    if (lobbyId && user && lobby) {
      startTracking();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [lobbyId, user, !!lobby]);

  // Centrer automatiquement la carte tactique sur les paramètres du lobby
  useEffect(() => {
    if (lobby?.params?.center && mapRef.current) {
      const region = {
        latitude: lobby.params.center.latitude,
        longitude: lobby.params.center.longitude,
        latitudeDelta: (lobby.params.radius * 2.2) / 111320,
        longitudeDelta: (lobby.params.radius * 2.2) / (111320 * Math.cos(lobby.params.center.latitude * (Math.PI / 180))),
      };
      mapRef.current.animateToRegion(region, 500);
    }
  }, [lobby?.params?.center?.latitude, lobby?.params?.center?.longitude, lobby?.params?.radius]);

  // Calcule des coordonnées de markers stables pour les agents sans GPS actif (simulation)
  const getPlayerCoordinate = (playerId: string, player: any, center: { latitude: number; longitude: number }, radiusMeters: number) => {
    if (player?.location) {
      return player.location;
    }

    // Hash simple de l'ID du joueur pour générer un point déterministe fixe dans le dôme de jeu
    let hash = 0;
    for (let i = 0; i < playerId.length; i++) {
      hash = playerId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const radiusInDegrees = radiusMeters / 111320;
    const angle = Math.abs(hash % 360) * (Math.PI / 180);
    // Positionné aléatoirement entre 15% et 65% du rayon max pour éviter de sortir
    const r = (Math.abs((hash >> 8) % 100) / 100) * radiusInDegrees * 0.5 + radiusInDegrees * 0.15;

    const dLat = r * Math.sin(angle);
    const dLon = (r * Math.cos(angle)) / Math.cos(center.latitude * (Math.PI / 180));

    return {
      latitude: center.latitude + dLat,
      longitude: center.longitude + dLon,
    };
  };

  // Rejoindre automatiquement le lobby si on n'est pas dedans
  useEffect(() => {
    if (!lobby || !user || !lobbyId) return;

    const isPlayerInLobby = !!lobby.players?.[user.id];
    if (!isPlayerInLobby) {
      joinLobby(lobbyId, user.id, user.username).catch((err) => {
        Alert.alert('Erreur', err.message || 'Impossible de rejoindre le lobby.');
        router.replace('/(app)/create');
      });
    }
  }, [lobby, user, lobbyId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <RadarBackground />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#e8d5a3" />
          <ExpeditionText variant="mono" size="xs" style={styles.loadingText}>
            SYNCHRONISATION TERMINAL TACTIQUE...
          </ExpeditionText>
        </View>
      </View>
    );
  }

  if (error || !lobby) {
    return (
      <View style={styles.loadingContainer}>
        <RadarBackground />
        <View style={styles.loadingContent}>
          <ExpeditionText variant="mono" size="sm" style={styles.errorText}>
            ERREUR : LOBBY INTROUVABLE OU DISSOUT
          </ExpeditionText>
          <TouchableOpacity style={styles.btnBack} onPress={() => router.replace('/')}>
            <ExpeditionText variant="mono" size="xs" style={styles.btnBackText}>
              RETOUR AU QG
            </ExpeditionText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isHost = lobby.hostId === user?.id;
  const myPlayer = lobby.players?.[user?.id || ''];
  const playersArray = Object.values(lobby.players || {});
  const allReady = playersArray.every((p) => p.isReady);
  const playersNeeded = Math.max(0, lobby.params.maxPlayers - playersArray.length);

  const handleLeaveLobby = () => {
    setIsLeaveModalVisible(true);
  };

  const confirmLeaveLobby = async () => {
    if (!lobbyId || !user) return;
    setIsLeaveModalVisible(false);
    setIsActionLoading(true);
    try {
      await leaveLobby(lobbyId, user.id);
      router.replace('/');
    } catch (err) {
      console.error(err);
      setIsActionLoading(false);
    }
  };

  const handleToggleReady = async () => {
    if (!lobbyId || !user || !myPlayer) return;
    try {
      await toggleReady(lobbyId, user.id, !myPlayer.isReady);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier votre statut.');
    }
  };





  const handleStartGame = async () => {
    if (!lobbyId || !isHost) return;
    if (playersNeeded > 0) {
      Alert.alert('Lancement impossible', `Il manque encore ${playersNeeded} agent(s) pour initier la traque.`);
      return;
    }
    if (!allReady) {
      Alert.alert('Lancement impossible', 'Tous les agents doivent être prêts.');
      return;
    }
    
    setIsActionLoading(true);
    try {
      await updateLobbyStatus(lobbyId, 'starting');
      Alert.alert('Succès', 'Lancement de la traque !');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de lancer la partie.');
      setIsActionLoading(false);
    }
  };

  return (
    <RadarBackground>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        
        {/* Header / Nav */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleLeaveLobby} style={styles.backButton} disabled={isActionLoading}>
            <ChevronLeft color="#e8d5a3" size={24} />
            <ExpeditionText variant="mono" size="xs" style={styles.backText}>QUITTER LE LOBBY</ExpeditionText>
          </TouchableOpacity>
          <View style={styles.lobbyIndicator}>
            <ExpeditionText variant="mono" size="xs" style={styles.lobbyIndicatorText}>
              AGENT : {myPlayer?.displayName?.toUpperCase() || 'INCONNU'}
            </ExpeditionText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Titre Tactique */}
          <View style={styles.header}>
            <ExpeditionText variant="title" style={styles.title}>SALLE D'ATTENTE</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subtitle}>PRÉPARATION DE LA PROCHAINE EXPÉDITION</ExpeditionText>
          </View>

          {/* Statut d'acquisition des agents */}
          <View style={styles.statusBanner}>
            <View style={[styles.statusIndicator, playersNeeded > 0 ? styles.statusWarning : styles.statusSuccess]}>
              <View style={[styles.statusDot, playersNeeded > 0 ? styles.dotWarning : styles.dotSuccess]} />
              <ExpeditionText variant="mono" size="xs" style={playersNeeded > 0 ? styles.statusTextWarning : styles.statusTextSuccess}>
                {playersNeeded > 0 
                  ? `IL MANQUE ${playersNeeded} J.`
                  : "TOUS LES JOUEURS SONT LÀ"
                }
              </ExpeditionText>
            </View>
          </View>

          {/* Bouton de démarrage rectangulaire minimaliste au centre, en dessous du bandeau */}
          {isHost && (
            <View style={styles.topLaunchBtnContainer}>
              <TouchableOpacity
                onPress={handleStartGame}
                disabled={playersNeeded > 0 || isActionLoading}
                style={[styles.tacticalBarBtn, playersNeeded > 0 ? styles.barDisabled : styles.barActive]}
                activeOpacity={0.7}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color="#e8d5a3" />
                ) : (
                  <ExpeditionText variant="mono" size="xs" style={[styles.barText, playersNeeded > 0 ? styles.barTextDisabled : styles.barTextActive]}>
                    {playersNeeded > 0 ? "INITIATION VERROUILLÉE" : "DÉMARRER L'EXPÉDITION"}
                  </ExpeditionText>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* QR Code de Salon pour inviter / rejoindre */}
          {lobbyId && (
            <LobbyQrCode lobbyId={lobbyId} />
          )}

          {/* Résumé tactique des paramètres déjà configurés */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>RAYON ZONE</ExpeditionText>
                <ExpeditionText variant="title" style={styles.summaryValue}>
                  {lobby.params.radius} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>M</ExpeditionText>
                </ExpeditionText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>DURÉE</ExpeditionText>
                <ExpeditionText variant="title" style={styles.summaryValue}>
                  {lobby.params.durationMinutes} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>MIN</ExpeditionText>
                </ExpeditionText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>JOUEURS MAX</ExpeditionText>
                <ExpeditionText variant="title" style={styles.summaryValue}>
                  {lobby.params.maxPlayers} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>MAX</ExpeditionText>
                </ExpeditionText>
              </View>
            </View>
          </View>

          {/* Carte tactique de la zone et des joueurs */}
          <View style={styles.mapContainer}>
            <ExpeditionText variant="mono" size="xs" style={styles.mapTitle}>
              /// RADAR GPS DE LA ZONE
            </ExpeditionText>
            <View style={styles.mapWrapper}>
              <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={tacticalMapStyle}
                userInterfaceStyle="dark"
                showsUserLocation={false}
                showsMyLocationButton={false}
                pitchEnabled={false}
                toolbarEnabled={false}
                scrollEnabled={true}
                zoomEnabled={true}
                initialRegion={{
                  latitude: lobby.params.center.latitude,
                  longitude: lobby.params.center.longitude,
                  latitudeDelta: (lobby.params.radius * 2.2) / 111320,
                  longitudeDelta: (lobby.params.radius * 2.2) / (111320 * Math.cos(lobby.params.center.latitude * (Math.PI / 180))),
                }}
              >
                {/* Dôme / Périmètre de la zone de jeu */}
                <MapCircle
                  center={lobby.params.center}
                  radius={lobby.params.radius}
                  fillColor="rgba(192, 57, 43, 0.12)"
                  strokeColor="#c0392b"
                  strokeWidth={1.5}
                  zIndex={1}
                />
                
                {/* Point central de la traque */}
                <MapCircle
                  center={lobby.params.center}
                  radius={6}
                  fillColor="#c0392b"
                  zIndex={2}
                />

                {/* Localisation et marqueurs de tous les agents du lobby */}
                {Object.entries(lobby.players || {}).map(([playerId, p]) => {
                  const coords = getPlayerCoordinate(playerId, p, lobby.params.center, lobby.params.radius);
                  const isMe = playerId === user?.id;

                  return (
                    <Marker
                      key={playerId}
                      coordinate={coords}
                      anchor={{ x: 0.5, y: 0.5 }}
                    >
                      <View style={styles.customMarker}>
                        <View style={[styles.markerDot, isMe && styles.markerDotMe]} />
                        <View style={styles.markerLabel}>
                          <ExpeditionText variant="mono" style={styles.markerText}>
                            {p.displayName}
                          </ExpeditionText>
                        </View>
                      </View>
                    </Marker>
                  );
                })}
              </MapView>
              <TouchableOpacity
                onPress={expandMap}
                style={styles.expandButton}
              >
                <Maximize2 size={16} color="#e8d5a3" />
              </TouchableOpacity>
            </View>
          </View>


          {/* Connected Players */}
          <PlayerList players={lobby.players} hostId={lobby.hostId} currentUserId={user?.id || ''} />

          {/* Action Button Area */}
          {!isHost && (
            <View style={styles.actionContainer}>
              <ExpeditionButton
                title={myPlayer?.isReady ? "✓ AGENT PRÊT" : "CONFIRMER DISPONIBILITÉ"}
                onPress={handleToggleReady}
                variant={myPlayer?.isReady ? "secondary" : "primary"}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Fullscreen Map Overlay */}
      {isMapExpanded && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 999, backgroundColor: '#0d0802' }]}>
          <MapView
            ref={bigMapRef}
            style={StyleSheet.absoluteFillObject}
            customMapStyle={tacticalMapStyle}
            userInterfaceStyle="dark"
            showsUserLocation={false}
            showsMyLocationButton={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            initialCamera={savedCamera || undefined}
            initialRegion={!savedCamera ? {
              latitude: lobby.params.center.latitude,
              longitude: lobby.params.center.longitude,
              latitudeDelta: (lobby.params.radius * 2.2) / 111320,
              longitudeDelta: (lobby.params.radius * 2.2) / (111320 * Math.cos(lobby.params.center.latitude * (Math.PI / 180))),
            } : undefined}
            onMapReady={() => {
              if (savedCamera) {
                bigMapRef.current?.animateCamera(savedCamera, { duration: 10 });
              }
            }}
          >
            {/* Dôme / Périmètre de la zone de jeu */}
            <MapCircle
              center={lobby.params.center}
              radius={lobby.params.radius}
              fillColor="rgba(192, 57, 43, 0.12)"
              strokeColor="#c0392b"
              strokeWidth={1.5}
              zIndex={1}
            />
            
            {/* Point central de la traque */}
            <MapCircle
              center={lobby.params.center}
              radius={6}
              fillColor="#c0392b"
              zIndex={2}
            />

            {/* Localisation et marqueurs de tous les agents du lobby */}
            {Object.entries(lobby.players || {}).map(([playerId, p]) => {
              const coords = getPlayerCoordinate(playerId, p, lobby.params.center, lobby.params.radius);
              const isMe = playerId === user?.id;

              return (
                <Marker
                  key={playerId}
                  coordinate={coords}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <View style={styles.customMarker}>
                    <View style={[styles.markerDot, isMe && styles.markerDotMe]} />
                    <View style={styles.markerLabel}>
                      <ExpeditionText variant="mono" style={styles.markerText}>
                        {p.displayName}
                      </ExpeditionText>
                    </View>
                  </View>
                </Marker>
              );
            })}
          </MapView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeMapBtn}
            onPress={closeMap}
          >
            <X size={24} color="#e8d5a3" />
          </TouchableOpacity>

          {/* Panel Overlay affichant les règles / paramètres de la traque */}
          <View style={[styles.expandedMapOverlay, { bottom: insets.bottom + 20 }]}>
            <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a', textAlign: 'center', marginBottom: 12, letterSpacing: 1.5 }}>
              /// PARAMÈTRES DE LA TRAQUE HORS-LIMITE
            </ExpeditionText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>RAYON ZONE</ExpeditionText>
                <ExpeditionText variant="title" style={{ color: '#e8d5a3', fontSize: 20 }}>
                  {lobby.params.radius} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>M</ExpeditionText>
                </ExpeditionText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>DURÉE</ExpeditionText>
                <ExpeditionText variant="title" style={{ color: '#e8d5a3', fontSize: 20 }}>
                  {lobby.params.durationMinutes} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>MIN</ExpeditionText>
                </ExpeditionText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <ExpeditionText variant="mono" style={styles.summaryLabel}>JOUEURS MAX</ExpeditionText>
                <ExpeditionText variant="title" style={{ color: '#e8d5a3', fontSize: 20 }}>
                  {lobby.params.maxPlayers} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>MAX</ExpeditionText>
                </ExpeditionText>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Modale de confirmation de sortie tactile haut-de-gamme */}
      <Modal
        visible={isLeaveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLeaveModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalBackdrop}>
          <RadarBackground>
            <View style={styles.modalContainer}>
              <View style={styles.modalTextBox}>
                <ExpeditionText variant="mono" size="xs" style={styles.modalHeader}>
                  /// ALERTE SYSTÈME
                </ExpeditionText>
                <ExpeditionText variant="title" style={styles.modalTitle}>
                  ABANDONNER LA MISSION
                </ExpeditionText>
                
                <View style={styles.modalTextDivider} />

                <ExpeditionText variant="mono" size="xs" style={styles.modalMessage}>
                  {isHost
                    ? "En quittant, le contrôle du lobby sera transmis au joueur connecté suivant. Le lobby sera définitivement supprimé si vous êtes le dernier agent actif."
                    : "Êtes-vous sûr de vouloir interrompre votre connexion avec ce salon tactique et retourner au QG ?"}
                </ExpeditionText>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalBtnCancel]} 
                    onPress={() => setIsLeaveModalVisible(false)}
                  >
                    <ExpeditionText variant="mono" size="xs" style={styles.modalBtnCancelText}>
                      RESTER
                    </ExpeditionText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.modalBtnConfirm]} 
                    onPress={confirmLeaveLobby}
                  >
                    <ExpeditionText variant="mono" size="xs" style={styles.modalBtnConfirmText}>
                      CONFIRMER
                    </ExpeditionText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </RadarBackground>
        </View>
      </Modal>
    </RadarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    position: 'absolute',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#e8d5a3',
    letterSpacing: 2,
    textAlign: 'center',
  },
  errorText: {
    color: '#c0392b',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 20,
  },
  btnBack: {
    borderWidth: 1,
    borderColor: '#c0392b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: 'rgba(192, 57, 43, 0.08)',
  },
  btnBackText: {
    color: '#c0392b',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 48,
    marginTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#e8d5a3',
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  lobbyIndicator: {
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lobbyIndicatorText: {
    color: '#e8d5a3',
    opacity: 0.9,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    color: '#e8d5a3',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#7a5c3a',
    letterSpacing: 2,
    marginTop: 4,
  },

  actionContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  mapTitle: {
    color: '#7a5c3a',
    letterSpacing: 2,
    marginBottom: 8,
  },
  mapWrapper: {
    height: 220,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.08)',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7a5c3a',
    borderWidth: 1.5,
    borderColor: '#e8d5a3',
  },
  markerDotMe: {
    backgroundColor: '#c0392b',
    borderColor: '#e8d5a3',
    transform: [{ scale: 1.2 }],
  },
  markerLabel: {
    backgroundColor: 'rgba(13, 8, 2, 0.88)',
    borderWidth: 0.5,
    borderColor: 'rgba(232, 213, 163, 0.2)',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  markerText: {
    color: '#e8d5a3',
    fontSize: 9,
  },
  summaryContainer: {
    marginHorizontal: 20,
    marginTop: 4,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13, 18, 14, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.08)',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#7a5c3a',
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#e8d5a3',
    fontSize: 16,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(232, 213, 163, 0.08)',
  },
  expandButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(13, 18, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.15)',
    borderRadius: 4,
    padding: 6,
    zIndex: 10,
  },
  closeMapBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(13, 18, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.15)',
    borderRadius: 4,
    padding: 10,
    zIndex: 1000,
  },
  expandedMapOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(13, 18, 14, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.15)',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  tacticalBarBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  barActive: {
    backgroundColor: 'rgba(192, 57, 43, 0.12)',
    borderColor: '#c0392b',
  },
  barDisabled: {
    backgroundColor: 'rgba(13, 18, 14, 0.4)',
    borderColor: 'rgba(232, 213, 163, 0.08)',
  },
  barText: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  barTextActive: {
    color: '#e8d5a3',
  },
  barTextDisabled: {
    color: 'rgba(232, 213, 163, 0.2)',
  },
  statusBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusWarning: {
    borderColor: 'rgba(122, 92, 58, 0.3)',
    backgroundColor: 'rgba(122, 92, 58, 0.04)',
  },
  statusSuccess: {
    borderColor: 'rgba(45, 106, 79, 0.4)',
    backgroundColor: 'rgba(45, 106, 79, 0.05)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotWarning: {
    backgroundColor: '#7a5c3a',
    shadowColor: '#7a5c3a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  dotSuccess: {
    backgroundColor: '#2d6a4f',
    shadowColor: '#2d6a4f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  statusTextWarning: {
    color: '#7a5c3a',
    letterSpacing: 1,
    fontSize: 10,
  },
  statusTextSuccess: {
    color: '#2d6a4f',
    letterSpacing: 1,
    fontWeight: 'bold',
    fontSize: 10,
  },
  topLaunchBtnContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#0d0802',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  modalTextBox: {
    backgroundColor: 'rgba(232, 213, 163, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.1)',
    borderRadius: 4,
    padding: 20,
  },
  modalTextDivider: {
    height: 1,
    backgroundColor: 'rgba(232, 213, 163, 0.08)',
    marginVertical: 16,
  },
  modalHeader: {
    color: '#7a5c3a',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  modalTitle: {
    color: '#e8d5a3',
    fontSize: 18,
    marginBottom: 0,
  },
  modalMessage: {
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(232, 213, 163, 0.15)',
  },
  modalBtnConfirm: {
    backgroundColor: 'rgba(192, 57, 43, 0.12)',
    borderColor: '#c0392b',
  },
  modalBtnCancelText: {
    color: '#e8d5a3',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalBtnConfirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
