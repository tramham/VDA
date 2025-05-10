import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { 
  Text, 
  Button, 
  Surface, 
  useTheme 
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';

export default function Welcome() {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>VD</Text>
          </View>
          <Text style={styles.appName}>VideoDate</Text>
          <Text style={styles.tagline}>
            Connect meaningfully through video, not just texts
          </Text>
        </View>

        <Surface style={styles.messageContainer}>
          <Text style={styles.welcomeTitle}>Welcome to VideoDate!</Text>
          <Text style={styles.welcomeMessage}>
            Our mission is to bring people together face to face and establish genuine connections. 
            We believe that real conversations happen when you can see and hear each other, 
            creating a more authentic dating experience.
          </Text>
        </Surface>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={() => router.push('/auth/register')}
            style={styles.button}
          >
            Create Account
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => router.push('/auth')}
            style={styles.button}
          >
            Log In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#666',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  messageContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 8,
  },
}); 