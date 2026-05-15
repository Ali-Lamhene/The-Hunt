import { StyleSheet, View, Animated } from 'react-native';
import { ExpeditionView } from '@/components/ui/ExpeditionView';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { useRef, useEffect } from 'react';
import Svg, { Path, G, Circle, Line } from 'react-native-svg';

const JungleCorners = ({ intensity = 1, dark = false }: { intensity?: number; dark?: boolean }) => {
  const col = dark ? "#e8d5a3" : "#1a5c30";
  const op = dark ? 0.13 * intensity : 0.08 * intensity;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <G opacity={op} fill={col}>
          <Path d="M-20 -10 Q60 10 90 80 Q50 95 10 60 Q-15 35 -20 -10Z"/>
          <Path d="M-30 30 Q50 25 75 100 Q30 105 -10 70 Q-28 55 -30 30Z"/>
        </G>
        <G opacity={op} fill={col}>
          <Path d="M410 -10 Q330 10 300 80 Q340 95 380 60 Q415 35 410 -10Z"/>
          <Path d="M420 30 Q340 25 315 100 Q360 105 400 70 Q418 55 420 30Z"/>
        </G>
      </Svg>
    </View>
  );
};

export default function AppIndex() {
  const { user, signOut } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <JungleCorners dark intensity={0.8} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <ExpeditionText variant="title" size="xl" style={styles.title}>
            Camp de Base
          </ExpeditionText>
          <ExpeditionText variant="journal" style={styles.welcome}>
            Bienvenue, Agent <ExpeditionText variant="title" size="sm" style={{color: "#c0392b"}}>{user?.username}</ExpeditionText>.{"\n"}
            L'expédition est prête à démarrer.
          </ExpeditionText>
        </View>

        <View style={styles.card}>
          <ExpeditionText variant="mono" size="xs" style={styles.cardLabel}>ÉTAT DE LA MISSION</ExpeditionText>
          <ExpeditionText variant="journal" style={styles.cardText}>
            "Les capteurs indiquent une activité inhabituelle dans le secteur 7. 
            Préparez votre équipement et attendez les ordres."
          </ExpeditionText>
        </View>
        
        <View style={styles.actions}>
          <ExpeditionButton 
            title="Démarrer la Traque" 
            variant="primary" 
            onPress={() => {}} 
            style={styles.actionButton}
          />
          <ExpeditionButton 
            title="Quitter l'Expédition" 
            variant="danger" 
            onPress={signOut} 
            style={styles.actionButton}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0802',
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
    fontSize: 42,
    color: "#e8d5a3",
    textAlign: 'center',
  },
  welcome: {
    marginTop: Spacing.md,
    textAlign: 'center',
    color: "#7a5c3a",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "rgba(232, 213, 163, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(232, 213, 163, 0.1)",
    borderRadius: 4,
    padding: Spacing.lg,
    marginBottom: Spacing.huge,
  },
  cardLabel: {
    color: "#c0392b",
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  cardText: {
    color: "#c4a882",
    fontStyle: 'italic',
  },
  actions: {
    width: '100%',
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
});
