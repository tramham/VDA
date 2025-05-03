import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, ProgressBar, TextInput } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wantToChat, setWantToChat] = useState(false);
  const [step, setStep] = useState(1);
  const [feedbackOptions, setFeedbackOptions] = useState({
    enjoyable: false,
    interesting: false,
    boring: false,
    awkward: false,
    goodConnection: false,
    technicalIssues: false,
    wouldCallAgain: false
  });
  
  // Handle rating selection
  const handleRating = (value) => {
    setRating(value);
  };
  
  // Handle feedback option toggle
  const toggleFeedbackOption = (option) => {
    setFeedbackOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && rating === 0) {
      alert('Please rate your call experience.');
      return;
    }
    
    setStep(step + 1);
  };
  
  // Handle submission
  const handleSubmit = () => {
    // In a real app, submit the feedback to your backend
    console.log({
      rating,
      feedback,
      feedbackOptions,
      wantToChat
    });
    
    // Navigate back to main app
    router.push('/main');
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Call Feedback</Text>
        <ProgressBar 
          progress={step / 3} 
          color="#FF4B91" 
          style={styles.progressBar}
        />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <Surface style={styles.card}>
            <View style={styles.matchInfo}>
              <View style={styles.profilePhoto}>
                <Text style={styles.photoInitial}>S</Text>
              </View>
              <View style={styles.matchDetails}>
                <Text style={styles.matchName}>Sophie Wilson</Text>
                <Text style={styles.callDetails}>
                  Video call • 10:00
                </Text>
                <Text style={styles.callDate}>
                  Today, 7:00 PM
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingTitle}>How was your call?</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleRating(value)}
                    style={styles.starButton}
                  >
                    <MaterialIcons
                      name={value <= rating ? "star" : "star-outline"}
                      size={40}
                      color={value <= rating ? "#FFC107" : "#BDBDBD"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingLabel}>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </Text>
            </View>
          </Surface>
        )}
        
        {step === 2 && (
          <Surface style={styles.card}>
            <Text style={styles.cardTitle}>What did you think?</Text>
            <Text style={styles.cardSubtitle}>
              Select all that apply to your experience
            </Text>
            
            <View style={styles.feedbackOptionsContainer}>
              {[
                { key: 'enjoyable', label: 'Enjoyable' },
                { key: 'interesting', label: 'Interesting conversation' },
                { key: 'boring', label: 'Boring' },
                { key: 'awkward', label: 'Awkward' },
                { key: 'goodConnection', label: 'Good connection' },
                { key: 'technicalIssues', label: 'Technical issues' },
                { key: 'wouldCallAgain', label: 'Would call again' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.feedbackOption,
                    feedbackOptions[option.key] && styles.selectedFeedbackOption
                  ]}
                  onPress={() => toggleFeedbackOption(option.key)}
                >
                  <Text
                    style={[
                      styles.feedbackOptionText,
                      feedbackOptions[option.key] && styles.selectedFeedbackOptionText
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              label="Additional feedback (optional)"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              style={styles.feedbackInput}
              mode="outlined"
            />
          </Surface>
        )}
        
        {step === 3 && (
          <Surface style={styles.card}>
            <Text style={styles.cardTitle}>Would you like to chat?</Text>
            <Text style={styles.cardSubtitle}>
              You can continue your conversation via chat
            </Text>
            
            <View style={styles.chatOptionContainer}>
              <View style={styles.chatOption}>
                <TouchableOpacity
                  style={[
                    styles.chatOptionButton,
                    wantToChat && styles.selectedChatOption
                  ]}
                  onPress={() => setWantToChat(true)}
                >
                  <MaterialIcons
                    name="check"
                    size={40}
                    color={wantToChat ? "#fff" : "#BDBDBD"}
                  />
                </TouchableOpacity>
                <Text style={styles.chatOptionText}>Yes, let's chat</Text>
              </View>
              
              <View style={styles.chatOption}>
                <TouchableOpacity
                  style={[
                    styles.chatOptionButton,
                    !wantToChat && styles.selectedChatOption
                  ]}
                  onPress={() => setWantToChat(false)}
                >
                  <MaterialIcons
                    name="close"
                    size={40}
                    color={!wantToChat ? "#fff" : "#BDBDBD"}
                  />
                </TouchableOpacity>
                <Text style={styles.chatOptionText}>No, thanks</Text>
              </View>
            </View>
            
            <Text style={styles.chatDisclaimer}>
              {wantToChat
                ? "We'll open a chat with this match after submitting your feedback."
                : "You can always change your mind later in the Matches tab."
              }
            </Text>
          </Surface>
        )}
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        {step > 1 && (
          <Button 
            mode="outlined" 
            onPress={() => setStep(step - 1)}
            style={[styles.button, { marginRight: 10 }]}
          >
            Back
          </Button>
        )}
        
        {step < 3 ? (
          <Button 
            mode="contained" 
            onPress={handleNextStep}
            style={styles.button}
          >
            Next
          </Button>
        ) : (
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.button}
          >
            Submit
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4B91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInitial: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  matchDetails: {
    marginLeft: 15,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  callDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  callDate: {
    fontSize: 14,
    color: '#777',
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    color: '#555',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  feedbackOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  feedbackOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFeedbackOption: {
    backgroundColor: '#FF4B91',
  },
  feedbackOptionText: {
    color: '#555',
  },
  selectedFeedbackOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  feedbackInput: {
    marginTop: 10,
  },
  chatOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  chatOption: {
    alignItems: 'center',
  },
  chatOptionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedChatOption: {
    backgroundColor: '#FF4B91',
  },
  chatOptionText: {
    fontSize: 16,
    color: '#555',
  },
  chatDisclaimer: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 20,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
  },
});