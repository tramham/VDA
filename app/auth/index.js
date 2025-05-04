import React, { useState } from 'react';
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
  TextInput, 
  Button, 
  Surface, 
  useTheme, 
  HelperText 
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Link, router, Redirect } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import apiClient from '../../api/client';


// Login validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const theme = useTheme();
  const [hidePassword, setHidePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (values) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      // 2. Get the Firebase ID token
      const idToken = await user.getIdToken();
      
      // 3. Create/update user in our backend
      try {
        const response = await apiClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        // If we get here, the user exists in our database
        console.log('User exists in backend:', response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // User doesn't exist in our database, create them
          const createResponse = await apiClient.post('/users/', {
            email: user.email,
            firebase_uid: user.uid
          }, {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          });
          console.log('Created user in backend:', createResponse.data);
        } else {
          throw error;
        }
      }
      
      // 4. Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
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
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>VD</Text>
          </View>
          <Text style={styles.appName}>VideoDate</Text>
          <Text style={styles.tagline}>
            Connect meaningfully through video, not just texts
          </Text>
        </View>

        <Surface style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          
          {error && (
            <HelperText type="error" visible={true}>
              {error}
            </HelperText>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
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

                <Link href="/auth/forgot-password" asChild>
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={{ color: theme.colors.primary }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </Link>

                <Button 
                  mode="contained" 
                  onPress={handleSubmit}
                  style={styles.button}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </View>
            )}
          </Formik>
        </Surface>

        <View style={styles.footer}>
          <Text>Don't have an account? </Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                Sign Up
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF4B91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#777',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
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
});
