import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ImageBackground, Animated, Dimensions } from 'react-native';
import Svg, { Rect, Pattern, Defs } from 'react-native-svg';

const { height: H } = Dimensions.get('window');

// Texture de bruit tactique à points (Partagée avec la Home et Création)
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

// Ligne laser de balayage vert armée (Partagée avec la Home et Création)
const ScannerLine = () => {
  const translateY = useRef(new Animated.Value(0)).current;

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

interface RadarBackgroundProps {
  children?: React.ReactNode;
}

/**
 * Wrapper de fond d'écran unifié réutilisant EXACTEMENT le fond "Bitume & Végétation" (home-bg.png),
 * le voile d'ombrage, la texture de points sable et la ligne de scan animée.
 */
export default function RadarBackground({ children }: RadarBackgroundProps) {
  return (
    <ImageBackground
      source={require('@/assets/images/lobby-bg.png')}
      style={styles.root}
      resizeMode="cover"
    >
      {/* Voile sombre pour lisibilité */}
      <View style={styles.veil} />
      
      {/* Texture grain de bruit */}
      <NoiseTexture />
      
      {/* Ligne laser animée */}
      <ScannerLine />

      {/* Contenu principal de l'application (Totalement cliquable et scrollable) */}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0e1210',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 6, 5, 0.86)', // Voile sombre renforcé pour une meilleure lisibilité
  },
  content: {
    flex: 1,
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
});
