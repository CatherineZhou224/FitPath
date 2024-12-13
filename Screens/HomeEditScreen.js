import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import * as Location from 'expo-location';
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
      startTime: startTime.toISOString(),
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

  const handleFetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permissions are required to fetch your location.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = coords;

      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const formattedAddress = `${address.name || ''}, ${address.city || ''}, ${address.region || ''}`;
      setLocation(formattedAddress || 'Unknown Location');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (route.params?.updatedImage) {
      setImage(route.params.updatedImage);
    }
  }, [route.params?.updatedImage]);

  return (
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
            <View style={styles.captureIcons}>
              <Icon
                name="camera-plus"
                type="material-community"
                color="black"
                onPress={() => {
                  navigation.navigate('CameraScreen', {
                    onSave: (capturedImage) => setImage(capturedImage),
                  });
                }}
              />
              {image ? (
                <Icon
                  name="close-circle"
                  type="material-community"
                  color="#7266E2"
                  size={24}
                  onPress={() => setImage('')} // Clear image
                  containerStyle={styles.cancelIcon}
                />
              ) : null}
            </View>
          </View>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
            </View>
          ) : null}

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

          {/* Start Time */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start date and time</Text>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={startTime}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.picker}
              />
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
            <View style={styles.withUnitContainer}>
              <Input
                containerStyle={styles.inputBoxWithUnit}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                placeholder="min"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>min</Text>
            </View>
          </View>

          {/* Calories */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calories burned</Text>
            <View style={styles.withUnitContainer}>
              <Input
                containerStyle={styles.inputBoxWithUnit}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                placeholder="cal"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>cal</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>{location || 'Tap the icon to get your location'}</Text>
            <View style={styles.captureIcons}>
              <Icon
                name="location-on"
                type="material"
                color="black"
                onPress={handleFetchLocation}
              />
              {location ? (
                <Icon
                  name="close-circle"
                  type="material-community"
                  color="#7266E2"
                  size={24}
                  onPress={() => setLocation('')} // Clear location
                  containerStyle={styles.cancelIcon}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
        <Button
          title="Save"
          buttonStyle={styles.saveButton}
          icon={{
            name: "save",
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '20%',
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
    marginTop: '5%',
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  captureText: {
    fontSize: 16,
    color: 'black',
  },
  captureIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelIcon: {
    marginLeft: 10,
  },
  imagePreviewContainer: {
    borderWidth: 1,
    borderColor: '#7266E2',
    borderRadius: 10,
    overflow: 'hidden',
    width: '95%',
    aspectRatio: 16 / 6,
    marginBottom: 20,
    marginHorizontal: '2.5%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },

  picker: {
    flex: 1,
  },
  withUnitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitText: {
    fontSize: 16,
    color: '#7266E2',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  inputBoxWithUnit: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7266E2',
    paddingHorizontal: 5,
    width: '85%',
    height: 60,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7266E2',
    paddingHorizontal: 5,
    width: '100%',
    height: 60,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#7266E2',
    borderRadius: 10,
    margin: 20,
  },
});

export default HomeEditScreen;
