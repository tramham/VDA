import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  useTheme,
  HelperText,
  Chip,
  List,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Slider from '@miblanchard/react-native-slider';
import apiClient from '../../api/client';
import { auth } from '../../firebaseConfig';

// Suggested interests
const SUGGESTED_INTERESTS = [
  'Tennis', 'Badminton', 'Basketball', 'Soccer', 'Swimming', 'Running',
  'Hiking', 'Reading', 'Cooking', 'Photography', 'Music', 'Art',
  'Travel', 'Movies', 'Gaming', 'Yoga', 'Meditation', 'Dancing'
];

// Suggested questions
const SUGGESTED_QUESTIONS = [
  "What are your biggest dreams and goals?",
  "How are you feeling or what are you up to this week?",
  "What is your fondest memory?",
  "What's your favorite way to spend a weekend?",
  "What's something you're passionate about?",
  "What's your idea of a perfect date?"
];

// Profile validation schema
const ProfileSchema = Yup.object().shape({
  bio: Yup.string()
    .max(150, 'Bio must be less than 150 characters')
    .required('Bio is required'),
  age: Yup.number()
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Please enter a valid age')
    .required('Age is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other', ''], 'Please select a valid gender')
    .required('Gender is required'),
  interests: Yup.array()
    .max(6, 'You can select up to 6 interests')
    .required('At least one interest is required'),
  location: Yup.string().required('Location is required'),
  preferred_gender: Yup.string()
    .oneOf(['male', 'female', 'any', ''], 'Please select a valid preference')
    .required('Preferred gender is required'),
  min_age_preference: Yup.number()
    .min(18, 'Minimum age must be at least 18')
    .max(100, 'Please enter a valid age')
    .required('Minimum age preference is required'),
  max_age_preference: Yup.number()
    .min(18, 'Maximum age must be at least 18')
    .max(100, 'Please enter a valid age')
    .required('Maximum age preference is required'),
  max_distance: Yup.number()
    .min(1, 'Minimum distance must be at least 1 mile')
    .max(100, 'Maximum distance is 100 miles')
    .required('Maximum distance is required'),
  questions: Yup.array()
    .max(3, 'You can add up to 3 questions')
    .required('At least one question is required'),
});

