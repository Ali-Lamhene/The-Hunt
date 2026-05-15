import { Stack } from 'expo-router';
import { ExpeditionView } from '@/components/ui/ExpeditionView';

export default function AuthLayout() {
  return (
    <ExpeditionView variant="jungle">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      />
    </ExpeditionView>
  );
}
