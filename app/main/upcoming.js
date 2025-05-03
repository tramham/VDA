import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Text, Button, Divider, Surface } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock data for upcoming calls
const upcomingCallsData = [
  {
    id: 'call1',
    matchName: 'Sophie Wilson',
    date: 'Today, 7:00 PM',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    isSoon: true
  },
  {
    id: 'call2',
    matchName: 'Emily Johnson',
    date: 'Tomorrow, 8:30 PM',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    isSoon: false
  }
];

// Mock data for past calls
const pastCallsData = [
  {
    id: 'call3',
    matchName: 'Olivia Parker',
    date: 'Yesterday, 6:00 PM',
    duration: '12 minutes',
    rating: 4,
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
  }
];

export default function UpcomingScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingCalls, setUpcomingCalls] = useState(upcomingCallsData);
  const [pastCalls, setPastCalls] = useState(pastCallsData);

  const handleJoinCall = () => {
    router.push('/video-call');
  };

  const handleReschedule = (callId) => {
    // In a real app, would open a rescheduling UI
    console.log('Reschedule call:', callId);
  };

  const handleCancel = (callId) => {
    // In a real app, would confirm and cancel the call
    setUpcomingCalls(upcomingCalls.filter(call => call.id !== callId));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            UPCOMING
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'past' && styles.activeTabText
            ]}
          >
            PAST
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'upcoming' ? (
          upcomingCalls.length > 0 ? (
            upcomingCalls.map((call) => (
              <Surface key={call.id} style={[styles.callCard, call.isSoon && styles.soonCall]}>
                <View style={styles.callHeader}>
                  <View style={styles.profileContainer}>
                    <View style={styles.profilePhoto}>
                      <Text style={styles.photoInitial}>{call.matchName[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.matchName}>{call.matchName}</Text>
                      <Text style={styles.callTime}>{call.date}</Text>
                    </View>
                  </View>
                  {call.isSoon && (
                    <View style={styles.soonBadge}>
                      <Text style={styles.soonText}>SOON</Text>
                    </View>
                  )}
                </View>
                <Divider />
                <View style={styles.callActions}>
                  <Button 
                    mode="text" 
                    onPress={() => handleReschedule(call.id)}
                    textColor="#777"
                  >
                    Reschedule
                  </Button>
                  <Button 
                    mode="text" 
                    onPress={() => handleCancel(call.id)}
                    textColor="#F44336"
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained"
                    onPress={handleJoinCall}
                    disabled={!call.isSoon}
                  >
                    Join
                  </Button>
                </View>
              </Surface>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={80} color="#ccc" />
              <Text style={styles.emptyStateText}>No upcoming calls</Text>
              <Text style={styles.emptyStateSubtext}>
                When you match with someone and schedule a call, it will appear here
              </Text>
            </View>
          )
        ) : (
          pastCalls.length > 0 ? (
            pastCalls.map((call) => (
              <Surface key={call.id} style={styles.callCard}>
                <View style={styles.callHeader}>
                  <View style={styles.profileContainer}>
                    <View style={styles.profilePhoto}>
                      <Text style={styles.photoInitial}>{call.matchName[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.matchName}>{call.matchName}</Text>
                      <Text style={styles.callTime}>{call.date}</Text>
                    </View>
                  </View>
                </View>
                <Divider />
                <View style={styles.pastCallDetails}>
                  <Text style={styles.durationText}>Duration: {call.duration}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>Rating:</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialIcons
                          key={star}
                          name={star <= call.rating ? "star" : "star-border"}
                          size={18}
                          color={star <= call.rating ? "#FFC107" : "#BDBDBD"}
                          style={styles.star}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </Surface>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="history" size={80} color="#ccc" />
              <Text style={styles.emptyStateText}>No past calls</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4B91',
  },
  tabText: {
    fontWeight: '500',
    color: '#777',
  },
  activeTabText: {
    color: '#FF4B91',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 15,
  },
  callCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 2,
  },
  soonCall: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4B91',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  photoInitial: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  callTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  soonBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  soonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  pastCallDetails: {
    padding: 15,
  },
  durationText: {
    fontSize: 14,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    maxWidth: '80%',
  },
});