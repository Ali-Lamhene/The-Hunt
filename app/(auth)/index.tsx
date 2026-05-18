import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { LucideWifiOff, Target } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import Svg, { Path, G, Circle, Line, Defs, Pattern, Rect } from 'react-native-svg';

const { width: W } = Dimensions.get('window');

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

const CrosshairWatermark = ({ dark = false }: { dark?: boolean }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 390 844">
      <G opacity={dark ? 0.08 : 0.04} stroke={dark ? "#e8d5a3" : "#1a0e05"} strokeWidth="1" fill="none" transform="translate(195,422)">
        <Circle r="60"/>
        <Circle r="38"/>
        <Circle r="12"/>
        <Line x1="-80" y1="0" x2="-45" y2="0"/>
        <Line x1="45" y1="0" x2="80" y2="0"/>
        <Line x1="0" y1="-80" x2="0" y2="-45"/>
        <Line x1="0" y1="45" x2="0" y2="80"/>
      </G>
    </Svg>
  </View>
);

export default function GatewayScreen() {
  const { isConnected } = useAuth();
  const router = useRouter();
  const errorColor = useThemeColor({}, 'error');
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const renderOfflineState = () => (
    <View style={styles.stateContainer}>
      <LucideWifiOff size={48} color={errorColor} />
      <ExpeditionText variant="title" size="xl" style={[styles.title, { color: errorColor }]}>
        Signal Perdu
      </ExpeditionText>
      <ExpeditionText variant="journal" style={styles.description}>
        Impossible d'établir le lien avec la base.
      </ExpeditionText>
      <View style={styles.spacer} />
      <ExpeditionText variant="mono" size="xs" style={styles.retryText}>
        RECHERCHE DE FRÉQUENCES...
      </ExpeditionText>
    </View>
  );

  const renderOnlineState = () => (
    <>
      <View style={styles.hero}>
        <View style={styles.minimalLogo}>
          <Target size={32} color="#c0392b" strokeWidth={1.5} opacity={0.8} />
        </View>

        <Svg width={W * 0.6} height={12} style={styles.ruleRow}>
          <Line x1={0} y1={6} x2={W * 0.6} y2={6} stroke="#5a7052" strokeWidth={1} opacity={0.6}/>
          <Circle cx={(W * 0.6) / 2} cy={6} r={2} fill="#e8d5a3" opacity={0.8}/>
        </Svg>

        <ExpeditionText 
          variant="title" 
          style={styles.mainTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          THE{"\n"}HUNT
        </ExpeditionText>
        
        <Svg width={W * 0.6} height={16} style={styles.ruleRow}>
          <Line x1={0} y1={8} x2={W * 0.6} y2={8} stroke="#5a7052" strokeWidth={1} opacity={0.6}/>
          <Path d={`M 0 0 L 0 16 M ${W * 0.6} 0 L ${W * 0.6} 16`} stroke="#e8d5a3" strokeWidth={1.5} opacity={0.6}/>
        </Svg>
        
        <ExpeditionText variant="mono" size="xs" style={styles.tagline}>
          IDENTIFICATION REQUISE
        </ExpeditionText>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.actions}>
          <ExpeditionButton 
            title="MODE INVITÉ" 
            variant="primary"
            onPress={() => router.push('/(auth)/guest')}
            style={styles.primaryButton}
          />
        </View>
        
        <ExpeditionText variant="mono" size="xs" style={styles.footerText}>
          v1.0.0 · EXPÉDITION · GPS REQUIS
        </ExpeditionText>
      </View>
    </>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/auth-bg.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <View style={styles.veil} />
      <NoiseTexture />
      <CrosshairWatermark dark />
      
      <Animated.View 
        style={[
          styles.layout, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: insets.bottom + Spacing.xl,
          }
        ]}
      >
        {isConnected === false ? renderOfflineState() : renderOnlineState()}
      </Animated.View>
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
    backgroundColor: 'rgba(5, 7, 5, 0.75)', // Fond plus sombre pour meilleure lisibilité
  },
  layout: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  minimalLogo: {
    marginBottom: Spacing.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.3)',
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  ruleRow: {
    marginVertical: Spacing.md,
  },
  mainTitle: {
    fontSize: 68,
    lineHeight: 68,
    color: "#e8d5a3",
    textAlign: "center",
    letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  tagline: {
    color: "#a4b59d",
    textAlign: "center",
    letterSpacing: 4,
    marginTop: Spacing.sm,
  },
  title: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    opacity: 0.8,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    width: '100%',
    backgroundColor: 'rgba(10, 15, 10, 0.6)',
    borderColor: 'rgba(122, 92, 58, 0.4)',
  },
  primaryButton: {
    width: '100%',
  },
  spacer: {
    height: Spacing.xl,
  },
  retryText: {
    opacity: 0.5,
  },
  footerText: {
    color: "rgba(122,92,58,0.4)",
    textAlign: "center",
    marginTop: Spacing.xl,
    letterSpacing: 2,
  }
});