export default function ProfileScreen() {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredInterests, setFilteredInterests] = useState([]);
  const [interestInput, setInterestInput] = useState('');
  const [showInterests, setShowInterests] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (interestInput.length > 0) {
      const filtered = SUGGESTED_INTERESTS.filter(interest =>
        interest.toLowerCase().includes(interestInput.toLowerCase())
      );
      setFilteredInterests(filtered);
      setShowInterests(true);
    } else {
      setFilteredInterests([]);
      setShowInterests(false);
    }
  }, [interestInput]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/users/me');
      setProfile(response.data);
    } catch (error) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await apiClient.put(`/users/${profile.id}`, values);
      setProfile(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInterestSelect = (interest, setFieldValue, values) => {
    if (values.interests.length < 6 && !values.interests.includes(interest)) {
      setFieldValue('interests', [...values.interests, interest]);
    }
    setInterestInput('');
    setShowInterests(false);
  };

  const handleQuestionSelect = (question, setFieldValue, values) => {
    if (values.questions.length < 3 && !values.questions.includes(question)) {
      setFieldValue('questions', [...values.questions, question]);
    }
    setShowQuestions(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Edit Profile</Text>
          
          {error && (
            <HelperText type="error" visible={true}>
              {error}
            </HelperText>
          )}

          <Formik
            initialValues={{
              bio: profile?.bio || '',
              age: profile?.age || '',
              gender: profile?.gender || '',
              interests: profile?.interests || [],
              location: profile?.location || '',
              preferred_gender: profile?.preferred_gender || '',
              min_age_preference: profile?.min_age_preference || 18,
              max_age_preference: profile?.max_age_preference || 100,
              max_distance: profile?.max_distance || 50,
              questions: profile?.questions || [],
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
              <View style={styles.form}>
                <TextInput
                  label="Bio"
                  value={values.bio}
                  onChangeText={handleChange('bio')}
                  onBlur={handleBlur('bio')}
                  error={touched.bio && errors.bio}
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  mode="outlined"
                  maxLength={150}
                />
                <Text style={styles.characterCount}>
                  {values.bio.length}/150 characters
                </Text>
                {touched.bio && errors.bio && (
                  <HelperText type="error">{errors.bio}</HelperText>
                )}

                <TextInput
                  label="Age"
                  value={values.age?.toString()}
                  onChangeText={handleChange('age')}
                  onBlur={handleBlur('age')}
                  error={touched.age && errors.age}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
                {touched.age && errors.age && (
                  <HelperText type="error">{errors.age}</HelperText>
                )}

                <TextInput
                  label="Gender"
                  value={values.gender}
                  onChangeText={handleChange('gender')}
                  onBlur={handleBlur('gender')}
                  error={touched.gender && errors.gender}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.gender && errors.gender && (
                  <HelperText type="error">{errors.gender}</HelperText>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.chipContainer}>
                    {values.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        onClose={() => {
                          const newInterests = values.interests.filter((_, i) => i !== index);
                          setFieldValue('interests', newInterests);
                        }}
                        style={styles.chip}
                      >
                        {interest}
                      </Chip>
                    ))}
                  </View>
                  <TextInput
                    label="Add Interest"
                    value={interestInput}
                    onChangeText={setInterestInput}
                    style={styles.input}
                    mode="outlined"
                  />
                  {showInterests && (
                    <View style={styles.suggestionsContainer}>
                      {filteredInterests.map((interest, index) => (
                        <List.Item
                          key={index}
                          title={interest}
                          onPress={() => handleInterestSelect(interest, setFieldValue, values)}
                        />
                      ))}
                    </View>
                  )}
                  {touched.interests && errors.interests && (
                    <HelperText type="error">{errors.interests}</HelperText>
                  )}
                </View>

                <TextInput
                  label="Location"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  error={touched.location && errors.location}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.location && errors.location && (
                  <HelperText type="error">{errors.location}</HelperText>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Match Preferences</Text>
                  
                  <View style={styles.preferenceGroup}>
                    <Text style={styles.preferenceLabel}>Age Range</Text>
                    <View style={styles.row}>
                      <TextInput
                        label="Min Age"
                        value={values.min_age_preference?.toString()}
                        onChangeText={(text) => setFieldValue('min_age_preference', Number(text))}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                      />
                      <TextInput
                        label="Max Age"
                        value={values.max_age_preference?.toString()}
                        onChangeText={(text) => setFieldValue('max_age_preference', Number(text))}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                      />
                    </View>
                  </View>

                  <View style={styles.preferenceGroup}>
                    <Text style={styles.preferenceLabel}>Maximum Distance</Text>
                    <TextInput
                      label="Max Distance (miles)"
                      value={values.max_distance?.toString()}
                      onChangeText={(text) => setFieldValue('max_distance', Number(text))}
                      keyboardType="numeric"
                      style={styles.input}
                      mode="outlined"
                    />
                  </View>

                  <TextInput
                    label="Preferred Gender"
                    value={values.preferred_gender}
                    onChangeText={handleChange('preferred_gender')}
                    onBlur={handleBlur('preferred_gender')}
                    error={touched.preferred_gender && errors.preferred_gender}
                    style={styles.input}
                    mode="outlined"
                  />
                  {touched.preferred_gender && errors.preferred_gender && (
                    <HelperText type="error">{errors.preferred_gender}</HelperText>
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Questions for Matches</Text>
                  <View style={styles.chipContainer}>
                    {values.questions.map((question, index) => (
                      <Chip
                        key={index}
                        onClose={() => {
                          const newQuestions = values.questions.filter((_, i) => i !== index);
                          setFieldValue('questions', newQuestions);
                        }}
                        style={styles.chip}
                      >
                        {question}
                      </Chip>
                    ))}
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => setShowQuestions(true)}
                    style={styles.button}
                  >
                    Add Question
                  </Button>
                  {showQuestions && (
                    <View style={styles.suggestionsContainer}>
                      {SUGGESTED_QUESTIONS.map((question, index) => (
                        <List.Item
                          key={index}
                          title={question}
                          onPress={() => handleQuestionSelect(question, setFieldValue, values)}
                        />
                      ))}
                    </View>
                  )}
                  {touched.questions && errors.questions && (
                    <HelperText type="error">{errors.questions}</HelperText>
                  )}
                </View>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save Profile
                </Button>
              </View>
            )}
          </Formik>
        </Surface>
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
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  characterCount: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  preferenceGroup: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
}); 