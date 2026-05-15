import { StyleSheet } from 'react-native';
import { ExpeditionView } from '@/components/ui/ExpeditionView';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';

export default function AppIndex() {
  const { user, signOut } = useAuth();

  return (
    <ExpeditionView variant="jungle" safe style={styles.container}>
      <ExpeditionText variant="title" size="xl">
        Camp de Base
      </ExpeditionText>
      <ExpeditionText variant="journal" style={styles.welcome}>
        Bienvenue, {user?.username}. L'expédition est prête.
      </ExpeditionText>
      
      <ExpeditionButton 
        title="Se déconnecter" 
        variant="outline" 
        onPress={signOut} 
        style={styles.button}
      />
    </ExpeditionView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.huge,
    width: '100%',
  },
});
