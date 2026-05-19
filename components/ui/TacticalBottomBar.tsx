import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  Alert,
  Vibration,
  Easing,
  Platform,
  LayoutAnimation,
  UIManager,
  LayoutChangeEvent,
  Switch,
} from 'react-native';

// Activation des LayoutAnimations expérimentales sur le thread UI natif d'Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Line, Rect, Circle, Path, Defs, Pattern } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg); // Force le moteur graphique à redessiner le canevas SVG selon la hauteur animée !
import * as Haptics from 'expo-haptics';
import { Fingerprint, X } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { joinLobby } from '@/services/firebase/lobby.service';
import { ExpeditionText } from './ExpeditionText';

const { width: W, height: H } = Dimensions.get('window');

export default function TacticalBottomBar() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'menu' | 'join' | 'settings'>('menu');
  
  // États des réglages
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  
  // Code de salon (PIN)
  const [pinCode, setPinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLaserAnim = useRef(new Animated.Value(0)).current;

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const borderOpacity = useRef(new Animated.Value(0)).current;
  const radarPulse = useRef(new Animated.Value(0)).current; // Variable d'onde radar pulsante continue
  const rippleScale = useRef(new Animated.Value(0.1)).current; // Échelle de l'onde de choc de déverrouillage
  const rippleOpacity = useRef(new Animated.Value(0)).current; // Opacité de l'onde de choc de déverrouillage

  // Animations d'apparition progressive (Staggered Menu Items)
  const item1Opacity = useRef(new Animated.Value(0)).current;
  const item2Opacity = useRef(new Animated.Value(0)).current;
  const item3Opacity = useRef(new Animated.Value(0)).current;
  const item4Opacity = useRef(new Animated.Value(0)).current;

  const item1Y = useRef(new Animated.Value(15)).current;
  const item2Y = useRef(new Animated.Value(15)).current;
  const item3Y = useRef(new Animated.Value(15)).current;
  const item4Y = useRef(new Animated.Value(15)).current;
  const subViewAnim = useRef(new Animated.Value(1)).current; // Transition cinématique entre les sous-vues du HUD
  const heightAnim = useRef(new Animated.Value(300)).current; // Hauteur animée fluide du tiroir HUD (modalContent)

  // Charger les réglages au démarrage
  useEffect(() => {
    async function loadSettings() {
      try {
        const storedLang = await AsyncStorage.getItem('@the_hunt_language');
        const storedSound = await AsyncStorage.getItem('@the_hunt_sound');
        const storedHaptic = await AsyncStorage.getItem('@the_hunt_haptic');
        
        if (storedLang) setLanguage(storedLang as 'FR' | 'EN');
        if (storedSound) setSoundEnabled(storedSound === 'ON');
        if (storedHaptic) setHapticEnabled(storedHaptic === 'ON');
      } catch (err) {
        console.error('Erreur chargement réglages:', err);
      }
    }
    loadSettings();
  }, []);

  // Calibrer la hauteur initiale du tiroir dès la réception des insets de sécurité
  useEffect(() => {
    heightAnim.setValue(278 + insets.bottom);
  }, [insets.bottom]);

  // Animations : Pulsation d'empreinte + Balayage laser vertical continu
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLaserAnim, {
          toValue: 56, // Descend sur toute la hauteur de l'icône
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLaserAnim, {
          toValue: 0, // Remonte
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Lancement de la pulsation radar continue lorsque le menu est ouvert
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isMenuOpen) {
      anim = Animated.loop(
        Animated.timing(radarPulse, {
          toValue: 1,
          duration: 3500, // Temps de rotation d'une onde complète
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      anim.start();
    } else {
      radarPulse.setValue(0);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [isMenuOpen]);

  // Déclencher automatiquement les animations d'ouverture au montage du tiroir tactique
  useEffect(() => {
    if (isMenuOpen) {
      startOpenAnimations();
    }
  }, [isMenuOpen]);

  // Déclencher le retour haptique
  const triggerHaptic = () => {
    if (hapticEnabled) {
      if (Platform.OS !== 'web') {
        if (Haptics && typeof Haptics.impactAsync === 'function') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
            Vibration.vibrate(15);
          });
        } else {
          Vibration.vibrate(15);
        }
      } else {
        // Fallback de vibration HTML5 si supporté par le navigateur
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(15);
        }
      }
    }
  };

  // Déclencher les animations d'ouverture UNE FOIS la modale montée à l'écran (onShow)
  // Résout définitivement la race condition de rendu sur mobile !
  const startOpenAnimations = () => {
    // Étape 1 : L'onde d'obsidienne démarre immédiatement (100% stable sur Native Driver flat)
    Animated.timing(circleScale, {
      toValue: 15,
      duration: 1100, // Ralenti pour un déploiement solennel
      easing: Easing.inOut(Easing.quad), // Démarre très doucement, s'accélère au milieu, freine doucement à la fin !
      useNativeDriver: true,
    }).start();

    // Étape 2 : Le voile d'arrière-plan démarre après 100ms
    setTimeout(() => {
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.quad), // Fondu en courbe douce
        useNativeDriver: true,
      }).start();
    }, 100);

    // Étape 3 : Les bordures dorées démarrent après 480ms (lorsque l'onde circulaire touche physiquement les bords)
    setTimeout(() => {
      Animated.timing(borderOpacity, {
        toValue: 1,
        duration: 500, // Apparition plus rapide et synchrone
        easing: Easing.out(Easing.quad), // Courbe d'atténuation rapide
        useNativeDriver: false, // Doit être JS-driven pour cohabiter avec heightAnim sur le même conteneur
      }).start();
    }, 480);

    // Étape 4 : Les boutons du menu jaillissent en cascade dès t = 350ms (pendant que l'onde termine son expansion)
    // Structure plate insensible au bug de compilation native stagger/delay de React Native !
    setTimeout(() => {
      // Bouton 1 (Ligne de titre / séparateur)
      Animated.parallel([
        Animated.timing(item1Opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(item1Y, { toValue: 0, friction: 8, tension: 25, useNativeDriver: true }),
      ]).start();

      // Bouton 2 (Rejoindre) à t = 350 + 120ms
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(item2Opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(item2Y, { toValue: 0, friction: 8, tension: 25, useNativeDriver: true }),
        ]).start();
      }, 120);

      // Bouton 3 (Créer) à t = 350 + 240ms
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(item3Opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(item3Y, { toValue: 0, friction: 8, tension: 25, useNativeDriver: true }),
        ]).start();
      }, 240);

      // Bouton 4 (Paramètres) à t = 350 + 360ms
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(item4Opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(item4Y, { toValue: 0, friction: 8, tension: 25, useNativeDriver: true }),
        ]).start();
      }, 360);
    }, 350);
  };

  // Déclencher une double-impulsion haptique asymétrique physique (loquet mécanique d'ouverture)
  const triggerUnlockHaptic = () => {
    if (hapticEnabled) {
      if (Platform.OS === 'android') {
        // loquet mécanique physique d'une console d'expédition
        Vibration.vibrate([0, 12, 65, 80]);
      } else {
        // Émulation iOS douce du double pulse asymétrique
        Vibration.vibrate(12);
        setTimeout(() => {
          Vibration.vibrate(30);
        }, 65);
      }
    }
  };

  // Ouvrir la console de commande (Déverrouillage Biométrique avec transition circulaire)
  const openMenu = () => {
    // 1. Déclencher le double click physique haptique
    triggerUnlockHaptic();

    // 2. Accélération instantanée du balayage laser (Scan Complete)
    Animated.timing(scanLaserAnim, {
      toValue: 66,
      duration: 180,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();

    // 3. Lancer l'onde de choc circulaire (Ripple tactique)
    rippleScale.setValue(0.7);
    rippleOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 3.5,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Réinitialiser instantanément les valeurs d'entrée
    circleScale.setValue(0.01);
    borderOpacity.setValue(0);
    backdropOpacity.setValue(0);
    item1Opacity.setValue(0);
    item2Opacity.setValue(0);
    item3Opacity.setValue(0);
    item4Opacity.setValue(0);
    item1Y.setValue(15);
    item2Y.setValue(15);
    item3Y.setValue(15);
    item4Y.setValue(15);
    subViewAnim.setValue(1); // Réinitialise l'opacité de transition à 100% au montage
    heightAnim.setValue(278 + insets.bottom); // Réinitialise le conteneur à sa hauteur nominale de départ

    // 5. Lancer l'ouverture du tiroir de façon immédiate et ultra-réactive !
    setIsMenuOpen(true);
    setActiveSubView('menu');
  };

  // Transition animée de type glissement holographique avec ajustement de hauteur fluide du tiroir HUD
  const changeSubView = (newView: 'menu' | 'join' | 'settings') => {
    triggerHaptic();
    Animated.timing(subViewAnim, {
      toValue: 0,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setActiveSubView(newView);
    });
  };

  // Handler de Layout dynamique : mesure en temps réel la hauteur naturelle de la sous-vue active et l'anime de façon organique !
  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      Animated.spring(heightAnim, {
        toValue: height,
        friction: 8.5,
        tension: 32,
        useNativeDriver: false,
      }).start();
    }
  };

  // Force le déclenchement de l'animation d'entrée uniquement APRÈS le montage effectif de la vue par React
  useEffect(() => {
    if (isMenuOpen) {
      subViewAnim.setValue(0); // Force le départ à l'opacité 0 et Y=10
      Animated.timing(subViewAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [activeSubView]);

  // Fermer la console de commande (Dissolution plus lente)
  const closeMenu = () => {
    triggerHaptic();
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(borderOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false, // Doit être JS-driven pour cohabiter avec heightAnim sur le même conteneur
      }),
      Animated.timing(item1Opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(item2Opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(item3Opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(item4Opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setIsMenuOpen(false);
      setPinCode('');
    });
  };

  // Sauvegarder un réglage
  const saveSetting = async (key: string, value: string) => {
    triggerHaptic();
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.error(err);
    }
  };

  // Saisie de code PIN virtuel
  const handlePressKey = (char: string) => {
    triggerHaptic();
    if (char === 'CLR') {
      setPinCode('');
    } else if (char === 'DEL') {
      setPinCode(prev => prev.slice(0, -1));
    } else {
      if (pinCode.length < 6) {
        setPinCode(prev => prev + char);
      }
    }
  };

  // Validation et Connexion
  const handleValidateJoin = async () => {
    triggerHaptic();
    if (pinCode.length < 3) {
      Alert.alert(
        language === 'FR' ? 'CANAL INVALIDE' : 'INVALID CODE',
        language === 'FR' ? 'Le code saisi est trop court.' : 'Code is too short.'
      );
      return;
    }
    if (!user) return;

    setIsJoining(true);
    const targetLobby = pinCode.trim().toLowerCase();
    try {
      await joinLobby(targetLobby, user.id, user.username);
      closeMenu();
      router.push(`/lobby/${targetLobby}`);
    } catch (err: any) {
      Alert.alert(
        language === 'FR' ? 'IDENTIFICATION IMPOSSIBLE' : 'AUTHENTICATION FAILED',
        err.message || (language === 'FR' ? 'Ce salon d\'expédition est introuvable ou saturé.' : 'Requested lobby not found or full.')
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Hauteur dynamique sécurisée Android / iOS Safe Area
  const dynamicBottomPadding = insets.bottom > 0 ? insets.bottom + 8 : 16;

  return (
    <>
      <View style={[styles.navContainer, { bottom: dynamicBottomPadding }]}>
      
      {/* Support de console compact (Biometric verification bracket) */}
      <View style={styles.biometricPod}>
        {/* Latitude à gauche avec LED verte */}
        <View style={styles.bracketSide}>
          <View style={styles.ledDotGreen} />
          <ExpeditionText variant="mono" style={styles.coordinateText}>48.8566° N</ExpeditionText>
        </View>

        {/* Espaceur invisible de 80px pour laisser passer l'empreinte digitale centrale */}
        <View style={{ width: 80 }} />

        {/* Longitude à droite avec LED verte également */}
        <View style={styles.bracketSide}>
          <ExpeditionText variant="mono" style={styles.coordinateText}>2.3522° E</ExpeditionText>
          <View style={styles.ledDotGreen} />
        </View>
      </View>

      {/* L'onde de choc circulaire / Ripple de déverrouillage tactile */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.scannerRipple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          }
        ]}
      />

      {/* --- BOUTON DE SCANNER D'EMPREINTE DIGITAL MASSIF --- */}
      {/* Placé en dehors du pod pour un centrage absolu mathématique parfait sur l'écran */}
      <Animated.View style={[styles.scannerBtnWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          onPress={openMenu}
          activeOpacity={0.85}
          style={styles.scannerBtn}
        >
          {/* Anneau lumineux externe */}
          <View style={styles.scannerInnerCircle}>
            <Fingerprint size={38} color="#e8d5a3" style={styles.fingerIcon} />
            
            {/* Ligne laser néon animée de balayage vertical */}
            <Animated.View
              style={[
                styles.laserScanLine,
                { transform: [{ translateY: scanLaserAnim }] }
              ]}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>

    {isMenuOpen && (
      <View style={[StyleSheet.absoluteFillObject, { zIndex: 10000, elevation: 20 }]} pointerEvents="box-none">
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: 'rgba(4, 6, 5, 0.15)',
                opacity: backdropOpacity,
              }
            ]}
          />
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={closeMenu} activeOpacity={1} />
          <Animated.View style={[
            styles.modalContent,
            {
              height: heightAnim, // Liaison directe à la valeur de hauteur animée
              marginBottom: 0,
              shadowOpacity: borderOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }),
              elevation: borderOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
            }
          ]}>
            
            {/* L'arrière-plan circulaire qui grandit (Morphing expand circle depuis l'empreinte) */}
            <Animated.View
              style={[
                styles.expandCircle,
                {
                  bottom: dynamicBottomPadding - 8, // Remonté encore de 10px pour un centrage parfait !
                  transform: [{ scale: circleScale }]
                }
              ]}
            />

            {/* L'overlay technologique (Bordures, Grille, LED) qui fade-in pendant l'expansion de l'onde */}
            <Animated.View
              style={[StyleSheet.absoluteFillObject, { opacity: borderOpacity }]}
              pointerEvents="none"
            >
              {/* Cadre de bordure dorée */}
              <View style={styles.modalBorderFrame} />

              {/* 1. Texture de grain phosphorescent CRT fixe pré-carrelée (Hauteur maximale fixe pour éliminer le popping et la latence) */}
              <Svg width="100%" height={750} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <Defs>
                  {/* Texture de grain d'oscilloscope analogique phosphorescent rétro */}
                  <Pattern id="sonarGrain" width="4" height="4" patternUnits="userSpaceOnUse">
                    <Rect width="4" height="4" fill="rgba(232, 213, 163, 0.004)" />
                    {/* Bruit de grain phosphorescent */}
                    <Rect x="0" y="0" width="1" height="1" fill="rgba(232, 213, 163, 0.09)" />
                    <Rect x="2" y="2" width="1" height="1" fill="rgba(232, 213, 163, 0.05)" />
                    {/* Ligne CRT à l'ancienne */}
                    <Line x1="0" y1="0" x2="4" y2="0" stroke="rgba(232, 213, 163, 0.025)" strokeWidth="0.5" />
                  </Pattern>
                </Defs>

                {/* Remplissage de la trame de grain rétro */}
                <Rect width="100%" height="100%" fill="url(#sonarGrain)" />
              </Svg>

              {/* 2. Canevas Sonar Concentrique Tactique dynamique (Pas de Pattern, interpolé en temps réel sans latence par le GPU) */}
              <AnimatedSvg width="100%" height={heightAnim} style={StyleSheet.absoluteFillObject}>
                {/* Cercles concentriques de sonar (Ajustés pour être discrets mais lisibles) */}
                <Circle cx="50%" cy="100%" r="60" stroke="rgba(232, 213, 163, 0.05)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="120" stroke="rgba(232, 213, 163, 0.04)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="180" stroke="rgba(232, 213, 163, 0.035)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="240" stroke="rgba(232, 213, 163, 0.03)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                <Circle cx="50%" cy="100%" r="300" stroke="rgba(232, 213, 163, 0.025)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="360" stroke="rgba(232, 213, 163, 0.02)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="420" stroke="rgba(232, 213, 163, 0.015)" strokeWidth="1" fill="none" strokeDasharray="1 5" />
                <Circle cx="50%" cy="100%" r="480" stroke="rgba(232, 213, 163, 0.01)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="540" stroke="rgba(232, 213, 163, 0.008)" strokeWidth="1" fill="none" />
                <Circle cx="50%" cy="100%" r="600" stroke="rgba(232, 213, 163, 0.005)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
                
                {/* Ticks & Axes de radar d'analyse */}
                <Line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(232, 213, 163, 0.025)" strokeWidth="1" strokeDasharray="3 4" />
                <Line x1="0%" y1="100%" x2="100%" y2="100%" stroke="rgba(232, 213, 163, 0.025)" strokeWidth="1" />
                
                {/* Rayons angulaires sonar tactiques */}
                <Line x1="15%" y1="20%" x2="50%" y2="100%" stroke="rgba(232, 213, 163, 0.018)" strokeWidth="0.8" />
                <Line x1="85%" y1="20%" x2="50%" y2="100%" stroke="rgba(232, 213, 163, 0.018)" strokeWidth="0.8" />
                <Line x1="30%" y1="40%" x2="50%" y2="100%" stroke="rgba(232, 213, 163, 0.012)" strokeWidth="0.8" strokeDasharray="2 2" />
                <Line x1="70%" y1="40%" x2="50%" y2="100%" stroke="rgba(232, 213, 163, 0.012)" strokeWidth="0.8" strokeDasharray="2 2" />
              </AnimatedSvg>

              {/* Ondes radar pulsantes physiques (Déployées dynamiquement sur le processeur graphique) */}
              <Animated.View
                style={[
                  styles.animatedRadarCircle,
                  {
                    bottom: dynamicBottomPadding - 100, // Calé sur le cœur du capteur d'empreinte !
                    transform: [{
                      scale: radarPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.1, 4.5] // L'onde s'étend sur tout le tiroir
                      })
                    }],
                    opacity: radarPulse.interpolate({
                      inputRange: [0, 0.15, 0.8, 1],
                      outputRange: [0, 0.22, 0.04, 0] // S'allume doucement puis s'évanouit
                    })
                  }
                ]}
                pointerEvents="none"
              />
              
              {/* Liseré or LED supérieur de l'overlay */}
              <View style={styles.modalTopLine} />
              <View style={styles.modalSubLine} />
            </Animated.View>

            <View
              onLayout={onContentLayout} // Mesure dynamique de la hauteur en temps réel
              style={{
                paddingTop: 24,
                paddingHorizontal: 20,
                paddingBottom: insets.bottom + 28,
                width: '100%',
                alignSelf: 'stretch',
                alignItems: 'center',
              }}
            >
              <Animated.View style={[styles.closeCrossWrapper, { opacity: borderOpacity }]}>
                <TouchableOpacity onPress={closeMenu} style={styles.closeCrossBtn} activeOpacity={0.7}>
                  <X size={13} color="#7a5c3a" strokeWidth={2.5} />
                </TouchableOpacity>
              </Animated.View>

            {/* VUE PRINCIPALE : MENU DE CHOIX AVEC APPARITION STAGGERED */}
            {activeSubView === 'menu' && (
              <Animated.View style={[
                styles.menuInnerView,
                {
                  opacity: subViewAnim,
                  transform: [{ translateY: subViewAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }]
                }
              ]}>
                {/* Ligne séparatrice supérieure fluide et aérée */}
                <Animated.View style={{ opacity: item1Opacity, transform: [{ translateY: item1Y }], width: '100%' }}>
                  <View style={styles.menuDivider} />
                </Animated.View>

                <View style={styles.btnRow}>
                  {/* Bouton 01 : Créer une partie */}
                  <Animated.View style={[styles.btnWrapper, { opacity: item2Opacity, transform: [{ translateY: item2Y }] }]}>
                    <TouchableOpacity
                      style={styles.menuBtn}
                      onPress={() => {
                        triggerHaptic();
                        closeMenu();
                        router.push('/(app)/create');
                      }}
                    >
                      <ExpeditionText variant="mono" size="xs" style={styles.menuBtnText}>
                        01. {language === 'FR' ? 'CREER UNE PARTIE' : 'CREATE A GAME'}
                      </ExpeditionText>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Bouton 02 : Rejoindre une partie */}
                  <Animated.View style={[styles.btnWrapper, { opacity: item3Opacity, transform: [{ translateY: item3Y }] }]}>
                    <TouchableOpacity
                      style={styles.menuBtn}
                      onPress={() => changeSubView('join')}
                    >
                      <ExpeditionText variant="mono" size="xs" style={styles.menuBtnText}>
                        02. {language === 'FR' ? 'REJOINDRE UNE PARTIE' : 'JOIN A GAME'}
                      </ExpeditionText>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Bouton 03 : Réglages */}
                  <Animated.View style={[styles.btnWrapper, { opacity: item4Opacity, transform: [{ translateY: item4Y }] }]}>
                    <TouchableOpacity
                      style={styles.menuBtn}
                      onPress={() => changeSubView('settings')}
                    >
                      <ExpeditionText variant="mono" size="xs" style={styles.menuBtnText}>
                        03. {language === 'FR' ? 'REGLAGES' : 'SETTINGS'}
                      </ExpeditionText>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </Animated.View>
            )}

            {/* VUE SECONDAIRE : SAISIE CODE SALON CLAVIER IMMERSIF */}
            {activeSubView === 'join' && (
              <Animated.View style={[
                styles.innerView,
                {
                  opacity: subViewAnim,
                  transform: [{ translateY: subViewAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }]
                }
              ]}>
                <View style={styles.menuDivider} />

                {/* Champ d'affichage du PIN saisi */}
                <View style={styles.pinDisplay}>
                  <ExpeditionText variant="title" style={styles.pinText}>
                    {pinCode.padEnd(6, '_').split('').join(' ')}
                  </ExpeditionText>
                </View>

                {/* Clavier virtuel premium */}
                <View style={styles.keyboardContainer}>
                  {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['DEL', '0', 'CLR']].map((row, rIdx) => (
                    <View key={rIdx} style={styles.keyboardRow}>
                      {row.map((char) => (
                        <TouchableOpacity
                          key={char}
                          style={[
                            styles.keyBtn,
                            (char === 'DEL' || char === 'CLR') && styles.keyBtnSpecial
                          ]}
                          onPress={() => handlePressKey(char)}
                        >
                          <ExpeditionText variant="mono" size="xs" style={styles.keyBtnText}>
                            {char}
                          </ExpeditionText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnCancel]}
                    onPress={() => { changeSubView('menu'); setPinCode(''); }}
                  >
                    <ExpeditionText variant="mono" size="xs" style={styles.actionBtnCancelText}>
                      RETOUR
                    </ExpeditionText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnConfirm]}
                    onPress={handleValidateJoin}
                    disabled={isJoining}
                  >
                    <ExpeditionText variant="mono" size="xs" style={styles.actionBtnConfirmText}>
                      {isJoining ? 'CONNEXION...' : 'VALIDER'}
                    </ExpeditionText>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            {/* VUE TERTIAIRE : RÉGLAGES */}
            {activeSubView === 'settings' && (
              <Animated.View style={[
                styles.innerView,
                {
                  opacity: subViewAnim,
                  transform: [{ translateY: subViewAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }]
                }
              ]}>
                {/* Ligne séparatrice supérieure identique au menu principal */}
                <View style={styles.menuDivider} />

                <View style={styles.settingsList}>
                  {/* Langue */}
                  <View style={styles.settingItem}>
                    <ExpeditionText variant="mono" size="xs" style={styles.settingLabel}>
                      LANGUE SYSTÈME
                    </ExpeditionText>
                    <View style={toggleStyles.toggleRow}>
                      <TouchableOpacity
                        style={[toggleStyles.toggleBtn, language === 'FR' && toggleStyles.toggleBtnActive]}
                        onPress={() => { setLanguage('FR'); saveSetting('@the_hunt_language', 'FR'); }}
                      >
                        <ExpeditionText variant="mono" size="xs" style={language === 'FR' ? toggleStyles.toggleBtnActiveText : toggleStyles.toggleBtnText}>
                          FR
                        </ExpeditionText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[toggleStyles.toggleBtn, language === 'EN' && toggleStyles.toggleBtnActive]}
                        onPress={() => { setLanguage('EN'); saveSetting('@the_hunt_language', 'EN'); }}
                      >
                        <ExpeditionText variant="mono" size="xs" style={language === 'EN' ? toggleStyles.toggleBtnActiveText : toggleStyles.toggleBtnText}>
                          EN
                        </ExpeditionText>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Son */}
                  <View style={styles.settingItem}>
                    <ExpeditionText variant="mono" size="xs" style={styles.settingLabel}>
                      AUDIO
                    </ExpeditionText>
                    <Switch
                      value={soundEnabled}
                      onValueChange={(val) => {
                        triggerHaptic();
                        setSoundEnabled(val);
                        saveSetting('@the_hunt_sound', val ? 'ON' : 'OFF');
                      }}
                      trackColor={{ false: 'rgba(232, 213, 163, 0.08)', true: 'rgba(122, 92, 58, 0.35)' }}
                      thumbColor={soundEnabled ? '#e8d5a3' : '#7a5c3a'}
                      ios_backgroundColor="rgba(232, 213, 163, 0.08)"
                    />
                  </View>

                  {/* Retours haptiques */}
                  <View style={styles.settingItem}>
                    <ExpeditionText variant="mono" size="xs" style={styles.settingLabel}>
                      VIBRATIONS
                    </ExpeditionText>
                    <Switch
                      value={hapticEnabled}
                      onValueChange={(val) => {
                        triggerHaptic();
                        setHapticEnabled(val);
                        saveSetting('@the_hunt_haptic', val ? 'ON' : 'OFF');
                      }}
                      trackColor={{ false: 'rgba(232, 213, 163, 0.08)', true: 'rgba(122, 92, 58, 0.35)' }}
                      thumbColor={hapticEnabled ? '#e8d5a3' : '#7a5c3a'}
                      ios_backgroundColor="rgba(232, 213, 163, 0.08)"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.settingsBackBtn}
                  onPress={() => changeSubView('menu')}
                >
                  <ExpeditionText variant="mono" size="xs" style={styles.settingsBackBtnText}>
                    [ RETOURNER AU SELECTEUR ]
                  </ExpeditionText>
                </TouchableOpacity>
              </Animated.View>
            )}

            </View>
          </Animated.View>
        </View>
      </View>
    )}
    </>
  );
}

