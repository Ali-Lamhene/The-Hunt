import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { 
  DMSans_400Regular, 
  DMSans_700Bold 
} from '@expo-google-fonts/dm-sans';

import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, isLoading: isAuthLoading, isConnected } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    SpecialElite_400Regular,
    DMSans_400Regular,
    DMSans_700Bold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    // 1. Priorité absolue : Connexion Internet
    // Si déconnecté, on force le retour vers la Gateway (qui gère l'état offline)
    if (isConnected === false) {
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
      return;
    }

    // 2. Priorité Identité : Si pas d'utilisateur, direction Auth
    if (!user) {
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    } else if (inAuthGroup) {
      // Si connecté et dans auth, on envoie vers l'app
      router.replace('/(app)');
    }
  }, [user, isAuthLoading, isConnected, segments, fontsLoaded]);

  if ((!fontsLoaded && !fontError) || isAuthLoading) {
    return null;
  }

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: Colors[colorScheme ?? 'light'].primary,
      background: Colors[colorScheme ?? 'light'].background,
      card: Colors[colorScheme ?? 'light'].surface,
      text: Colors[colorScheme ?? 'light'].text,
      border: Colors[colorScheme ?? 'light'].border,
      notification: Colors[colorScheme ?? 'light'].error,
    },
  };

  return (
    <ThemeProvider value={customTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(game)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
