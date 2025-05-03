import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Divider, Card, Title, Paragraph } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

export default function TestIntroScreen() {
  // Function to navigate to a specific screen
  const navigateTo = (path) => {
    router.push(path);
  };

  // Group screens by category for better organization
  const screenGroups = [
    {
      title: 'Authentication',
      screens: [
        { name: 'Login', path: '/auth' },
        { name: 'Register', path: '/auth/register' },
        { name: 'Forgot Password', path: '/auth/forgot-password' },
      ]
    },
    {
      title: 'Onboarding',
      screens: [
        { name: 'Onboarding Intro', path: '/onboarding' },
        { name: 'Profile Details', path: '/onboarding/profile-details' },
        { name: 'Preferences', path: '/onboarding/preferences' },
        { name: 'Photo Upload', path: '/onboarding/photo-upload' },
        { name: 'Schedule Setup', path: '/onboarding/schedule-setup' },
      ]
    },
    {
      title: 'Main App',
      screens: [
        { name: 'Profile', path: '/main/profile' },
        { name: 'Discovery', path: '/main/discovery' },
        { name: 'Matches', path: '/main/matches' },
        { name: 'Upcoming', path: '/main/upcoming' },
      ]
    },
    {
      title: 'Other Screens',
      screens: [
        { name: 'Feedback', path: '/feedback' },
        { name: 'Video Call', path: '/video-call' },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <Title style={styles.title}>Test Navigation</Title>
          <Paragraph style={styles.subtitle}>
            Select a screen to navigate to for testing purposes
          </Paragraph>
          <Divider style={styles.divider} />
        </View>

        {screenGroups.map((group, groupIndex) => (
          <Card key={groupIndex} style={styles.card}>
            <Card.Content>
              <Title style={styles.groupTitle}>{group.title}</Title>
              <View style={styles.buttonContainer}>
                {group.screens.map((screen, screenIndex) => (
                  <Button
                    key={screenIndex}
                    mode="outlined"
                    onPress={() => navigateTo(screen.path)}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    {screen.name}
                  </Button>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a development-only screen. Set isDevelopment to false in app/index.js when ready for production.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  divider: {
    marginTop: 15,
    marginBottom: 5,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  button: {
    margin: 5,
    borderRadius: 20,
    borderColor: '#FF4B91',
  },
  buttonLabel: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 