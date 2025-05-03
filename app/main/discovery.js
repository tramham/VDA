import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  PanResponder, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { Text, Button, IconButton, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.65;
const SWIPE_THRESHOLD = width * 0.25;

// Mock profiles
const profiles = [
  {
    id: 'profile1',
    name: 'Sophie Wilson',
    age: 26,
    location: {
      city: 'San Francisco',
      distance: 5
    },
    photos: [
      { url: 'https://randomuser.me/api/portraits/women/44.jpg' }
    ],
    bio: "Tech enthusiast and coffee lover. Love exploring new hiking trails on weekends.",
    interests: ['Hiking', 'Photography', 'Coffee', 'Travel'],
    verified: true
  },
  {
    id: 'profile2',
    name: 'Emily Johnson',
    age: 29,
    location: {
      city: 'Oakland',
      distance: 12
    },
    photos: [
      { url: 'https://randomuser.me/api/portraits/women/22.jpg' }
    ],
    bio: "Art curator by day, musician by night. Looking for someone to explore museums with.",
    interests: ['Art', 'Music', 'Museums', 'Wine'],
    verified: true
  },
  {
    id: 'profile3',
    name: 'Olivia Parker',
    age: 27,
    location: {
      city: 'Palo Alto',
      distance: 18
    },
    photos: [
      { url: 'https://randomuser.me/api/portraits/women/65.jpg' }
    ],
    bio: "Medical resident who loves cooking and outdoor activities. Dog lover!",
    interests: ['Cooking', 'Hiking', 'Dogs', 'Fitness'],
    verified: false
  },
];

export default function DiscoveryScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // Set up pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  // Animate card when swiping right (like)
  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % profiles.length);
      position.setValue({ x: 0, y: 0 });
    });
  };

  // Animate card when swiping left (pass)
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % profiles.length);
      position.setValue({ x: 0, y: 0 });
    });
  };

  // Reset card position when not swiped far enough
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  // Handle manual swipe buttons
  const handleLike = () => {
    swipeRight();
  };

  const handlePass = () => {
    swipeLeft();
  };

  const handleSchedule = () => {
    router.push('/main/upcoming');
  };

  const profile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate }
            ]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: profile.photos[0].url }} style={styles.cardImage} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.nameAgeContainer}>
              <Text style={styles.nameText}>
                {profile.name}, {profile.age}
              </Text>
              {profile.verified && (
                <MaterialIcons name="verified" size={24} color="#2196F3" />
              )}
            </View>
            
            <Text style={styles.locationText}>
              <MaterialIcons name="location-on" size={16} color="#fff" /> 
              {profile.location.city}, {profile.location.distance} miles away
            </Text>
            
            <View style={styles.bioContainer}>
              <Text style={styles.bioText} numberOfLines={3}>
                {profile.bio}
              </Text>
            </View>
            
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, idx) => (
                <Chip 
                  key={idx} 
                  style={styles.interestChip}
                  textStyle={styles.interestText}
                >
                  {interest}
                </Chip>
              ))}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      <View style={styles.actionsContainer}>
        <IconButton
          icon="close"
          mode="contained"
          containerColor="#fafafa"
          iconColor="#F44336"
          size={30}
          onPress={handlePass}
          style={styles.actionButton}
        />
        
        <Button
          mode="contained"
          onPress={handleSchedule}
          style={styles.scheduleButton}
        >
          Schedule Call
        </Button>
        
        <IconButton
          icon="heart"
          mode="contained"
          containerColor="#fafafa"
          iconColor="#4CAF50"
          size={30}
          onPress={handleLike}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  cardContent: {
    width: '100%',
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  bioContainer: {
    marginTop: 10,
  },
  bioText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 20,
  },
  actionButton: {
    elevation: 2,
  },
  scheduleButton: {
    borderRadius: 30,
  },
});