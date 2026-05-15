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
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { useAuth } from '@/context/AuthContext';
import { useRef, useEffect } from 'react';
import Svg, { Line, Rect, Circle, Path } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

export default function AppIndex() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

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

        {/* ── HAUT : bouton déconnexion discret ─────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={signOut} activeOpacity={0.6} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>DÉCONNEXION</Text>
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

          {/* Titre */}
          <ExpeditionText
            variant="title"
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            THE HUNT
          </ExpeditionText>

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
          <ExpeditionText variant="mono" size="xs" style={styles.tagline}>
            — PRÉPAREZ-VOUS POUR LA TRAQUE —
          </ExpeditionText>

        </View>

        {/* ── BAS : bouton principal tactique ─────────────── */}
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.9}
            style={styles.startBtn}
          >
            {/* Effet biseauté haut */}
            <View style={styles.btnBevelTop} />
            
            {/* Décorations angles (brackets) */}
            <View style={styles.btnBracketTL} />
            <View style={styles.btnBracketBR} />

            <View style={styles.btnContent}>
              <Text style={styles.startBtnText}>DÉMARRER LA TRAQUE</Text>
              {/* Petit indicateur de direction */}
              <Svg width={18} height={18} style={{ marginLeft: 16 }}>
                <Path d="M 0 9 L 18 9 M 12 3 L 18 9 L 12 15" stroke="#e8d5a3" strokeWidth={2.5} fill="none" />
              </Svg>
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  logoutText: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 3,
    color: 'rgba(180,190,175,0.45)',
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
    fontSize: 88,
    color: '#e8d5a3',
    letterSpacing: 10,
    lineHeight: 100,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    textAlign: 'center',
    width: '100%',
  },
  tagline: {
    color: '#5a6854',
    fontSize: 13,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.75,
  },

  // ── BOUTON TACTIQUE ──
  bottom: {
    width: '100%',
  },
  startBtn: {
    width: '100%',
    height: 80,
    backgroundColor: '#2d3a29',
    borderWidth: 1,
    borderColor: '#4a5e45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  btnBevelTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  btnBracketTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#e8d5a3',
    opacity: 0.6,
  },
  btnBracketBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 12,
    height: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#e8d5a3',
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  startBtnText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 4,
    color: '#e8d5a3',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
