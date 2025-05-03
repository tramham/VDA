import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { 
  Text, 
  useTheme, 
  Button, 
  Surface, 
  Checkbox, 
  Divider,
  ActivityIndicator 
} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { format, addDays, startOfDay } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Time slots for selection
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM' },
  { id: 'night', label: 'Night', time: '9:00 PM - 12:00 AM' }
];

export default function ScheduleSetup() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate date range for the next 14 days
  const today = startOfDay(new Date());
  const twoWeeksLater = addDays(today, 14);
  
  // Min and max dates for the calendar
  const minDate = format(today, 'yyyy-MM-dd');
  const maxDate = format(twoWeeksLater, 'yyyy-MM-dd');
// Initialize the markedDates when component loads
React.useEffect(() => {
    const initialMarkedDates = {};
    initialMarkedDates[selectedDate] = { selected: true, selectedColor: theme.colors.primary };
    setMarkedDates(initialMarkedDates);
  }, []);

  // Handle date selection on calendar
  const handleDateSelect = (day) => {
    const dateString = day.dateString;
    
    // Update markedDates
    const updatedMarkedDates = {};
    updatedMarkedDates[dateString] = { selected: true, selectedColor: theme.colors.primary };
    
    // If there are availability slots for this date, mark it with a dot
    if (selectedTimeSlots[dateString] && selectedTimeSlots[dateString].length > 0) {
      updatedMarkedDates[dateString].dots = [{ color: theme.colors.accent }];
    }
    
    setMarkedDates(updatedMarkedDates);
    setSelectedDate(dateString);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlotId) => {
    setSelectedTimeSlots(prev => {
      const currentSlots = prev[selectedDate] || [];
      const isSelected = currentSlots.includes(timeSlotId);
      
      // Create updated slots
      let updatedSlots;
      if (isSelected) {
        updatedSlots = currentSlots.filter(id => id !== timeSlotId);
      } else {
        updatedSlots = [...currentSlots, timeSlotId];
      }
      
      // Update marked dates if needed
      if (updatedSlots.length > 0 && !isSelected) {
        setMarkedDates(prev => ({
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            dots: [{ color: theme.colors.accent }]
          }
        }));
      } else if (updatedSlots.length === 0) {
        setMarkedDates(prev => ({
          ...prev,
          [selectedDate]: {
            ...prev[selectedDate],
            dots: undefined
          }
        }));
      }
      
      return {
        ...prev,
        [selectedDate]: updatedSlots
      };
    });
  };

  // Determine if the time slot is selected
  const isTimeSlotSelected = (timeSlotId) => {
    return selectedTimeSlots[selectedDate]?.includes(timeSlotId) || false;
  };

  // Submit availability schedule
  const handleSubmit = async () => {
    // Check if at least one time slot is selected
    const hasTimeSlots = Object.values(selectedTimeSlots).some(slots => slots.length > 0);
    
    if (!hasTimeSlots) {
      Alert.alert(
        'No Available Times',
        'Please select at least one time slot to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to main app
      router.replace('/main');
    } catch (error) {
      console.log('Error saving availability:', error);
      Alert.alert(
        'Error',
        'Failed to save your availability. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Availability</Text>
        <Text style={styles.subtitle}>
          Let others know when you're free for video dates
        </Text>
      </View>
      
      <ScrollView>
        <Surface style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            markingType="dot"
            theme={{
              selectedDayBackgroundColor: theme.colors.primary,
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
            }}
          />
        </Surface>
        
        <Surface style={styles.timeSlotsContainer}>
          <Text style={styles.dateHeader}>
            {format(new Date(selectedDate), 'EEEE, MMMM do, yyyy')}
          </Text>
          
          <Text style={styles.sectionTitle}>Select Available Time Slots</Text>
          
          <Divider style={styles.divider} />
          
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={styles.timeSlotRow}
              onPress={() => handleTimeSlotSelect(slot.id)}
            >
              <View style={styles.timeSlotInfo}>
                <Text style={styles.timeSlotLabel}>{slot.label}</Text>
                <Text style={styles.timeSlotTime}>{slot.time}</Text>
              </View>
              
              <Checkbox
                status={isTimeSlotSelected(slot.id) ? 'checked' : 'unchecked'}
                onPress={() => handleTimeSlotSelect(slot.id)}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ))}
        </Surface>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can always update your availability later in your profile settings.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.buttonsContainer}>
        <Button 
          mode="outlined" 
          onPress={() => router.back()}
          style={[styles.button, { marginRight: 10 }]}
        >
          Back
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          Finish
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
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
  },
  timeSlotsContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  divider: {
    marginVertical: 10,
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeSlotInfo: {
    flex: 1,
  },
  timeSlotLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeSlotTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  footer: {
    marginBottom: 80,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    flex: 1,
  },
});