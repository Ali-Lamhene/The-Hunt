import {
  StyleSheet,
  View,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { useAuth } from '@/context/AuthContext';
import { useRef, useEffect, useState } from 'react';
import Svg, { Line, Rect, Circle, Path, Defs, Pattern } from 'react-native-svg';
import { LogOut, Fingerprint, Radio } from 'lucide-react-native';

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

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

        {/* ── BAS : Menu Tactique Vertical ─────────────── */}
        <View style={styles.bottomList}>
          {/* Bouton Créer/Initier */}
          <TouchableOpacity
            onPress={() => router.push('/(app)/create')}
            activeOpacity={0.7}
            style={styles.listItem}
          >
            <View style={[styles.scannerOuterCircle, styles.outerRed]}>
              <View style={[styles.scannerInnerCircle, styles.innerRed]}>
                <Fingerprint size={26} color="#e8d5a3" />
              </View>
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle}>INITIER</Text>
              <Text style={styles.listSub} numberOfLines={1}>CRÉER UNE TRAQUE</Text>
            </View>
          </TouchableOpacity>

          {/* Bouton Rejoindre */}
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.listItem}
          >
            <View style={[styles.scannerOuterCircle, styles.outerGold]}>
              <View style={[styles.scannerInnerCircle, styles.innerGold]}>
                <Radio size={26} color="#e8d5a3" />
              </View>
            </View>
            <View style={styles.listTextContainer}>
              <Text style={styles.listTitle}>REJOINDRE</Text>
              <Text style={styles.listSub} numberOfLines={1}>SAISIR UN CODE</Text>
            </View>
          </TouchableOpacity>
        </View>

      </Animated.View>
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
    backgroundColor: 'rgba(6, 9, 7, 0.48)',
  },
  layout: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
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

  // ── MENU TACTIQUE VERTICAL ──
  bottomList: {
    width: '100%',
    paddingBottom: 20,
    gap: 24, // Espacement vertical entre les options
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(10, 14, 10, 0.3)',
    paddingRight: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.05)',
  },
  scannerOuterCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRed: {
    borderColor: 'rgba(192, 57, 43, 0.4)',
    backgroundColor: 'rgba(192, 57, 43, 0.05)',
  },
  outerGold: {
    borderColor: 'rgba(232, 213, 163, 0.4)',
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
  },
  scannerInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  innerRed: {
    backgroundColor: 'rgba(192, 57, 43, 0.15)',
    borderColor: 'rgba(192, 57, 43, 0.9)',
    shadowColor: '#c0392b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  innerGold: {
    backgroundColor: 'rgba(232, 213, 163, 0.10)',
    borderColor: 'rgba(232, 213, 163, 0.7)',
    shadowColor: '#e8d5a3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  listTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  listTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#e8d5a3',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  listSub: {
    fontFamily: 'monospace',
    color: '#8a9b81',
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 6,
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
