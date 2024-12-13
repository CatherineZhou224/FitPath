import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Icon } from '@rneui/themed';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function CameraScreen({ navigation, route }) {
  const { onSave, workoutKey } = route.params; // Accept `workoutKey` for linking to the workout
  const [permission, requestPermission] = useCameraPermissions();
  let cameraRef;
  const storage = getStorage();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSnap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();

      try {
        const fileName = photo.uri.split('/').pop();
        const photoRef = ref(storage, `workouts/${fileName}`);
        const response = await fetch(photo.uri);
        const imageBlob = await response.blob();
        await uploadBytes(photoRef, imageBlob);
        const downloadURL = await getDownloadURL(photoRef);

        // Pass the image URL back to HomeEditScreen
        if (onSave) onSave(downloadURL);
        navigation.goBack();
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#7266E2" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera</Text>
      </View>

      {/* Camera View */}
      <CameraView
        style={styles.camera}
        ref={(ref) => (cameraRef = ref)}
        ratio="4:3"
      />

      {/* Snap Button */}
      <TouchableOpacity style={styles.snapButton} onPress={handleSnap}>
        <Icon name="camera" type="material-community" color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  snapButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#7266E2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#7266E2',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CameraScreen;
