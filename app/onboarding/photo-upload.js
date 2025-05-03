import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Text, Button, useTheme, ProgressBar, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MAX_PHOTOS = 6;

export default function PhotoUpload() {
  const theme = useTheme();
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Request camera roll permissions
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Pick image from library
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        if (photos.length < MAX_PHOTOS) {
          setPhotos([...photos, newPhoto]);
        } else {
          Alert.alert('Limit Reached', `You can only upload up to ${MAX_PHOTOS} photos.`);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your camera to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaType: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto = result.assets[0];
        if (photos.length < MAX_PHOTOS) {
          setPhotos([...photos, newPhoto]);
        } else {
          Alert.alert('Limit Reached', `You can only upload up to ${MAX_PHOTOS} photos.`);
        }
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Remove a photo
  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  // Upload photos to server
  const handleUpload = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to continue.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload
      let progress = 0;
      const increment = 1 / photos.length;

      for (let i = 0; i < photos.length; i++) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        progress += increment;
        setUploadProgress(progress);
      }

      // Navigate to next screen
      router.push('/onboarding/profile-details');
    } catch (error) {
      console.log('Error uploading photos:', error);
      Alert.alert('Upload Error', 'Failed to upload photos. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Skip photo upload
  const handleSkip = () => {
    Alert.alert(
      'Skip Photo Upload',
      'Photos help others get to know you better. Are you sure you want to skip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.push('/onboarding/profile-details') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Add Your Best Photos</Text>
        <Text style={styles.subtitle}>
          Upload up to {MAX_PHOTOS} photos to show others who you are
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.photoGrid}>
        {/* Photo grid */}
        {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
          const photo = photos[index];
          
          if (photo) {
            return (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
                
                {index === 0 && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>Primary</Text>
                  </View>
                )}
              </View>
            );
          } else {
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.emptyPhotoContainer}
                onPress={pickImage}
              >
                <MaterialIcons 
                  name="add-photo-alternate" 
                  size={40} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>

      <View style={styles.actionButtons}>
        <Button 
          mode="outlined" 
          onPress={takePhoto}
          style={[styles.actionBtn, { marginRight: 10 }]}
          icon="camera"
        >
          Camera
        </Button>
        <Button 
          mode="outlined"
          onPress={pickImage}
          style={styles.actionBtn}
          icon="image"
        >
          Gallery
        </Button>
      </View>

      {isUploading && (
        <View style={styles.progressContainer}>
          <Text>Uploading photos...</Text>
          <ProgressBar 
            progress={uploadProgress} 
            color={theme.colors.primary} 
            style={styles.progressBar}
          />
        </View>
      )}

      <View style={styles.bottomButtons}>
        <Button 
          mode="text" 
          onPress={handleSkip}
          style={{ marginRight: 10 }}
        >
          Skip
        </Button>
        <Button 
          mode="contained" 
          onPress={handleUpload}
          disabled={isUploading || photos.length === 0}
          loading={isUploading}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FAFAFA',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  photoContainer: {
    width: '48%',
    aspectRatio: 3/4,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  emptyPhotoContainer: {
    width: '48%',
    aspectRatio: 3/4,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,75,145,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  primaryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addPhotoText: {
    marginTop: 10,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
});