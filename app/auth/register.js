import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Surface, 
  useTheme, 
  HelperText 
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import apiClient from '../../api/client';

// Registration validation schema
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const theme = useTheme();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('Starting registration process...');
      
      // Create user with Firebase
      console.log('Creating Firebase user...');
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      console.log('Firebase user created successfully');
      
      const idToken = await userCredential.user.getIdToken();
      console.log('Got Firebase ID token');

      // Register user in our backend
      console.log('Registering user in backend...');
      console.log('API URL:', apiClient.defaults.baseURL);
      const response = await apiClient.post('/auth/register', {
        email: values.email
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      console.log('Backend registration response:', response.data);
      
      // Redirect to onboarding after successful signup
      router.replace('/onboarding');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      setError('Registration failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start finding video dates</Text>
        </View>

        <Surface style={styles.formContainer}>
          {error && (
            <HelperText type="error" visible={true}>
              {error}
            </HelperText>
          )}

          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="email" />}
                />
                {touched.email && errors.email && (
                  <HelperText type="error">{errors.email}</HelperText>
                )}

                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password}
                  secureTextEntry={hidePassword}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? "eye" : "eye-off"}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                />
                {touched.password && errors.password && (
                  <HelperText type="error">{errors.password}</HelperText>
                )}

                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword}
                  secureTextEntry={hideConfirmPassword}
                  style={styles.input}
                  mode="outlined"
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={hideConfirmPassword ? "eye" : "eye-off"}
                      onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                    />
                  }
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <HelperText type="error">{errors.confirmPassword}</HelperText>
                )}

                <Button 
                  mode="contained" 
                  onPress={handleSubmit}
                  style={styles.button}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Create Account
                </Button>
              </View>
            )}
          </Formik>
        </Surface>

        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Link href="/auth" asChild>
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.testApiLink}>
          <Link href="/test-api" asChild>
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary }}>
                Test API Connection
              </Text>
            </TouchableOpacity>
          </Link>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  testApiLink: {
    marginTop: 20,
    alignItems: 'center',
  },
});