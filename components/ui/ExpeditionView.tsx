import { View, ViewProps, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ExpeditionViewProps extends ViewProps {
  variant?: 'default' | 'parchment' | 'jungle' | 'card';
  safe?: boolean;
}

export function ExpeditionView({
  style,
  variant = 'default',
  safe = false,
  children,
  ...rest
}: ExpeditionViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const Container = safe ? SafeAreaView : View;

  if (variant === 'jungle' || variant === 'parchment') {
    const gradientColors = variant === 'jungle' 
      ? [Colors.dark.background, '#0A150E'] 
      : [Colors.light.background, '#E8DCC4'];

    return (
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={[styles.full, style]}
      >
        <Container style={styles.full} {...rest}>
          {children}
        </Container>
      </LinearGradient>
    );
  }

  return (
    <Container
      style={[
        styles.default,
        variant === 'card' && {
          backgroundColor: colors.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  default: {
    flex: 1,
  },
});
