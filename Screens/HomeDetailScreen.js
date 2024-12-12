import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Icon, Button } from '@rneui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { deleteWorkoutThunk } from "../features/workoutsSlice";
import moment from 'moment';
import imageNotAvailable from '../assets/FitPath.png';

function HomeDetailsScreen(props) {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const { item } = route.params;

  // Local state to hold updated item
  const [workout, setWorkout] = useState(item);

  // Retrieve the latest workout data from Redux by key
  const updatedWorkout = useSelector((state) =>
    state.workouts.list.find((c) => c.key === item.key)
  );

  useEffect(() => {
    // Update local state if the workout data has changed in Redux
    if (updatedWorkout) {
      setWorkout(updatedWorkout);
    }
  }, [updatedWorkout]);

  // Function to format the duration
  const formatDuration = (duration) => {
    if (!duration) {
      return "";
    } else if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours} hr${minutes > 0 ? ` ${minutes} min` : ''}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#7266E2" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
      </View>

      {/* Details Section */}
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        {/* Workout Image */}
        <Image
          source={workout.image ? { uri: workout.image } : imageNotAvailable}
          style={styles.workoutImage}
        />
        <Text style={styles.workoutTitle}>{workout.workoutType}</Text>

        {/* Workout Details */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Start time</Text>
          <Text style={styles.detailValue}>
            {workout.startTime ? moment(workout.startTime).format('MMM DD, HH:mm') : ""}
          </Text>
        </View>
        <View style={styles.line} />

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{formatDuration(workout.duration)}</Text>
        </View>
        <View style={styles.line} />

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Calories burned</Text>
          <Text style={styles.detailValue}>{workout.calories ? `${workout.calories} cal` : ""}</Text>
        </View>
        <View style={styles.line} />

        {/* Location */}
        <View style={styles.locationContainer}>
          <Icon name="location-on" type="material" color="black" />
          <Text style={styles.locationText}>{workout.location || "Location TBD"}</Text>
        </View>
      </ScrollView>

      {/* Edit & Delete Buttons */}
      <View style={styles.CRUDbuttonContainer}>
        <Button
          title="Edit"
          buttonStyle={styles.editButton}
          icon={{
            name: "edit",
            type: "material",
            color: "white",
          }}
          onPress={() => navigation.navigate('HomeEditScreen', { item: workout })}
        />
        <Button
          title="Delete"
          buttonStyle={styles.deleteButton}
          icon={{
            name: "delete",
            type: "material",
            color: "white",
          }}
          onPress={() => {
            dispatch(deleteWorkoutThunk(item.key));
            navigation.goBack();
          }}
        />
      </View>
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
    backgroundColor: 'white',
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
    borderColor: '#7266E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  workoutImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginTop: '5%',
    marginBottom: 20,
    borderRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 0,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  line: {
    height: 1,
    backgroundColor: '#F0E4FE', // Light gray line
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '5%',
    marginBottom: '15%',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  CRUDbuttonContainer: {
    backgroundColor: 'transparent',
  },
  editButton: {
    backgroundColor: '#7266E2',
    borderRadius: 10,
    paddingVertical: '3%',
    marginBottom: '3%',
    marginHorizontal: '3%',
  },
  deleteButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: '3%',
    marginBottom: '3%',
    marginHorizontal: '3%',
  },
});

export default HomeDetailsScreen;
