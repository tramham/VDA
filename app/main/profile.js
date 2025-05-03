import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, List, Avatar, Switch, Chip, TextInput, Menu, Portal, Modal } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('25');
  const [dealBreakers, setDealBreakers] = useState([]);
  const [customQuestions, setCustomQuestions] = useState(['', '', '']);
  const [showDealBreakersMenu, setShowDealBreakersMenu] = useState(false);

  const relationshipPreferences = [
    { emoji: '💝', label: 'Long-term Relationship' },
    { emoji: '💫', label: 'Casual Dating' },
    { emoji: '🤝', label: 'Friendship' },
    { emoji: '💍', label: 'Marriage' },
  ];

  const interests = [
    { emoji: '🎸', label: 'Music' },
    { emoji: '🏃‍♂️', label: 'Hiking' },
    { emoji: '☕️', label: 'Coffee' },
    { emoji: '💻', label: 'Technology' },
    { emoji: '✈️', label: 'Travel' },
    { emoji: '🎨', label: 'Art' },
    { emoji: '📚', label: 'Reading' },
    { emoji: '🍳', label: 'Cooking' },
  ];

  const relationshipValues = [
    { emoji: '🤝', label: 'Communication' },
    { emoji: '💪', label: 'Independence' },
    { emoji: '❤️', label: 'Romance' },
    { emoji: '🎯', label: 'Goals' },
    { emoji: '🌱', label: 'Growth' },
  ];

  const genderOptions = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Non-binary', value: 'non-binary' },
  ];

  const distanceOptions = [
    { label: '10 miles', value: '10' },
    { label: '25 miles', value: '25' },
    { label: '50 miles', value: '50' },
    { label: '100 miles', value: '100' },
    { label: 'No limit', value: 'none' },
  ];

  const dealBreakersOptions = [
    { category: 'Religion', options: ['Christian', 'Jewish', 'Muslim', 'Hindu', 'Buddhist', 'Atheist'] },
    { category: 'Education', options: ['High School', 'Some College', 'Bachelor\'s', 'Master\'s', 'Doctorate'] },
    { category: 'Income', options: ['$0-50k', '$50k-100k', '$100k-150k', '$150k+'] },
    { category: 'Smoking', options: ['Smoker', 'Non-smoker'] },
    { category: 'Children', options: ['Has children', 'No children', 'Wants children', 'Doesn\'t want children'] },
  ];

  const additionalRelationshipValues = [
    { emoji: '🎓', label: 'Education' },
    { emoji: '💰', label: 'Financial Stability' },
    { emoji: '🌍', label: 'Cultural Values' },
    { emoji: '👨‍👩‍👧‍👦', label: 'Family' },
    { emoji: '🏠', label: 'Home Life' },
    { emoji: '🎯', label: 'Career Goals' },
    { emoji: '🧘‍♀️', label: 'Lifestyle' },
    { emoji: '🤝', label: 'Shared Values' },
  ];

  const handleLogout = () => {
    router.replace('/auth');
  };

  const handleGenderToggle = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const handleDealBreakerAdd = (category, value) => {
    setDealBreakers(prev => [...prev, { category, value }]);
    setShowDealBreakersMenu(false);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...customQuestions];
    newQuestions[index] = value;
    setCustomQuestions(newQuestions);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.profileHeader}>
        <Avatar.Text 
          size={100} 
          label="JD" 
          backgroundColor="#FF4B91" 
          color="white"
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.location}>28 • San Francisco</Text>
        <Button 
          mode="contained" 
          style={styles.editButton}
          buttonColor="#FF4B91"
        >
          Edit Profile
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>
          Software engineer by day, guitarist by night. Love hiking and trying new coffee shops.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Looking For</Text>
        <View style={styles.chipContainer}>
          {relationshipPreferences.map((pref, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
            >
              {pref.emoji} {pref.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relationship Values</Text>
        <View style={styles.chipContainer}>
          {relationshipValues.map((value, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
            >
              {value.emoji} {value.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.chipContainer}>
          {interests.map((interest, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
            >
              {interest.emoji} {interest.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Preferences</Text>
        
        <Text style={styles.subsectionTitle}>Interested In</Text>
        <View style={styles.chipContainer}>
          {genderOptions.map((gender) => (
            <Chip
              key={gender.value}
              selected={selectedGenders.includes(gender.value)}
              onPress={() => handleGenderToggle(gender.value)}
              style={styles.chip}
              mode="outlined"
            >
              {gender.label}
            </Chip>
          ))}
        </View>

        <Text style={styles.subsectionTitle}>Location</Text>
        <TextInput
          mode="outlined"
          label="City"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />

        <Text style={styles.subsectionTitle}>Distance</Text>
        <View style={styles.chipContainer}>
          {distanceOptions.map((option) => (
            <Chip
              key={option.value}
              selected={distance === option.value}
              onPress={() => setDistance(option.value)}
              style={styles.chip}
              mode="outlined"
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deal Breakers</Text>
        <View style={styles.chipContainer}>
          {dealBreakers.map((breaker, index) => (
            <Chip
              key={index}
              onClose={() => setDealBreakers(prev => prev.filter((_, i) => i !== index))}
              style={styles.chip}
              mode="outlined"
            >
              {breaker.category}: {breaker.value}
            </Chip>
          ))}
        </View>
        <Button
          mode="outlined"
          onPress={() => setShowDealBreakersMenu(true)}
          style={styles.addButton}
        >
          Add Deal Breaker
        </Button>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Questions</Text>
        <Text style={styles.subsectionDescription}>
          Add three questions you'd like others to ask you
        </Text>
        {customQuestions.map((question, index) => (
          <TextInput
            key={index}
            mode="outlined"
            label={`Question ${index + 1}`}
            value={question}
            onChangeText={(value) => handleQuestionChange(index, value)}
            style={styles.input}
          />
        ))}
      </View>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        <List.Item
          title="Account Settings"
          left={props => <List.Icon {...props} icon="account-cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Dark Mode"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              color="#FF4B91"
            />
          )}
        />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              color="#FF4B91"
            />
          )}
        />
        <List.Item
          title="Privacy Settings"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Help & Support"
          left={props => <List.Icon {...props} icon="help-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <Button 
        mode="text" 
        onPress={handleLogout}
        textColor="#F44336"
        style={styles.logoutButton}
      >
        Log Out
      </Button>

      <Portal>
        <Modal
          visible={showDealBreakersMenu}
          onDismiss={() => setShowDealBreakersMenu(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            {dealBreakersOptions.map((category) => (
              <View key={category.category}>
                <Text style={styles.modalCategory}>{category.category}</Text>
                {category.options.map((option) => (
                  <Button
                    key={option}
                    onPress={() => handleDealBreakerAdd(category.category, option)}
                    style={styles.modalOption}
                  >
                    {option}
                  </Button>
                ))}
              </View>
            ))}
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    marginTop: 15,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  chip: {
    margin: 5,
    backgroundColor: '#f8f8f8',
    borderColor: '#FF4B91',
  },
  chipText: {
    fontSize: 14,
  },
  divider: {
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    margin: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  subsectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    marginTop: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  modalOption: {
    marginVertical: 5,
  },
});