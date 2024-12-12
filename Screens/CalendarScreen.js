import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Calendar component
import { useSelector } from 'react-redux';

function CalendarScreen({ navigation }) {
  const workouts = useSelector((state) => state.workouts.list); // Access workouts from Redux store

  // Generate a markedDates object based on workout logs
  const generateMarkedDates = () => {
    const markedDates = {};
    workouts.forEach((workout) => {
      const date = workout.startTime.split('T')[0]; // Extract date part
      markedDates[date] = {
        marked: true,
        dotColor: '#7266E2', // Add a dot for workout days
        customStyles: {
          container: {
            backgroundColor: '#7266E2', // Darker background for active days
          },
          text: {
            color: 'white', // White text for better contrast
          },
        },
      };
    });
    return markedDates;
  };

  const [markedDates, setMarkedDates] = useState(generateMarkedDates());

  const handleDayPress = (day) => {
    const selectedDate = day.dateString; // Format: YYYY-MM-DD
    navigation.navigate('HomeScreen', { selectedDate });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      {/* Calendar */}
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#7266E2',
          arrowColor: '#7266E2',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 16,
    color: '#7266E2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendar: {
    margin: 20,
  },
});

export default CalendarScreen;
