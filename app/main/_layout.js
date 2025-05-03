import { Tabs } from 'expo-router';
import { PaperProvider, DefaultTheme, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

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

export default function MainLayout() {
  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#FF4B91',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'discovery') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'matches') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'upcoming') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen
          name="discovery"
          options={{
            title: 'Discovery',
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
          }}
        />
        <Tabs.Screen
          name="upcoming"
          options={{
            title: 'Upcoming',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}