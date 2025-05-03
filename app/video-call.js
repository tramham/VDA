import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Text, IconButton, Button, Surface } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  
  // Set up timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setShowExtendModal(true);
          return 0;
        }
        
        // Show extend dialog when 1 minute remaining
        if (prevTimer === 60) {
          setShowExtendModal(true);
        }
        
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle ending the call
  const handleEndCall = () => {
    router.push('/feedback');
  };
  
  // Extend call handler
  const handleExtendCall = (minutes) => {
    setShowExtendModal(false);
    setTimer(prev => prev + minutes * 60);
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Remote user's video (placeholder) */}
      <View style={styles.remoteVideo}>
        <Text style={styles.remoteName}>Sophie Wilson</Text>
      </View>
      
      {/* Local user's video */}
      <View style={styles.localVideo}>
        <Text style={styles.localText}>You</Text>
      </View>
      
      {/* Call timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>
      
      {/* Call controls */}
      <View style={styles.controlsContainer}>
        <IconButton
          icon={isMuted ? "microphone-off" : "microphone"}
          mode="contained"
          containerColor={isMuted ? "#F44336" : "rgba(255, 255, 255, 0.2)"}
          iconColor="#fff"
          size={28}
          onPress={() => setIsMuted(!isMuted)}
        />
        
        <IconButton
          icon="phone-hangup"
          mode="contained"
          containerColor="#F44336"
          iconColor="#fff"
          size={32}
          onPress={handleEndCall}
        />
        
        <IconButton
          icon={isVideoEnabled ? "video" : "video-off"}
          mode="contained"
          containerColor={isVideoEnabled ? "rgba(255, 255, 255, 0.2)" : "#F44336"}
          iconColor="#fff"
          size={28}
          onPress={() => setIsVideoEnabled(!isVideoEnabled)}
        />
      </View>
      
      {/* Extend call modal */}
      <Modal
        visible={showExtendModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {timer > 0 ? 'Extend Call?' : 'Call Time Ended'}
            </Text>
            <Text style={styles.modalText}>
              {timer > 0 
                ? 'Your call time is almost up. Would you like to extend the call?'
                : 'Your scheduled call time has ended. Would you like to continue?'
              }
            </Text>
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={handleEndCall}
                style={[styles.modalButton, { marginRight: 10 }]}
              >
                End Call
              </Button>
              
              <Button 
                mode="contained" 
                onPress={() => handleExtendCall(5)}
                style={styles.modalButton}
              >
                Add 5 Minutes
              </Button>
            </View>
            
            <Button 
              mode="text" 
              onPress={() => handleExtendCall(30)}
              style={{ marginTop: 10 }}
            >
              Continue Indefinitely
            </Button>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  localVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: width * 0.3,
    height: width * 0.4,
    borderRadius: 10,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localText: {
    color: '#fff',
    fontSize: 16,
  },
  timerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
  },
});