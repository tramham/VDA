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

export default function AuthLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </PaperProvider>
  );
}