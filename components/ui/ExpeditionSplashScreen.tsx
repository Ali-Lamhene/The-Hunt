import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, ImageBackground, Dimensions } from 'react-native';
import { ExpeditionText } from './ExpeditionText';
import Svg, { Circle, Line, Path, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface ExpeditionSplashScreenProps {
  onAnimationComplete: () => void;
}

const LOADING_STEPS = [
  "INITIALIZING TRACKING PROTOCOLS...",
  "ESTABLISHING SECURE SATELLITE LINK...",
  "SYNCING GPS COORDINATES...",
];

export function ExpeditionSplashScreen({ onAnimationComplete }: ExpeditionSplashScreenProps) {
  const [status, setStatus] = useState(LOADING_STEPS[0]);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Progression de 10 secondes
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // Transition douce vers l'app
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(onAnimationComplete);
      }, 100);
    });

    // Rotation des messages
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        setStatus(LOADING_STEPS[step]);
      } else {
        clearInterval(interval);
      }
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground 
        source={require('@/assets/images/splash-bg.png')} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          
          {/* L'image splash-bg contient déjà le logo central parfaitement intégré. */}
          {/* On se contente d'ajouter l'UI interactive en bas. */}
          <View style={styles.bottomSection}>
            <View style={styles.titleWrapper}>
              <ExpeditionText variant="title" style={styles.title}>THE HUNT</ExpeditionText>
            </View>

            <View style={styles.loaderArea}>
              <ExpeditionText variant="mono" size="xs" style={styles.statusText}>{status}</ExpeditionText>
              <View style={styles.loaderTrack}>
                <Animated.View style={[styles.loaderFill, { width: progressWidth }]} />
              </View>
              <ExpeditionText variant="mono" size="xs" style={styles.version}>v1.0.4 // SECURE_LINK</ExpeditionText>
            </View>
          </View>
          
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0d0802',
    zIndex: 1000,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Assombrissement minimal
    justifyContent: 'flex-end', // On plaque tout le contenu vers le bas
    alignItems: 'center',
    paddingBottom: height * 0.1, // Marge par rapport au bas de l'écran
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 72,
    color: "#e8d5a3",
    letterSpacing: 12,
    lineHeight: 85,
    paddingVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  subtitle: {
    color: '#7a5c3a',
    letterSpacing: 5,
    fontSize: 9,
    marginTop: -5,
  },
  loaderArea: {
    width: '85%',
    alignItems: 'center',
  },
  loaderTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(232, 213, 163, 0.1)',
    borderRadius: 2,
    marginVertical: 15,
    overflow: 'hidden',
  },
  loaderFill: {
    height: '100%',
    backgroundColor: '#c0392b',
    shadowColor: '#c0392b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  statusText: {
    color: '#e8d5a3',
    letterSpacing: 2,
    fontSize: 10,
  },
  version: {
    color: '#7a5c3a',
    fontSize: 9,
    opacity: 0.5,
    letterSpacing: 3,
  }
});
