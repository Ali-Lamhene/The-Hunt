import { 
  StyleSheet, 
  View, 
  TextInput, 
  Animated, 
  KeyboardAvoidingView, 
  Platform, 
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { Typography } from '@/constants/Typography';
import { ChevronLeft, UserCircle2 } from 'lucide-react-native';
import Svg, { G, Circle, Line, Defs, Pattern, Rect } from 'react-native-svg';

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

export default function GuestScreen() {
  const [username, setUsername] = useState('');
  const { signInAsGuest } = useAuth();
  const router = useRouter();
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
    <ImageBackground
      source={require('@/assets/images/auth-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.veil} />
      <NoiseTexture />
      <CrosshairWatermark dark />

      <SafeAreaView style={styles.inner}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              
              <View style={styles.topSection}>
                <View style={styles.navBar}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color="#e8d5a3" size={24} />
                    <ExpeditionText variant="mono" size="xs" style={styles.backText}>RETOUR</ExpeditionText>
                  </TouchableOpacity>
                </View>

                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    <UserCircle2 size={32} color="#c0392b" strokeWidth={1.5} opacity={0.8} />
                  </View>
                  
                  <ExpeditionText 
                    variant="title" 
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    IDENTITÉ DE TERRAIN
                  </ExpeditionText>
                  <ExpeditionText variant="journal" style={styles.description}>
                    Gravez votre indicatif dans les registres.{"\n"}
                    3-12 caractères, lettres et chiffres.
                  </ExpeditionText>
                </View>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputSection}>
                  <ExpeditionText variant="mono" size="xs" style={styles.label}>
                    [ INDICATIF ]
                  </ExpeditionText>
                  
                  <View style={styles.inputOuterBorder}>
                    <View style={[styles.inputCorner, styles.cornerTL]} />
                    <View style={[styles.inputCorner, styles.cornerTR]} />
                    <View style={[styles.inputCorner, styles.cornerBL]} />
                    <View style={[styles.inputCorner, styles.cornerBR]} />
                    
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[styles.input, { color: accentColor }]}
                        value={username}
                        onChangeText={(text) => setUsername(text.replace(/[^a-zA-Z0-9_.]/g, '').toUpperCase())}
                        placeholder="EX: ALPHA_7"
                        placeholderTextColor="rgba(232, 213, 163, 0.2)"
                        maxLength={12}
                        selectionColor="#c0392b"
                        autoCapitalize="characters"
                        autoCorrect={false}
                        spellCheck={false}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <View style={styles.infoAccent} />
                  <ExpeditionText variant="journal" style={styles.infoText}>
                    AVERTISSEMENT : En mode invité, vos données de progression sont stockées localement et peuvent être perdues en cas de désinstallation.
                  </ExpeditionText>
                </View>
              </View>

              <View style={styles.bottomArea}>
                <ExpeditionButton
                  title="SÉLECTIONNER L'INDICATIF"
                  onPress={handleSignIn}
                  disabled={username.length < 3}
                  variant="primary"
                  style={[styles.button, username.length < 3 && { opacity: 0.5 }]}
                />
              </View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0802',
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 7, 5, 0.8)',
  },
  inner: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginTop: Spacing.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backText: {
    color: '#e8d5a3',
    marginLeft: Spacing.xs,
    letterSpacing: 2,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.3)',
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    marginBottom: Spacing.xs,
    fontSize: 36,
    color: "#e8d5a3",
    textAlign: "center",
    letterSpacing: 4,
    paddingTop: 16,
    paddingBottom: 8,
    includeFontPadding: false,
    lineHeight: 46,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
    color: "#a4b59d",
    lineHeight: 18,
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    paddingVertical: Spacing.lg,
  },
  inputSection: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  label: {
    color: "#7a5c3a",
    letterSpacing: 3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  inputOuterBorder: {
    position: 'relative',
    padding: 2,
  },
  inputCorner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#e8d5a3',
    opacity: 0.5,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  
  inputWrapper: {
    backgroundColor: "rgba(10, 15, 10, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(90, 112, 82, 0.3)",
  },
  input: {
    fontFamily: Typography.family.body,
    fontSize: 22,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    textAlign: 'center',
    letterSpacing: 4,
  },
  infoBox: {
    backgroundColor: "rgba(192, 57, 43, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(192, 57, 43, 0.2)",
    padding: Spacing.md,
    flexDirection: 'row',
  },
  infoAccent: {
    width: 2,
    backgroundColor: "#c0392b",
    marginRight: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: "#e8d5a3",
    lineHeight: 16,
    opacity: 0.7,
  },
  bottomArea: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  button: {
    width: '100%',
  },
});
