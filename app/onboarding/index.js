import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, FlatList, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const slides = [
  {
    id: '1',
    image: require('../../assets/images/onboarding-1.jpg'),
    title: 'Welcome to VideoDate',
    subtitle: 'Connect through meaningful video conversations'
  },
  {
    id: '2',
    image: require('../../assets/images/onboarding-2.jpg'),
    title: 'Schedule Your Availability',
    subtitle: 'Let us know when you are free to chat'
  },
  {
    id: '3',
    image: require('../../assets/images/onboarding-3.jpg'),
    title: 'Find Your Matches',
    subtitle: 'Discover people who share your interests'
  },
  {
    id: '4',
    image: require('../../assets/images/onboarding-4.jpg'),
    title: 'Skip the Texting',
    subtitle: 'Jump straight to video calls and make real connections'
  }
];

export default function Welcome() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Handle skip action
  const handleSkip = () => {
    router.replace('/main');
  };

  // Render slide item
  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  // Render pagination dots
  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View 
              key={index} 
              style={[
                styles.dot, 
                { 
                  width: dotWidth, 
                  opacity, 
                  backgroundColor: theme.colors.primary 
                }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#FF4B91', '#6C63FF']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.headerContainer}>
        <Button 
          mode="text" 
          onPress={handleSkip} 
          textColor="#fff"
          style={styles.skipButton}
        >
          Skip
        </Button>
      </View>
      
      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={32}
        style={styles.flatList}
      />
      
      <Paginator />
      
      <View style={styles.bottomContainer}>
        <Button 
          mode="contained" 
          onPress={() => {
            if (currentIndex === slides.length - 1) {
              router.push('/onboarding/photo-upload');
            } else {
              slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
            }
          }}
          style={styles.button}
          buttonColor="#fff"
          textColor={theme.colors.primary}
        >
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'flex-end',
  },
  skipButton: {
    marginRight: 10,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imagePlaceholder: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  imagePlaceholderText: {
    fontSize: 60,
    color: 'white',
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    opacity: 0.8,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  bottomContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 8,
  },
});
