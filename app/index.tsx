import { StyleSheet, View, ScrollView } from 'react-native';
import { ExpeditionView } from '@/components/ui/ExpeditionView';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { LucideCompass, LucideMap, LucideSkull } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Index() {
  const accentColor = useThemeColor({}, 'accent');
  const errorColor = useThemeColor({}, 'error');

  return (
    <ExpeditionView variant="jungle" safe>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <LucideCompass size={48} color={accentColor} />
          <ExpeditionText variant="title" size="huge" style={styles.title}>
            The Hunt
          </ExpeditionText>
          <ExpeditionText variant="journal" size="lg" style={styles.subtitle}>
            Expédition dans la jungle impénétrable
          </ExpeditionText>
        </View>

        <View style={styles.section}>
          <ExpeditionText variant="title" size="lg" style={styles.sectionTitle}>
            Journal d'exploration
          </ExpeditionText>
          <ExpeditionView variant="card" style={styles.card}>
            <ExpeditionText variant="journal">
              "15 Mai 2026. Nous avons atteint la lisière de la zone. 
              Le radar s'affole. Quelque chose nous suit dans l'ombre des fougères..."
            </ExpeditionText>
          </ExpeditionView>
        </View>

        <View style={styles.actions}>
          <ExpeditionButton 
            title="Démarrer l'Expédition" 
            onPress={() => console.log('Start')} 
          />
          <View style={{ height: Spacing.md }} />
          <ExpeditionButton 
            title="Rejoindre un Groupe" 
            variant="outline"
            onPress={() => console.log('Join')} 
          />
          <View style={{ height: Spacing.md }} />
          <ExpeditionButton 
            title="Zone de Danger" 
            variant="danger"
            onPress={() => console.log('Danger')} 
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.iconRow}>
            <LucideMap color={accentColor} size={24} />
            <View style={{ width: Spacing.md }} />
            <LucideSkull color={errorColor} size={24} />
          </View>
          <ExpeditionText variant="mono" size="xs" style={styles.monoText}>
            COORD: 48.8566° N, 2.3522° E | SIGNAL: FAIBLE
          </ExpeditionText>
        </View>
      </ScrollView>
    </ExpeditionView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.huge,
  },
  title: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
    minHeight: 100,
  },
  actions: {
    marginBottom: Spacing.xl,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188, 143, 79, 0.2)',
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  monoText: {
    opacity: 0.6,
  },
});
