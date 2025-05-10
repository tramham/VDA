import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  PanResponder,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
 
/**
 * AvailabilityPicker Component
 * 
 * This component allows users to select their available time slots for video dates.
 * Users can:
 * 1. Add multiple time slots for each day of the week
 * 2. Select start and end times for each slot
 * 3. Remove time slots
 * 4. See a summary of their selected availability
 */

const CELL_WIDTH = 60;
const CELL_HEIGHT = 60;

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Time slots from 6 AM to 12 AM in 30-minute increments
const TIME_SLOTS = Array.from({ length: 36 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export default function AvailabilityPicker({ value, onChange }) {
  const theme = useTheme();
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const newSelectedCells = new Set();
    value?.forEach(slot => {
      const startIndex = TIME_SLOTS.indexOf(slot.start_time);
      const endIndex = TIME_SLOTS.indexOf(slot.end_time);
      const dayIndex = DAYS_OF_WEEK.indexOf(slot.day);
      for (let i = startIndex; i < endIndex; i++) {
        newSelectedCells.add(`${dayIndex}-${i}`);
      }
    });
    setSelectedCells(newSelectedCells);
  }, [value]);

  const convertToAvailabilitySlots = useCallback(() => {
    const slots = [];
    DAYS_OF_WEEK.forEach((day, dayIndex) => {
      let startTime = null;

      TIME_SLOTS.forEach((_, timeIndex) => {
        const cellId = `${dayIndex}-${timeIndex}`;
        const isSelected = selectedCells.has(cellId);

        if (isSelected && !startTime) {
          startTime = TIME_SLOTS[timeIndex];
        } else if (!isSelected && startTime) {
          slots.push({
            day,
            start_time: startTime,
            end_time: TIME_SLOTS[timeIndex]
          });
          startTime = null;
        }
      });

      if (startTime) {
        slots.push({
          day,
          start_time: startTime,
          end_time: '24:00'
        });
      }
    });

    onChange(slots);
  }, [selectedCells, onChange]);

  const handleCellSelect = (dayIndex, timeIndex) => {
    const cellId = `${dayIndex}-${timeIndex}`;
    const updated = new Set(selectedCells);
    updated.add(cellId);
    setSelectedCells(updated);
    convertToAvailabilitySlots();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        setIsSelecting(true);
        updateCellFromTouch(evt);
      },
      onPanResponderMove: evt => {
        if (isSelecting) {
          updateCellFromTouch(evt);
        }
      },
      onPanResponderRelease: () => {
        setIsSelecting(false);
        setStartCell(null);
      },
    })
  ).current;

  const updateCellFromTouch = (evt) => {
    if (!containerRef.current) return;

    const { locationX, locationY } = evt.nativeEvent;
    const timeIndex = Math.floor(locationX / CELL_WIDTH);
    const dayIndex = Math.floor(locationY / CELL_HEIGHT);

    if (
      timeIndex >= 0 && timeIndex < TIME_SLOTS.length &&
      dayIndex >= 0 && dayIndex < DAYS_OF_WEEK.length
    ) {
      const cellId = `${dayIndex}-${timeIndex}`;
      if (!selectedCells.has(cellId)) {
        handleCellSelect(dayIndex, timeIndex);
      }
    }
  };

  return (
    <ScrollView horizontal>
      <View ref={containerRef} style={styles.container} {...panResponder.panHandlers}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.cornerCell} />
          {TIME_SLOTS.map((time) => (
            <View key={time} style={styles.timeCell}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
        </View>

        {/* Grid rows */}
        {DAYS_OF_WEEK.map((day, dayIndex) => (
          <View key={day} style={styles.row}>
            <View style={styles.dayCell}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
            {TIME_SLOTS.map((_, timeIndex) => {
              const cellId = `${dayIndex}-${timeIndex}`;
              const isSelected = selectedCells.has(cellId);
              return (
                <View
                  key={cellId}
                  style={[
                    styles.cell,
                    isSelected && styles.selectedCell
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cornerCell: {
    width: 100,
    height: 40,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCell: {
    width: CELL_WIDTH,
    height: 40,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCell: {
    width: 100,
    height: CELL_HEIGHT,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  selectedCell: {
    backgroundColor: '#4CAF50',
  },
  timeText: {
    fontSize: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 