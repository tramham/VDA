import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import apiClient from '../api/client';

export default function TestAPI() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await apiClient.get('/');
        setMessage(response.data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      {message ? (
        <Text style={styles.success}>Success: {message}</Text>
      ) : error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
        <Text>Testing connection...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
}); 