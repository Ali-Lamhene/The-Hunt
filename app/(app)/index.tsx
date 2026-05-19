import {
  StyleSheet,
  View,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { useAuth } from '@/context/AuthContext';
import { useRef, useEffect, useState } from 'react';
import Svg, { Line, Rect, Circle, Path, Defs, Pattern } from 'react-native-svg';
import { LogOut } from 'lucide-react-native';
import TacticalBottomBar from '@/components/ui/TacticalBottomBar';

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

const AnimatedExpeditionText = Animated.createAnimatedComponent(ExpeditionText);

const GlitchTitle = () => {
  const originalText = "THE HUNT";
  const [displayText, setDisplayText] = useState(originalText);
  const chars = "!<>-_\\\\/[]{}—=+*^?#_";
  
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const doGlitch = () => {
      let glitchCount = 0;
      const maxGlitches = 6;

      // Effet "néon défectueux" / baisse d'énergie
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.3, duration: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.9, duration: 60, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.4, duration: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      // Effet de décryptage / brouillage de signal
      const glitchInterval = setInterval(() => {
        if (glitchCount >= maxGlitches) {
          clearInterval(glitchInterval);
          setDisplayText(originalText);
          const nextGlitch = Math.random() * 5000 + 2000;
          timeoutId = setTimeout(doGlitch, nextGlitch);
          return;
        }

        let scrambled = "";
        for (let i = 0; i < originalText.length; i++) {
          if (originalText[i] === " ") {
            scrambled += " ";
          } else if (Math.random() > 0.4) {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          } else {
            scrambled += originalText[i];
          }
        }
        setDisplayText(scrambled);
        glitchCount++;
      }, 50); // Toutes les 50ms, les lettres changent
    };

    timeoutId = setTimeout(doGlitch, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <AnimatedExpeditionText
        variant="title"
        style={[styles.title, { opacity: opacityAnim }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayText}
      </AnimatedExpeditionText>
    </View>
  );
};

export default function AppIndex() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  // Animations tactiques du radar central
  const radarSweepAnim = useRef(new Animated.Value(0)).current;
  const blipsBlinkAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();

    // Balayage rotatif continu (360° en 6 secondes)
    Animated.loop(
      Animated.timing(radarSweepAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    // Clignotement périodique doux des balises d'agents (blips)
    Animated.loop(
      Animated.sequence([
        Animated.timing(blipsBlinkAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(blipsBlinkAnim, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = radarSweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('@/assets/images/home-bg.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <View style={styles.veil} />
      <NoiseTexture />
      <ScannerLine />

      <Animated.View
        style={[
          styles.layout,
          {
            opacity: fade,
            transform: [{ translateY: slide }],
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >

        {/* ── HAUT : infos utilisateur & déconnexion ─────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={signOut} activeOpacity={0.6} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>
              {user?.username ? user.username.toUpperCase() : 'DÉCONNEXION'}
            </Text>
            <LogOut size={16} color="rgba(180,190,175,0.6)" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* ── MILIEU : titre + motifs géométriques ──────────── */}
        <View style={styles.hero}>

          {/* Règle supérieure */}
          <Svg width={W - 56} height={20} style={styles.ruleRow}>
            <Line x1={0} y1={10} x2={W - 56} y2={10} stroke="#3d4e38" strokeWidth={1}/>
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((p, i) => (
              <Line key={i}
                x1={(W - 56) * p} y1={i === 4 ? 3 : 5}
                x2={(W - 56) * p} y2={i === 4 ? 17 : 15}
                stroke="#3d4e38" strokeWidth={1} opacity={i === 4 ? 1 : 0.5}
              />
            ))}
            <Circle cx={(W - 56) / 2} cy={10} r={3} fill="none" stroke="#5a7052" strokeWidth={1}/>
          </Svg>

          {/* Titre Glitché */}
          <GlitchTitle />

          {/* Règle inférieure avec coins */}
          <Svg width={W - 56} height={24} style={styles.ruleRow}>
            <Line x1={0} y1={12} x2={W - 56} y2={12} stroke="#3d4e38" strokeWidth={1}/>
            {/* Coin bas gauche */}
            <Path d="M 0 4 L 0 20 L 12 20" fill="none" stroke="#5a7052" strokeWidth={1.5}/>
            {/* Coin bas droite */}
            <Path d={`M ${W - 56} 4 L ${W - 56} 20 L ${W - 56 - 12} 20`} fill="none" stroke="#5a7052" strokeWidth={1.5}/>
            {/* Tirets centraux */}
            {[-12, -6, 0, 6, 12].map((offset, i) => {
              const cx = (W - 56) / 2 + offset;
              return (
                <Line key={i} x1={cx} y1={7} x2={cx} y2={17}
                  stroke="#3d4e38" strokeWidth={1} opacity={i === 2 ? 1 : 0.4}/>
              );
            })}
          </Svg>

          {/* Tagline */}
          <ExpeditionText 
            variant="mono" 
            style={styles.tagline}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            — PRÉPAREZ-VOUS POUR LA TRAQUE —
          </ExpeditionText>

        </View>

        {/* ── BAS : Telemetry HUD / Radar Graphic ─────────────── */}
        <View style={styles.hudContainer}>
          <View style={{ width: 160, height: 160, position: 'relative' }}>
            
            {/* Couche 1: La grille radar de fond (statique) */}
            <Svg width={160} height={160} style={StyleSheet.absoluteFillObject}>
              {/* Halo or très doux en arrière-plan pour donner de la profondeur */}
              <Circle cx={80} cy={80} r={75} fill="rgba(232, 213, 163, 0.015)" />

              {/* Anneaux concentriques tactiques contrastés */}
              <Circle cx={80} cy={80} r={75} stroke="rgba(232, 213, 163, 0.16)" strokeWidth={1.5} fill="none" />
              <Circle cx={80} cy={80} r={60} stroke="rgba(232, 213, 163, 0.24)" strokeWidth={1.2} fill="none" strokeDasharray="5 5" />
              <Circle cx={80} cy={80} r={44} stroke="rgba(232, 213, 163, 0.32)" strokeWidth={1.5} fill="none" />
              <Circle cx={80} cy={80} r={28} stroke="rgba(232, 213, 163, 0.40)" strokeWidth={1.2} fill="none" strokeDasharray="3 3" />
              <Circle cx={80} cy={80} r={12} stroke="rgba(232, 213, 163, 0.50)" strokeWidth={1.8} fill="none" />
              
              {/* Lignes de visée en croix contrastées */}
              <Line x1={80} y1={4} x2={80} y2={156} stroke="rgba(232, 213, 163, 0.20)" strokeWidth={1.2} />
              <Line x1={4} y1={80} x2={156} y2={80} stroke="rgba(232, 213, 163, 0.20)" strokeWidth={1.2} />
            </Svg>

            {/* Couche 2: Le faisceau radar balayeur en rotation continue */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ rotate: spin }] }]} pointerEvents="none">
              <Svg width={160} height={160}>
                {/* Ligne laser balayeuse */}
                <Line x1={80} y1={80} x2={80} y2={5} stroke="rgba(232, 213, 163, 0.5)" strokeWidth={1.5} />
                {/* Cône de traînée lumineuse dorée (angle de 45° calculé pour r=75) */}
                <Path
                  d="M 80 80 L 80 5 A 75 75 0 0 1 133 27 Z"
                  fill="rgba(232, 213, 163, 0.05)"
                />
              </Svg>
            </Animated.View>

            {/* Couche 3: Les points d'échos (Blips) en pulsation clignotante */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: blipsBlinkAnim }]} pointerEvents="none">
              <Svg width={160} height={160}>
                {/* Échos radars tactiques (Blips d'agents actifs) */}
                {/* Écho 1: Allié or avec zone d'onde */}
                <Circle cx={112} cy={60} r={4} fill="#e8d5a3" />
                <Circle cx={112} cy={60} r={7.5} stroke="rgba(232, 213, 163, 0.45)" strokeWidth={1} fill="none" />
                
                {/* Écho 2: Proie hostile rouge avec zone d'alerte */}
                <Circle cx={56} cy={108} r={3.2} fill="#c0392b" />
                <Circle cx={56} cy={108} r={7} stroke="rgba(192, 57, 43, 0.60)" strokeWidth={1.2} fill="none" />

                {/* Écho 3: Balise fixe passive */}
                <Circle cx={92} cy={44} r={2.2} fill="#e8d5a3" />
              </Svg>
            </Animated.View>

          </View>
        </View>

      </Animated.View>
      
      <TacticalBottomBar />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0e1210',
    height: Platform.OS === 'web' ? '100vh' : '100%' as any,
    overflow: 'hidden', // Évite tout défilement parasite global sur le navigateur !
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 9, 7, 0.48)',
  },
  layout: {
    flex: 1,
    paddingHorizontal: 28,
  },

  // ── TOP BAR ──
  topBar: {
    alignItems: 'flex-end',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  logoutText: {
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 3,
    color: 'rgba(180,190,175,0.65)',
  },

  // ── HERO ──
  hero: {
    alignItems: 'center',
    width: '100%',
  },
  ruleRow: {
    width: '100%',
    marginVertical: 6,
  },
  title: {
    fontSize: Math.min(W * 0.2, 80),
    color: '#e8d5a3',
    letterSpacing: Math.min(W * 0.02, 8),
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    textAlign: 'center',
    width: '100%',
    paddingTop: 30,
    paddingBottom: 20,
    includeFontPadding: false,
    lineHeight: 90,
  },
  tagline: {
    color: '#5a6854',
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },

  // ── TELEMETRY HUD ──
  hudContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 64, // Décale vers le haut pour compenser la hauteur du bottom bar
  },
  radarSvg: {
    opacity: 1.0,
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
