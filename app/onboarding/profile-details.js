import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import apiClient from '../../api/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Profile validation schema
const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Please enter a valid age')
    .required('Age is required'),
  location: Yup.string().required('Location is required'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
});

export default function ProfileDetails() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = async (values) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const idToken = await user.getIdToken();
      
      // Update user profile in backend
      await apiClient.put('/users/me/profile', {
        bio: values.bio,
        age: parseInt(values.age),
        gender: values.gender,
        location: values.location
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      router.push('/onboarding/preferences');
    } catch (error) {
      console.error(error);
      setError('Failed to save profile: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Formik
          initialValues={{ name: '', age: '', location: '', bio: '' }}
          validationSchema={ProfileSchema}
          onSubmit={handleNext}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={values.age}
                onChangeText={handleChange('age')}
                onBlur={handleBlur('age')}
              />
              {touched.age && errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={values.location}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
              />
              {touched.location && errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
              
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Bio - Tell potential matches about yourself"
                multiline
                numberOfLines={4}
                value={values.bio}
                onChangeText={handleChange('bio')}
                onBlur={handleBlur('bio')}
              />
              {touched.bio && errors.bio && (
                <Text style={styles.errorText}>{errors.bio}</Text>
              )}
              
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
                  onPress={handleSubmit}
                  style={styles.button}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </View>
            </>
          )}
        </Formik>
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
  errorText: {
    color: 'red',
    marginBottom: 20,
  }
});