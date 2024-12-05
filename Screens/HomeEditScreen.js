import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input, Icon, Button, BottomSheet } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addWorkoutThunk, updateWorkoutThunk } from "../features/workoutsSlice";

function HomeEditScreen(props) {
  const dispatch = useDispatch();
  const { navigation, route } = props;
  const { item } = route.params;

  // State variables for workout details
  const [image, setImage] = useState(item?.image || '');
  const [workoutType, setWorkoutType] = useState(item?.workoutType || '');
  const [startTime, setStartTime] = useState(item?.startTime ? new Date(item.startTime) : new Date());
  const [duration, setDuration] = useState(item?.duration || '');
  const [calories, setCalories] = useState(item?.calories || '');
  const [location, setLocation] = useState(item?.location || '');

  const handleSave = () => {
    const workoutData = {
      image,
      workoutType,
      startTime: startTime.toISOString(), // Saving in ISO format
      duration,
      calories,
      location,
    };

    if (item.key === -1) {
      dispatch(addWorkoutThunk(workoutData));
    } else {
      dispatch(updateWorkoutThunk({ item, workoutData }));
    }
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setStartTime((prev) => new Date(selectedDate.setHours(prev.getHours(), prev.getMinutes())));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      setStartTime((prev) => new Date(prev.setHours(selectedTime.getHours(), selectedTime.getMinutes())));
    }
  };

  return (
    // Adjusts its height to avoid the keyboard when it appears
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#7266E2" size={24} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>{item.key === -1 ? 'Add Workout' : 'Edit Workout'}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Capture Section */}
          <View style={styles.captureContainer}>
            <Text style={styles.captureText}>Capture your workout moment</Text>
            <Icon
              name="camera-plus"
              type="material-community"
              color="black"
              onPress={() => {
                // Placeholder for image capture logic
              }}
            />
          </View>

          {/* Workout Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Workout type</Text>
            <Input
              containerStyle={styles.inputBox}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder=""
              value={workoutType}
              onChangeText={setWorkoutType}
            />
          </View>

          {/* Start Time - Always Visible Date and Time Pickers */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start date and time</Text>
            <View style={styles.pickerContainer}>
              {/* Date Picker */}
              <DateTimePicker
                value={startTime}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.picker}
              />
              {/* Time Picker */}
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                style={styles.picker}
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Duration</Text>
            <Input
              containerStyle={styles.inputBox}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder="min"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          {/* Calories Burned */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calories burned</Text>
            <Input
              containerStyle={styles.inputBox}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder="cal"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Location</Text>
            <Icon
              name="location-on"
              type="material"
              color="black"
              onPress={() => {
                // Placeholder for location picker logic
              }}
            />
          </View>
        </ScrollView>
        {/* Add Button */}
        <Button
            title="Add"
            buttonStyle={styles.addButton}
            icon={{
              name: "add-circle",
              type: "material",
              color: "white",
            }}
            onPress={handleSave}
          />
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '20%',
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  captureText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  picker: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    position: 'fixed',
    backgroundColor: '#7266E2',
    borderRadius: 10,
    paddingVertical: '3%',
    marginHorizontal: '3%',
    marginBottom: '3%',
  },
});

export default HomeEditScreen;
