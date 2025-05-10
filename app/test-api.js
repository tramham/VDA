import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import apiClient from '../api/client';

export default function TestAPI() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection to:', apiClient.defaults.baseURL);
        const response = await apiClient.get('/');
        console.log('API Response:', response.data);
        setMessage(response.data.message);
      } catch (err) {
        console.error('API Test Error:', err);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
          setError(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          // The request was made but no response was received
          console.error('Error request:', err.request);
          setError('No response received from server. Please check if the server is running and accessible.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.subtitle}>Testing connection to: {apiClient.defaults.baseURL}</Text>
      
      {loading ? (
        <Text style={styles.loading}>Testing connection...</Text>
      ) : message ? (
        <Text style={styles.success}>Success: {message}</Text>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>Error: {error}</Text>
          <Text style={styles.troubleshooting}>
            Troubleshooting steps:{'\n'}
            1. Make sure the backend server is running{'\n'}
            2. Verify the IP address is correct{'\n'}
            3. Check if you can ping the server{'\n'}
            4. Ensure no firewall is blocking the connection
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loading: {
    fontSize: 16,
    color: '#666',
  },
  success: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 20,
  },
  troubleshooting: {
    marginTop: 20,
    color: '#666',
    lineHeight: 24,
  }
}); 