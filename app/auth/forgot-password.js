import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
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
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

export default function ForgotPassword() {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (values) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError('Password reset failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive a password reset link
        </Text>
      </View>
      
      <Surface style={styles.formContainer}>
        {error && (
          <HelperText type="error" visible={true}>
            {error}
          </HelperText>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Reset link sent! Check your email for instructions.
            </Text>
          </View>
        )}
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleResetPassword}
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
              
              <Button 
                mode="contained" 
                onPress={handleSubmit}
                style={styles.button}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Send Reset Link
              </Button>
            </View>
          )}
        </Formik>
      </Surface>
      
      <View style={styles.footer}>
        <Link href="/auth" asChild>
          <TouchableOpacity>
            <Text style={{ color: theme.colors.primary }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
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
    textAlign: 'center',
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
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successContainer: {
    backgroundColor: '#e6f7ed',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2e7d32',
  },
});