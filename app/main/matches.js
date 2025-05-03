import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock matches data
const matches = [
  {
    id: 'match1',
    name: 'Sophie Wilson',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Looking forward to our call tomorrow!',
    time: '2h ago',
    hasScheduledCall: true
  },
  {
    id: 'match2',
    name: 'Emily Johnson',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: 'Would you like to schedule a call?',
    time: '5h ago',
    hasScheduledCall: false
  }
];

export default function MatchesScreen() {
  const renderMatchItem = ({ item }) => (
    <Surface style={styles.matchCard}>
      <TouchableOpacity style={styles.matchContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
        </View>
        <View style={styles.messageContent}>
          <View style={styles.nameTimeRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text 
            style={styles.lastMessage} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <View style={styles.matchActions}>
        {item.hasScheduledCall ? (
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledText}>Call Scheduled</Text>
          </View>
        ) : (
          <Button 
            mode="contained"
            style={styles.scheduleButton}
            onPress={() => router.push('/main/upcoming')}
          >
            Schedule Call
          </Button>
        )}
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches</Text>
        <Text style={styles.subtitle}>Connect through video calls</Text>
      </View>
      
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.matchesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="people" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptySubtitle}>
              Start swiping to find potential matches
            </Text>
            <Button 
              mode="contained"
              style={styles.discoverButton}
              onPress={() => router.push('/main/discovery')}
            >
              Discover People
            </Button>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  matchesList: {
    padding: 15,
  },
  matchCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
  },
  matchContent: {
    flexDirection: 'row',
    padding: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4B91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#777',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  matchActions: {
    padding: 15,
    alignItems: 'flex-end',
  },
  scheduleButton: {
    borderRadius: 20,
  },
  scheduledBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scheduledText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  discoverButton: {
    borderRadius: 20,
  },
});