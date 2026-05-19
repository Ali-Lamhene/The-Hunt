import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { createLobby } from '@/services/firebase/lobby.service';
import { ChevronLeft, Map as MapIcon, Maximize2, Minus, Plus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Camera, Circle as MapCircle, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

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

const { width: W, height: H } = Dimensions.get('window');

const NoiseTexture = () => (
  <View style={[StyleSheet.absoluteFill, { opacity: 0.12, zIndex: 1 }]} pointerEvents="none">
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Rect x="0" y="0" width="1" height="1" fill="#e8d5a3" />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
    </Svg>
  </View>
);

const ScannerLine = () => {
  const translateY = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: H,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.scannerLine,
        { transform: [{ translateY }] }
      ]}
    />
  );
};

interface StepperProps {
  label: string;
  value: number;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

// Stepper component for numerical inputs
const Stepper = ({ label, value, unit, onIncrease, onDecrease, min = -Infinity, max = Infinity }: StepperProps) => (
  <View style={styles.stepperContainer}>
    <ExpeditionText variant="mono" size="xs" style={styles.stepperLabel} numberOfLines={2}>{label}</ExpeditionText>
    <View style={styles.stepperControls}>
      <TouchableOpacity onPress={onDecrease} disabled={value <= min} style={[styles.stepBtn, value <= min && { opacity: 0.3 }]}>
        <Minus size={16} color="#e8d5a3" />
      </TouchableOpacity>
      <View style={styles.stepValueContainer}>
        <ExpeditionText variant="title" style={styles.stepValue}>
          {value} <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>{unit}</ExpeditionText>
        </ExpeditionText>
      </View>
      <TouchableOpacity onPress={onIncrease} disabled={value >= max} style={[styles.stepBtn, value >= max && { opacity: 0.3 }]}>
        <Plus size={16} color="#e8d5a3" />
      </TouchableOpacity>
    </View>
  </View>
);

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function CreateGameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const [radius, setRadius] = useState<number>(400);
  const [duration, setDuration] = useState<number>(60);
  const [players, setPlayers] = useState<number>(10);
  const [centerCoord, setCenterCoord] = useState<Coordinate | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [savedCamera, setSavedCamera] = useState<Camera | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const mapRef = useRef<MapView | null>(null);
  const bigMapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const newCoord = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const newRegion = {
          ...newCoord,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        };
        setCenterCoord(newCoord);
        setCurrentRegion(newRegion);
      } else {
        // Fallback if denied so it doesn't spin forever
        const fallback = { latitude: 48.8566, longitude: 2.3522 };
        setCenterCoord(fallback);
        setCurrentRegion({ ...fallback, latitudeDelta: 0.008, longitudeDelta: 0.008 });
      }
      setMapReady(true);
    })();
  }, []);

  const hunters = Math.ceil(players / 2);
  const preys = Math.floor(players / 2);
  const totalObjectives = players * 2;
  const timeReduction = ((duration - 15) / totalObjectives).toFixed(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleCreateLobby = async () => {
    if (!user || !centerCoord) return;
    setIsCreating(true);
    try {
      const lobbyId = await createLobby(user.id, user.username, {
        center: {
          latitude: centerCoord.latitude,
          longitude: centerCoord.longitude,
        },
        radius,
        durationMinutes: duration,
        maxPlayers: players,
      });
      router.push(`/lobby/${lobbyId}`);
    } catch (error: any) {
      console.error('Erreur de création de lobby:', error);
      alert('Impossible de générer le lobby: ' + (error?.message || 'Erreur réseau.'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/home-bg.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <View style={styles.veil} />
      <NoiseTexture />
      <ScannerLine />

      <Animated.View style={[styles.layout, { opacity: fadeAnim, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Navbar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="#e8d5a3" size={24} />
            <ExpeditionText variant="mono" size="xs" style={styles.backText}>RETOUR</ExpeditionText>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <ExpeditionText variant="title" style={styles.title} adjustsFontSizeToFit numberOfLines={1}>CONFIGURATION</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subtitle}>ZONE DE JEU · HÔTE UNIQUEMENT</ExpeditionText>
          </View>



          {/* Real Mini-map */}
          <View style={styles.mapContainer}>
            <View style={styles.mapBorder} />

            {!centerCoord || !currentRegion ? (
              <View style={{ width: '100%', height: 250, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(10, 15, 10, 0.4)' }}>
                <ActivityIndicator size="large" color="#c0392b" />
                <ExpeditionText variant="mono" size="xs" style={{ color: '#e8d5a3', marginTop: 16, letterSpacing: 2 }}>
                  ACQUISITION DU SIGNAL GPS...
                </ExpeditionText>
              </View>
            ) : (
              <>
                <MapView
                  ref={mapRef}
                  style={{ width: '100%', height: 250 }}
                  customMapStyle={tacticalMapStyle}
                  userInterfaceStyle="dark"
                  showsUserLocation={true}
                  showsMyLocationButton={false}
                  pitchEnabled={false}
                  toolbarEnabled={false}
                  scrollEnabled={true}
                  zoomEnabled={true}
                  initialRegion={currentRegion}
                  onMapReady={() => {
                    if (currentRegion) {
                      mapRef.current?.animateToRegion(currentRegion, 10);
                    }
                  }}
                  onRegionChangeComplete={(r) => setCurrentRegion(r)}
                >
                  <MapCircle
                    center={centerCoord}
                    radius={radius}
                    fillColor="rgba(192, 57, 43, 0.15)"
                    strokeColor="#c0392b"
                    strokeWidth={2}
                    zIndex={1}
                  />
                  {/* Point central */}
                  <MapCircle
                    center={centerCoord}
                    radius={15}
                    fillColor="#c0392b"
                    zIndex={2}
                  />
                </MapView>

                <TouchableOpacity
                  onPress={expandMap}
                  style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(10, 15, 10, 0.8)', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(232, 213, 163, 0.4)' }}
                >
                  <Maximize2 size={20} color="#e8d5a3" />
                </TouchableOpacity>
              </>
            )}

            <View style={styles.mapFooter}>
              <MapIcon size={14} color="#7a5c3a" style={{ marginRight: 8 }} />
              <ExpeditionText variant="mono" size="xs" style={{ color: '#7a5c3a' }}>
                ZONE CENTRÉE SUR VOTRE POSITION GPS
              </ExpeditionText>
            </View>
          </View>

          {/* Configuration Parameters */}
          <View style={styles.paramsSection}>
            <ExpeditionText variant="mono" size="xs" style={[styles.sectionTitle, { marginTop: 16 }]}>PARAMÈTRES DE LA TRAQUE</ExpeditionText>

            <Stepper
              label="RAYON DE LA ZONE"
              value={radius}
              unit="m"
              min={100}
              onIncrease={() => setRadius(r => r + 100)}
              onDecrease={() => setRadius(r => r - 100)}
            />
            <Stepper
              label="DURÉE DE LA PARTIE"
              value={duration}
              unit="min"
              min={20} max={120}
              onIncrease={() => setDuration(d => d + 10)}
              onDecrease={() => setDuration(d => d - 10)}
            />
            <Stepper
              label="NOMBRE DE JOUEURS"
              value={players}
              unit="joueurs"
              min={2} max={50}
              onIncrease={() => setPlayers(p => p + 1)}
              onDecrease={() => setPlayers(p => p - 1)}
            />
          </View>



          {/* Launch Button */}
          <View style={styles.launchArea}>
            {isCreating ? (
              <ActivityIndicator size="large" color="#e8d5a3" style={{ paddingVertical: 16 }} />
            ) : (
              <ExpeditionButton
                title="GÉNÉRER LE LOBBY"
                onPress={handleCreateLobby}
                variant="primary"
              />
            )}
          </View>

        </ScrollView>
      </Animated.View>

      {/* Fullscreen Map Overlay */}
      {isMapExpanded && centerCoord && currentRegion && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 999, backgroundColor: '#0d0802' }]}>
          <MapView
            ref={bigMapRef}
            style={StyleSheet.absoluteFillObject}
            customMapStyle={tacticalMapStyle}
            userInterfaceStyle="dark"
            showsUserLocation={true}
            showsMyLocationButton={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            initialCamera={savedCamera || undefined}
            initialRegion={!savedCamera ? currentRegion : undefined}
            onMapReady={() => {
              if (savedCamera) {
                bigMapRef.current?.animateCamera(savedCamera, { duration: 10 });
              } else if (currentRegion) {
                bigMapRef.current?.animateToRegion(currentRegion, 10);
              }
            }}
            onRegionChangeComplete={(r) => setCurrentRegion(r)}
          >
            <MapCircle
              center={centerCoord}
              radius={radius}
              fillColor="rgba(192, 57, 43, 0.15)"
              strokeColor="#c0392b"
              strokeWidth={2}
              zIndex={1}
            />
            <MapCircle
              center={centerCoord}
              radius={15}
              fillColor="#c0392b"
              zIndex={2}
            />
          </MapView>
          <NoiseTexture />
          <ScannerLine />

          <TouchableOpacity
            style={styles.closeMapBtn}
            onPress={closeMap}
          >
            <X size={24} color="#e8d5a3" />
          </TouchableOpacity>
          <View style={styles.expandedMapOverlay}>
            <ExpeditionText variant="mono" size="xs" style={{ color: '#e8d5a3', textAlign: 'center', marginBottom: 16 }}>
              MODE ANALYSE TACTIQUE
            </ExpeditionText>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <TouchableOpacity
                onPress={() => setRadius(r => Math.max(100, r - 100))}
                disabled={radius <= 100}
                style={[styles.stepBtn, { backgroundColor: 'rgba(192, 57, 43, 0.4)' }, radius <= 100 && { opacity: 0.3 }]}
              >
                <Minus size={24} color="#e8d5a3" />
              </TouchableOpacity>

              <View style={styles.stepValueContainer}>
                <ExpeditionText variant="title" style={{ color: '#c0392b', textAlign: 'center', fontSize: 36, lineHeight: 36, includeFontPadding: false, paddingTop: 8 }}>
                  {radius} <ExpeditionText variant="mono" size="xs" style={{ color: '#e8d5a3' }}>m</ExpeditionText>
                </ExpeditionText>
              </View>

              <TouchableOpacity
                onPress={() => setRadius(r => r + 100)}
                style={[styles.stepBtn, { backgroundColor: 'rgba(192, 57, 43, 0.4)' }]}
              >
                <Plus size={24} color="#e8d5a3" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0802',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 9, 7, 0.7)',
  },
  layout: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scannerLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(90, 112, 82, 0.4)',
    shadowColor: '#5a7052',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 50,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    color: '#e8d5a3',
    marginLeft: 4,
    letterSpacing: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    color: '#e8d5a3',
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    paddingTop: 16,
    paddingBottom: 8,
    includeFontPadding: false,
    lineHeight: 52,
  },
  subtitle: {
    color: '#5a6854',
    letterSpacing: 4,
    marginTop: -4,
  },
  sectionTitle: {
    color: '#7a5c3a',
    letterSpacing: 3,
    marginBottom: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.15)',
    alignItems: 'center',
    borderRadius: 4,
  },
  modeTabActive: {
    backgroundColor: '#e8d5a3',
    borderColor: '#e8d5a3',
  },
  modeTabText: {
    fontSize: 20,
    color: '#e8d5a3',
    letterSpacing: 4,
    paddingTop: 4,
    lineHeight: 20,
    includeFontPadding: false,
  },
  modeTabTextActive: {
    color: '#1a0e05',
  },
  mapContainer: {
    backgroundColor: 'rgba(10, 15, 10, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(90, 112, 82, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.1)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(90, 112, 82, 0.2)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  paramsSection: {
    marginBottom: 24,
  },
  stepperContainer: {
    backgroundColor: 'rgba(232, 213, 163, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.08)',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    color: '#e8d5a3',
    opacity: 0.8,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(192, 57, 43, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValueContainer: {
    minWidth: 80,
    alignItems: 'center',
  },
  stepValue: {
    fontSize: 32,
    color: '#e8d5a3',
    paddingTop: 8,
    lineHeight: 32,
    includeFontPadding: false,
  },

  launchArea: {
    width: '100%',
  },
  closeMapBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(10, 15, 10, 0.8)',
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.4)',
    zIndex: 100,
  },
  expandedMapOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(10, 15, 10, 0.8)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.2)',
    zIndex: 100,
  }
});
