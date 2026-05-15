import { 
  StyleSheet, 
  View, 
  TextInput, 
  Animated, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { Typography } from '@/constants/Typography';
import Svg, { Path, G, Circle } from 'react-native-svg';

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
      </G>
    </Svg>
  </View>
);

export default function GuestScreen() {
  const [username, setUsername] = useState('');
  const { signInAsGuest } = useAuth();
  const accentColor = "#e8d5a3";
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignIn = () => {
    if (username.length >= 3 && username.length <= 12) {
      signInAsGuest(username);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <JungleCorners dark intensity={1} />
          <CrosshairWatermark dark />
          
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <ExpeditionText variant="title" size="xl" style={styles.title}>
                Identité de Terrain
              </ExpeditionText>
              <ExpeditionText variant="journal" style={styles.description}>
                Gravez votre nom dans les registres de l'expédition.{"\n"}
                3-12 caractères, Majuscules uniquement.
              </ExpeditionText>
            </View>

            <View style={styles.inputSection}>
              <ExpeditionText variant="mono" size="xs" style={styles.label}>
                PSEUDONYME
              </ExpeditionText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: accentColor }]}
                  value={username}
                  onChangeText={(text) => setUsername(text.replace(/[^a-zA-Z0-9_.]/g, '').toUpperCase())}
                  placeholder="EX: SHADOW_WOLF"
                  placeholderTextColor="rgba(122, 92, 58, 0.3)"
                  maxLength={12}
                  autoFocus
                  selectionColor={accentColor}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  spellCheck={false}
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <ExpeditionText variant="journal" style={styles.infoText}>
                En tant qu'invité, votre identité est stockée localement sur cet appareil.
              </ExpeditionText>
            </View>

            <ExpeditionButton
              title="Valider l'Identité"
              onPress={handleSignIn}
              disabled={username.length < 3}
              variant="primary"
              style={[styles.button, username.length < 3 && { opacity: 0.5 }]}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0802',
  },
  inner: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
  },
  title: {
    marginBottom: Spacing.md,
    fontSize: 36,
    color: "#e8d5a3",
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
    color: "#7a5c3a",
    lineHeight: 18,
  },
  inputSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  label: {
    color: "#7a5c3a",
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    backgroundColor: "rgba(232, 213, 163, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(232, 213, 163, 0.2)",
    borderRadius: 4,
  },
  input: {
    fontFamily: Typography.family.body,
    fontSize: 20,
    padding: Spacing.md,
    textAlign: 'left',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: "rgba(192, 57, 43, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(192, 57, 43, 0.3)",
    borderRadius: 4,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoText: {
    fontSize: 12,
    color: "#e8d5a3",
    lineHeight: 16,
  },
  button: {
    width: '100%',
  },
});
