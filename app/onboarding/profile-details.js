import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function ProfileDetails() {
  const handleNext = () => {
    router.push('/onboarding/preferences');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Location"
        />
        
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Bio - Tell potential matches about yourself"
          multiline
          numberOfLines={4}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
          >
            Back
          </Button>
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '48%',
  },
});