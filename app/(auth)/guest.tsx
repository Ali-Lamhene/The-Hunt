import { StyleSheet, View, TextInput } from 'react-native';
import { useState } from 'react';
import { ExpeditionText } from '@/components/ui/ExpeditionText';
import { ExpeditionButton } from '@/components/ui/ExpeditionButton';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/context/AuthContext';
import { Typography } from '@/constants/Typography';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function GuestScreen() {
  const [username, setUsername] = useState('');
  const { signInAsGuest } = useAuth();
  const accentColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');

  const handleSignIn = () => {
    if (username.length >= 3 && username.length <= 12) {
      signInAsGuest(username);
    }
  };

  return (
    <View style={styles.container}>
      <ExpeditionText variant="title" size="xl" style={styles.title}>
        Identité de Terrain
      </ExpeditionText>
      <ExpeditionText variant="journal" style={styles.description}>
        Gravez votre nom dans les registres de l'expédition. 
        (3-12 caractères, Majuscules uniquement)
      </ExpeditionText>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: accentColor, borderColor: accentColor }]}
          value={username}
          onChangeText={(text) => setUsername(text.toUpperCase().replace(/[^A-Z0-9_.]/g, ''))}
          placeholder="PSEUDONYME"
          placeholderTextColor="rgba(188, 143, 79, 0.3)"
          maxLength={12}
          autoFocus
        />
      </View>

      <ExpeditionButton
        title="Valider l'Identité"
        onPress={handleSignIn}
        disabled={username.length < 3}
        style={[styles.button, username.length < 3 && { opacity: 0.5 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: Spacing.md,
  },
  description: {
    textAlign: 'center',
    marginBottom: Spacing.huge,
    opacity: 0.8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  input: {
    fontFamily: Typography.family.title,
    fontSize: Typography.size.xl,
    borderBottomWidth: 2,
    paddingVertical: Spacing.sm,
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    width: '100%',
  },
});
