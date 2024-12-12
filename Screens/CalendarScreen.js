import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import { Icon, Button } from '@rneui/themed';
import moment from 'moment';

function CalendarScreen({ navigation }) {
  const workouts = useSelector((state) => state.workouts.list); // Access workouts from Redux store

  // Generate a markedDates object based on workout logs
  const generateMarkedDates = () => {
    const markedDates = {};

    // Populate every date with a gray dot
    const startDate = moment('2020-01-01'); // Earliest possible date for coverage
    const endDate = moment('2030-12-31'); // Latest possible date for coverage

    for (let date = startDate; date.isBefore(endDate); date.add(1, 'day')) {
      const formattedDate = date.format('YYYY-MM-DD');
      markedDates[formattedDate] = {
        dots: [
          {
            color: '#EBEBEB', // Gray dot for all dates
          },
        ],
      };
    }

    // Add purple dots for dates with logs
    workouts.forEach((workout) => {
      const localDate = moment(workout.startTime).format('YYYY-MM-DD');
      markedDates[localDate] = {
        dots: [
          {
            color: '#7266E2', // Purple dot for dates with logs
          },
        ],
      };
    });

    return markedDates;
  };

  const [markedDates, setMarkedDates] = useState(generateMarkedDates());

  const handleDayPress = (day) => {
    const selectedDate = day.dateString; // Format: YYYY-MM-DD
    navigation.navigate('HomeScreen', { selectedDate });
  };

  const handleResetFilter = () => {
    navigation.navigate('HomeScreen', { selectedDate: null }); // Reset the filter
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#7266E2" size={24} />
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
          textDayFontSize: 18,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 16,
          dotStyle: { width: 15, height: 15, borderRadius: 20 }, // Adjust the size of the dots
        }}
        markingType="multi-dot"
      />

      {/* Reset Button */}
      <Button
        title="Show All Logs"
        titleStyle={{ fontSize: 16 }}
        buttonStyle={styles.resetButton}
        icon={{
          name: "refresh",
          type: "material",
          color: "white",
        }}
        onPress={handleResetFilter}
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
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#7266E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '10%',
    color: 'white',
  },
  calendar: {
    marginHorizontal: 10,
    marginVertical: '15%',
  },
  resetButton: {
    backgroundColor: '#7266E2',
    borderRadius: 10,
    margin: 20,
    paddingVertical: 15,
  },
});

export default CalendarScreen;
