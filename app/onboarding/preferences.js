import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { router } from 'expo-router';

export default function Preferences() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const interests = [
    'Travel', 'Fitness', 'Reading', 'Cooking', 'Movies',
    'Music', 'Art', 'Photography', 'Hiking', 'Gaming',
    'Technology', 'Fashion', 'Sports', 'Dancing', 'Writing'
  ];
  
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleNext = () => {
    router.push('/onboarding/schedule-setup');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Interests</Text>
        <Text style={styles.subtitle}>Select topics you enjoy talking about</Text>
        
        <View style={styles.interestsContainer}>
          {interests.map(interest => (
            <Chip
              key={interest}
              selected={selectedInterests.includes(interest)}
              onPress={() => toggleInterest(interest)}
              style={[
                styles.interestChip,
                selectedInterests.includes(interest) && styles.selectedChip
              ]}
              textStyle={selectedInterests.includes(interest) ? styles.selectedChipText : {}}
            >
              {interest}
            </Chip>
          ))}
        </View>
        
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
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  interestChip: {
    margin: 5,
  },
  selectedChip: {
    backgroundColor: '#FF4B91',
  },
  selectedChipText: {
    color: 'white',
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