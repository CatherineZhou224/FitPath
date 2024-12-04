import { signOut, getAuthUser } from "../AuthManager";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Icon, Button } from "@rneui/themed";
import WorkoutListItem from "../components/WorkoutListItem";
import { useSelector, useDispatch } from 'react-redux';
import { getWorkoutsThunk } from "../features/workoutsSlice";
import moment from 'moment';

function HomeScreen(props) {
    const dispatch = useDispatch();
    const { navigation } = props;

    // Workouts from Redux store
    const workouts = useSelector((state) => state.workouts.list);

    // Get current date
    const currentDate = moment().format("dddd, MMM DD, YYYY");

    useEffect(() => {
        dispatch(getWorkoutsThunk());
    }, [dispatch]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerDateText}>{`Today, ${currentDate}`}</Text>
                <Icon
                    name="calendar"
                    type="ionicon"
                    color="black"
                    size={24}
                    containerStyle={styles.calendarIcon}
                />
            </View>

            {/* Workout List */}
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.key}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.cardContainer}
                        onPress={() => navigation.navigate('HomeDetailScreen', { item })}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Workout {index + 1}</Text>
                            <Text style={styles.cardDate}>{moment(item.startTime).format('MMM DD, HH:mm')}</Text>
                        </View>
                        <Text style={styles.timeSpentLabel}>Time spent</Text>
                        <View style={styles.timeSpentContainer}>
                            <Text style={styles.timeSpent}>{Math.floor(item.duration / 60)}</Text>
                            <Text style={styles.timeUnit}>hr</Text>
                            <Text style={styles.timeSpent}>{item.duration % 60}</Text>
                            <Text style={styles.timeUnit}>min</Text>
                        </View>
                        <Text style={styles.locationText}>{item.location}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContainer}
            />

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('HomeEditScreen', {
                    item: { key: -1, workoutType: '', startTime: '', duration: '', calories: '', location: '' }
                })}
            >
                <Icon
                    name="add"
                    type="ionicon"
                    color="white"
                    size={50}
                />
            </TouchableOpacity>

            <View style={{"marginBottom": 20}}>
                <Text>You're signed in, {getAuthUser().displayName}!</Text>

                <Button
                    onPress={async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            Alert.alert("Sign In Error", error.message, [{ text: "OK" }]);
                        }
                    }}
                >
                    Now sign out!
                </Button>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 10,
        backgroundColor: 'white',
    },
    headerDateText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    calendarIcon: {
        padding: 5,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 100, // Extra space for floating add button
    },
    cardContainer: {
        backgroundColor: '#EDEDED',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardDate: {
        fontSize: 14,
        color: '#777',
    },
    timeSpentLabel: {
        fontSize: 14,
        color: '#777',
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
    },
    timeUnit: {
        fontSize: 14,
        marginLeft: 5,
        marginRight: 15,
        color: '#333',
    },
    locationText: {
        fontSize: 14,
        color: '#777',
    },
    addButton: {
        position: 'absolute',
        bottom: 90,
        alignSelf: 'center',
        backgroundColor: '#7266E2',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#7266E2',
        marginTop: 5,
    },
});

export default HomeScreen;
