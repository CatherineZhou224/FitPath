import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Button } from '@rneui/themed';
import moment from 'moment';

function HomeScreen({ navigation, route }) {
  const workouts = useSelector((state) => state.workouts.list);
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);
  const [headerText, setHeaderText] = useState({ main: 'Today', date: moment().format('dddd, MMM DD, YYYY') });

  // Get selectedDate from route params
  const selectedDate = route.params?.selectedDate || null;

  // Filter workouts and update the header text based on selectedDate
  useEffect(() => {
    if (selectedDate) {
      const filtered = workouts.filter((workout) => {
        const workoutDate = moment(workout.startTime).format('YYYY-MM-DD');
        return workoutDate === selectedDate;
      });
      setFilteredWorkouts(filtered);
      setHeaderText({
        main: 'Date', // Display "Date Filter" when a specific date is selected
        date: moment(selectedDate).format('dddd, MMM DD, YYYY'), // Show the selected date
      });
    } else {
      setFilteredWorkouts(workouts); // Show all logs
      setHeaderText({
        main: 'Today', // Reset to "Today" when no date filter is applied
        date: moment().format('dddd, MMM DD, YYYY'), // Show today's date
      });
    }
  }, [selectedDate, workouts]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerDateText1}>{headerText.main}</Text>
          <Text style={styles.headerDateText2}>{headerText.date}</Text>
        </View>
        <TouchableOpacity
            onPress={() => navigation.navigate('CalendarScreen')}
        >
        <Icon
          name="calendar"
          type="ionicon"
          color="#7266E2"
          size={24}
          containerStyle={styles.calendarIcon}
        />
        </TouchableOpacity>
      </View>

      {/* Workout List */}
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => navigation.navigate('HomeDetailScreen', { item })}
          >
            <ImageBackground
              source={item.image ? { uri: item.image } : null}
              style={[
                styles.cardBackground,
                item.image ? styles.imageCard : index % 2 === 0 ? styles.evenCard : styles.oddCard,
              ]}
              imageStyle={styles.cardImage}
            >
              {/* Conditional Dark Overlay */}
              {item.image && <View style={styles.overlay} />}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.workoutType}</Text>
                  <Text style={styles.cardDate}>{moment(item.startTime).format('MMM DD, HH:mm')}</Text>
                </View>
                <Text style={styles.timeSpentLabel}>Time spent</Text>
                <View style={styles.timeSpentContainer}>
                  <Text style={styles.timeSpent}>{Math.floor(item.duration / 60)}</Text>
                  <Text style={styles.timeUnit}>hr</Text>
                  <Text style={styles.timeSpent}>{item.duration % 60}</Text>
                  <Text style={styles.timeUnit}>min</Text>
                </View>
                <View style={styles.locationContainer}>
                  <Icon
                    name="location"
                    type="ionicon"
                    color="#E6E6E6"
                    size={20}
                  />
                  <Text style={styles.locationText}>{item.location || 'Location TBD'}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('HomeEditScreen', {
            item: { key: -1, workoutType: '', startTime: '', duration: '', calories: '', location: '' },
          })
        }
      >
        <Icon name="add" type="ionicon" color="white" size={40} />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: '5%',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerDateText1: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  headerDateText2: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    padding: 5,
  },
  listContainer: {
    marginTop: '5%',
    paddingHorizontal: 15,
    paddingBottom: 100, // Extra space for floating add button
  },
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardBackground: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  cardImage: {
    opacity: 0.6, // Adjust the opacity of the image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.4, // Dark overlay with transparency
  },
  cardContent: {
    flex: 1,
  },
  oddCard: {
    backgroundColor: '#7266E2',
  },
  evenCard: {
    backgroundColor: '#835FBE',
  },
  imageCard: {
    backgroundColor: 'black',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  cardDate: {
    fontSize: 14,
    color: '#E6E6E6',
  },
  timeSpentLabel: {
    fontSize: 14,
    color: '#E6E6E6',
    marginBottom: 5,
  },
  timeSpentContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  timeSpent: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  timeUnit: {
    fontSize: 14,
    marginLeft: 5,
    marginRight: 15,
    color: 'white',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#E6E6E6',
    marginLeft: '2%',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#7266E2',
    width: 60,
    height: 60,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default HomeScreen;