const toggleStyles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.12)',
    backgroundColor: 'transparent',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(232, 213, 163, 0.12)',
    borderColor: '#e8d5a3',
  },
  toggleBtnText: {
    color: '#7a5c3a',
    fontSize: 9,
    fontWeight: 'bold',
  },
  toggleBtnActiveText: {
    color: '#e8d5a3',
    fontSize: 9,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80, // Hauteur physique explicite pour empêcher le détournement des événements de toucher sur Android !
    alignItems: 'center',
    justifyContent: 'center', // Centre verticalement le pod de 52px !
    backgroundColor: 'transparent',
    zIndex: 90,
  },
  biometricPod: {
    width: W - 56, // ALIGNE EXACTEMENT SUR LE CADRE DE "THE HUNT"
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(6, 9, 7, 0.60)', // Vert-noir obsidienne à 70% d'opacité (10% de réduction en plus)
    borderWidth: 1.5,
    borderColor: 'rgba(232, 213, 163, 0.22)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 15,
    elevation: 4, // Abaissé pour laisser le bouton passer au premier plan
    zIndex: 10,
  },
  bracketSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coordinateText: {
    color: '#e8d5a3',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  ledDotGreen: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#5a7052', // Vert olive/militaire mat identique à la bordure de "THE HUNT"
    shadowColor: '#5a7052',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  ledDotAmber: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },

  // Central Fingerprint Button
  scannerBtnWrapper: {
    position: 'absolute',
    left: '50%',
    top: 2, // Centrage vertical absolu parfait : (80px parent - 76px bouton) / 2 = 2px !
    marginLeft: -38, // Centre le bouton de largeur 76
    zIndex: 999, // Élevé au premier plan absolu
    elevation: 15, // Élevé au premier plan absolu sur Android
  },
  scannerBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#060907', // Vert-noir obsidienne, identique au menu et à l'onde !
    borderWidth: 2,
    borderColor: '#e8d5a3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e8d5a3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 15, // Élevé au premier plan absolu sur Android
    zIndex: 999,
    overflow: 'hidden',
  },
  scannerInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.22)',
    backgroundColor: 'rgba(232, 213, 163, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fingerIcon: {
    opacity: 0.9,
    shadowColor: '#e8d5a3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  laserScanLine: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#e8d5a3',
    opacity: 0.75,
    shadowColor: '#e8d5a3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  scannerRipple: {
    position: 'absolute',
    left: '50%',
    top: 2, // Calé verticalement à l'identique du scannerBtn
    marginLeft: -38,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: '#5a7052', // Vert olive mat identique à la bordure "THE HUNT"
    backgroundColor: 'rgba(90, 112, 82, 0.15)', // Lueur verte translucide
    zIndex: 900,
  },

  // ── HUD OVERLAY MENU ──
  modalBackdrop: {
    position: (Platform.OS === 'web' ? 'fixed' : 'absolute') as any, // 'fixed' verrouille le menu HUD sur le viewport Web, supprimant tout scroll ou décalage !
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%', // Fluide et responsive (s'adapte immédiatement sur mobile web et rotation !)
    alignSelf: 'center',
    backgroundColor: 'rgba(6, 9, 7, 0.01)', // Hack GPU : opacité de 1% pour forcer la rasterization tout en restant transparent pour voir l'onde !
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minHeight: 0, // Retrait de la minHeight figée pour que le ressort de hauteur pilote le conteneur au pixel près !
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden', // Crucial pour cacher les limites extérieures du cercle qui déborde !
  },
  modalBorderFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 213, 163, 0.22)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  expandCircle: {
    position: 'absolute',
    left: '50%', // Centrage dynamique fluide
    marginLeft: -38, // Décale exactement de la moitié de la largeur
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#060907', // Totalement opaque (100% Obsidian Black)
  },
  animatedRadarCircle: {
    position: 'absolute',
    left: '50%', // Centrage dynamique fluide
    marginLeft: -100, // Décale exactement de la moitié de la largeur
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 213, 163, 0.20)', // Or phosphorescent plus discret
    backgroundColor: 'transparent',
  },
  modalTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e8d5a3',
    opacity: 0.45,
  },
  modalSubLine: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(232, 213, 163, 0.1)',
  },
  innerView: {
    width: '100%',
    alignItems: 'center',
  },
  menuHeader: {
    color: '#7a5c3a',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(232, 213, 163, 0.08)',
    marginTop: 8, // Remonté près de la croix de fermeture
    marginBottom: 20, // Espace compact et optimal au-dessus des options
  },
  closeCrossWrapper: {
    alignSelf: 'flex-end', // Aligne proprement à droite dans le flux vertical
    marginBottom: 12, // Pousse proprement les items en dessous sans superposition !
  },
  closeCrossBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(232, 213, 163, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(122, 92, 58, 0.18)', // Teinte assortie bronze #7a5c3a
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuInnerView: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch', // S'assure que les enfants s'étirent sur toute la largeur !
  },
  btnRow: {
    width: '100%',
    alignSelf: 'stretch',
    gap: 14, // Padding d'espace égal entre les boutons !
  },
  btnWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
  menuBtn: {
    height: 52, // Hauteur fixe tactile haut de gamme immune aux bugs de layout Yoga sous transforms !
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(232, 213, 163, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.14)',
    borderRadius: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24, // Ajout du padding horizontal intérieur manquant !
  },
  menuBtnText: {
    color: '#e8d5a3',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  closeBtn: {
    paddingVertical: 12,
  },
  closeBtnText: {
    color: '#7a5c3a',
    letterSpacing: 2,
    fontSize: 9,
  },

  // ── CLAVIER PIN NUMÉRIQUE VIRTUEL ──
  pinDisplay: {
    backgroundColor: 'rgba(3, 5, 4, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.2)',
    borderRadius: 6,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  pinText: {
    color: '#e8d5a3',
    fontSize: 26,
    letterSpacing: 8,
  },
  keyboardContainer: {
    width: '100%',
    gap: 6,
    marginBottom: 20,
  },
  keyboardRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 6,
  },
  keyBtn: {
    flex: 1,
    height: 44,
    backgroundColor: 'rgba(232, 213, 163, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.07)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyBtnSpecial: {
    backgroundColor: 'rgba(192, 57, 43, 0.02)',
    borderColor: 'rgba(192, 57, 43, 0.16)',
  },
  keyBtnText: {
    color: '#e8d5a3',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnCancel: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(232, 213, 163, 0.16)',
  },
  actionBtnConfirm: {
    backgroundColor: 'rgba(232, 213, 163, 0.12)',
    borderColor: '#e8d5a3',
  },
  actionBtnCancelText: {
    color: '#e8d5a3',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  actionBtnConfirmText: {
    color: '#0d120e',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  // ── RÉGLAGES MODULE ──
  settingsList: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(232, 213, 163, 0.01)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.07)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  settingLabel: {
    color: '#e8d5a3',
    letterSpacing: 1.2,
    fontSize: 10,
  },
  settingsBackBtn: {
    paddingVertical: 12,
    marginTop: 18, // Pousse le bouton retourner au sélecteur un peu plus bas
  },
  settingsBackBtnText: {
    color: '#7a5c3a',
    letterSpacing: 2,
    fontSize: 9,
  },
});
