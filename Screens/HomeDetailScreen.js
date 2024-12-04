import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Icon } from '@rneui/themed';
import { useSelector } from 'react-redux';

function HomeDetailsScreen(props) {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.backButton} onPress={() => navigation.goBack()}>{"< Back"}</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Workout Details</Text>
        </View>
        <Text
          style={styles.editButton}
          onPress={() => navigation.navigate('HomeEditScreen', { item: workout })}
        >
          Edit
        </Text>
      </View>

      {/* Details Section */}
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        {/* Workout Type */}
        <View style={styles.detailRow}>
          <View style={styles.detailTitle}>
            <Icon name="fitness-center" type="material" color="black" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Workout Type</Text>
          </View>
          <Text style={styles.detailValue}>{workout.workoutType || ""}</Text>
        </View>

        {/* Start Time */}
        <View style={styles.detailRow}>
          <View style={styles.detailTitle}>
            <Icon name="schedule" type="material" color="black" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Start Time</Text>
          </View>
          <Text style={styles.detailValue}>{workout.startTime || ""}</Text>
        </View>

        {/* Duration */}
        <View style={styles.detailRow}>
          <View style={styles.detailTitle}>
            <Icon name="timer" type="material" color="black" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Duration</Text>
          </View>
          <Text style={styles.detailValue}>{workout.duration ? `${workout.duration} min` : ""}</Text>
        </View>

        {/* Calories Burned */}
        <View style={styles.detailRow}>
          <View style={styles.detailTitle}>
            <Icon name="local-fire-department" type="material" color="black" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Calories Burned</Text>
          </View>
          <Text style={styles.detailValue}>{workout.calories ? `${workout.calories} cal` : ""}</Text>
        </View>

        {/* Location */}
        <View style={styles.detailRow}>
          <View style={styles.detailTitle}>
            <Icon name="location-on" type="material" color="black" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Location</Text>
          </View>
          <Text style={styles.detailValue}>{workout.location || ""}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#AFD8E9'
  },
  backButton: {
    color: 'blue',
    fontSize: 16
  },
  headerInfo: {
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  editButton: {
    color: 'blue',
    fontSize: 16
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  detailTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
  },
  detailIcon: {
    marginRight: 10
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    width: 120
  },
  detailValue: {
    flex: 0.6,
    fontSize: 14,
    color: '#555',
    marginLeft: 10
  }
});

export default HomeDetailsScreen;
