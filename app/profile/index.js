import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/client';
import { auth } from '../../firebaseConfig';

// Profile validation schema
const ProfileSchema = Yup.object().shape({
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
  age: Yup.number()
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Please enter a valid age'),
  gender: Yup.string().oneOf(['male', 'female', 'other', ''], 'Please select a valid gender'),
  interests: Yup.string(),
  location: Yup.string(),
  preferred_gender: Yup.string().oneOf(['male', 'female', 'any', ''], 'Please select a valid preference'),
  min_age_preference: Yup.number()
    .min(18, 'Minimum age must be at least 18')
    .max(100, 'Please enter a valid age'),
  max_age_preference: Yup.number()
    .min(18, 'Maximum age must be at least 18')
    .max(100, 'Please enter a valid age'),
});

export default function ProfileScreen() {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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
              interests: profile?.interests || '',
              location: profile?.location || '',
              preferred_gender: profile?.preferred_gender || '',
              min_age_preference: profile?.min_age_preference || 18,
              max_age_preference: profile?.max_age_preference || 100,
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
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
                />
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

                <TextInput
                  label="Interests"
                  value={values.interests}
                  onChangeText={handleChange('interests')}
                  onBlur={handleBlur('interests')}
                  error={touched.interests && errors.interests}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.interests && errors.interests && (
                  <HelperText type="error">{errors.interests}</HelperText>
                )}

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

                <TextInput
                  label="Minimum Age Preference"
                  value={values.min_age_preference?.toString()}
                  onChangeText={handleChange('min_age_preference')}
                  onBlur={handleBlur('min_age_preference')}
                  error={touched.min_age_preference && errors.min_age_preference}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
                {touched.min_age_preference && errors.min_age_preference && (
                  <HelperText type="error">{errors.min_age_preference}</HelperText>
                )}

                <TextInput
                  label="Maximum Age Preference"
                  value={values.max_age_preference?.toString()}
                  onChangeText={handleChange('max_age_preference')}
                  onBlur={handleBlur('max_age_preference')}
                  error={touched.max_age_preference && errors.max_age_preference}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
                {touched.max_age_preference && errors.max_age_preference && (
                  <HelperText type="error">{errors.max_age_preference}</HelperText>
                )}

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
}); 