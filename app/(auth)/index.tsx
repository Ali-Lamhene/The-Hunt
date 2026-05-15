import { StyleSheet, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { LucideCompass, LucideWifiOff, LucideShieldCheck, LucideUserPlus } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef } from 'react';

export default function GatewayScreen() {
  const { isConnected } = useAuth();
  const router = useRouter();
  const accentColor = useThemeColor({}, 'accent');
  const errorColor = useThemeColor({}, 'error');
  
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
      <LucideCompass size={64} color={accentColor} />
      <ExpeditionText variant="title" size="huge" style={styles.title}>
        The Hunt
      </ExpeditionText>
      <ExpeditionText variant="journal" style={styles.description}>
        Préparez-vous à l'infiltration. Choisissez votre méthode d'identification.
      </ExpeditionText>

      <View style={styles.actions}>
        <ExpeditionButton 
          title="Créer un compte" 
          variant="outline"
          onPress={() => {}} // Not implemented
          style={styles.button}
        />
        <ExpeditionButton 
          title="Se connecter (Google)" 
          variant="outline"
          onPress={() => {}} // Not implemented
          style={styles.button}
        />
        <ExpeditionButton 
          title="Jouer en tant qu'invité" 
          variant="primary"
          onPress={() => router.push('/(auth)/guest')}
          style={styles.button}
        />
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {isConnected === false ? renderOfflineState() : renderOnlineState()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  stateContainer: {
    alignItems: 'center',
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
    marginTop: Spacing.huge,
  },
  button: {
    marginBottom: Spacing.md,
  },
  spacer: {
    height: Spacing.xl,
  },
  retryText: {
    opacity: 0.5,
  }
});
