import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { LucideCompass, LucideWifiOff } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef } from 'react';
import Svg, { Path, G, Circle, Line, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const JungleCorners = ({ intensity = 1, dark = false }: { intensity?: number; dark?: boolean }) => {
  const col = dark ? "#e8d5a3" : "#1a5c30";
  const op = dark ? 0.13 * intensity : 0.08 * intensity;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <G opacity={op} fill={col}>
          <Path d="M-20 -10 Q60 10 90 80 Q50 95 10 60 Q-15 35 -20 -10Z"/>
          <Path d="M-30 30 Q50 25 75 100 Q30 105 -10 70 Q-28 55 -30 30Z"/>
          <Path d="M5 -20 Q80 30 70 110 Q30 95 5 -20Z"/>
          <Path d="M-25 70 Q45 55 65 130 Q20 138 -15 100 Q-28 85 -25 70Z"/>
          <Path d="M40 -30 Q95 20 85 90 Q55 80 40 -30Z"/>
        </G>
        <G opacity={op} fill={col}>
          <Path d="M410 -10 Q330 10 300 80 Q340 95 380 60 Q415 35 410 -10Z"/>
          <Path d="M420 30 Q340 25 315 100 Q360 105 400 70 Q418 55 420 30Z"/>
          <Path d="M385 -20 Q310 30 320 110 Q360 95 385 -20Z"/>
          <Path d="M415 70 Q345 55 325 130 Q370 138 405 100 Q418 85 415 70Z"/>
          <Path d="M350 -30 Q295 20 305 90 Q335 80 350 -30Z"/>
        </G>
        <G opacity={op * 0.7} fill="none" stroke={col} strokeWidth="1.5">
          <Path d="M-5 200 Q15 230 5 270 Q-8 260 -5 200Z" fill={col}/>
          <Path d="M395 350 Q378 380 388 420 Q400 410 395 350Z" fill={col}/>
        </G>
      </Svg>
    </View>
  );
};

const CrosshairWatermark = ({ dark = false }: { dark?: boolean }) => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" viewBox="0 0 390 844">
      <G opacity={dark ? 0.06 : 0.04} stroke={dark ? "#e8d5a3" : "#1a0e05"} strokeWidth="1" fill="none" transform="translate(195,422)">
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
  const accentColor = useThemeColor({}, 'accent');
  const errorColor = useThemeColor({}, 'error');
  const inkLight = "#7A5C3A";
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderOfflineState = () => (
    <View style={styles.stateContainer}>
      <LucideWifiOff size={64} color={errorColor} />
      <ExpeditionText variant="title" size="xl" style={[styles.title, { color: errorColor }]}>
        Signal Perdu
      </ExpeditionText>
      <ExpeditionText variant="journal" style={styles.description}>
        Impossible d'établir le lien avec la base. L'expédition ne peut pas commencer sans transmission radio.
      </ExpeditionText>
      <View style={styles.spacer} />
      <ExpeditionText variant="mono" size="xs" style={styles.retryText}>
        RECHERCHE DE FRÉQUENCES EN COURS...
      </ExpeditionText>
    </View>
  );

  const renderOnlineState = () => (
    <View style={styles.stateContainer}>
      <View style={styles.logoContainer}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <G opacity="0.5" fill="#2d6a4f">
            <Path d="M5 60 Q2 30 25 15 Q18 35 20 60Z"/>
            <Path d="M115 60 Q118 30 95 15 Q102 35 100 60Z"/>
            <Path d="M5 60 Q2 90 25 105 Q18 85 20 60Z"/>
            <Path d="M115 60 Q118 90 95 105 Q102 85 100 60Z"/>
          </G>
          <Circle cx="60" cy="60" r="45" fill="none" stroke="#7a5c3a" strokeWidth="1" opacity="0.5"/>
          <Circle cx="60" cy="60" r="30" fill="none" stroke="#c0392b" strokeWidth="1.5" opacity="0.7"/>
          <Circle cx="60" cy="60" r="5" fill="#c0392b"/>
          <Line x1="10" y1="60" x2="30" y2="60" stroke="#c0392b" strokeWidth="2"/>
          <Line x1="90" y1="60" x2="110" y2="60" stroke="#c0392b" strokeWidth="2"/>
          <Line x1="60" y1="10" x2="60" y2="30" stroke="#c0392b" strokeWidth="2"/>
          <Line x1="60" y1="90" x2="60" y2="110" stroke="#c0392b" strokeWidth="2"/>
        </Svg>
      </View>

      <ExpeditionText variant="title" size="huge" style={styles.mainTitle}>
        THE{"\n"}HUNT
      </ExpeditionText>
      
      <ExpeditionText variant="journal" style={styles.tagline}>
        Géolocalisation · Traque Réelle
      </ExpeditionText>

      <View style={styles.actions}>
        <ExpeditionButton 
          title="Créer un compte" 
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />
        <ExpeditionButton 
          title="Se connecter (Google)" 
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />
        <ExpeditionButton 
          title="Jouer en tant qu'invité" 
          variant="primary"
          onPress={() => router.push('/(auth)/guest')}
          style={styles.button}
        />
      </View>
      
      <ExpeditionText variant="mono" size="xs" style={styles.footerText}>
        v1.0.0 · EXPÉDITION · GPS REQUIS
      </ExpeditionText>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <JungleCorners dark intensity={1.5} />
      <CrosshairWatermark dark />
      {isConnected === false ? renderOfflineState() : renderOnlineState()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    backgroundColor: '#0d0802',
  },
  stateContainer: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: Spacing.sm,
  },
  mainTitle: {
    fontSize: 72,
    color: "#e8d5a3",
    textAlign: "center",
    lineHeight: 72,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 11,
    color: "#7a5c3a",
    textAlign: "center",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  title: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    opacity: 0.8,
  },
  actions: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  button: {
    marginBottom: Spacing.md,
  },
  spacer: {
    height: Spacing.xl,
  },
  retryText: {
    opacity: 0.5,
  },
  footerText: {
    color: "rgba(122,92,58,0.6)",
    textAlign: "center",
    marginTop: Spacing.lg,
    letterSpacing: 1,
  }
});
