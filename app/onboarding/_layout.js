import { Stack } from 'expo-router';
import { PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF4B91',
    secondary: '#6C63FF',
    accent: '#00D1B0',
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
};

export default function OnboardingLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="photo-upload" />
        <Stack.Screen name="profile-details" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="schedule-setup" /> 
      </Stack>
    </PaperProvider>
  );
}