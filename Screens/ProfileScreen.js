import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { signOut, getAuthUser } from "../AuthManager";
import { fetchGoal, addGoal, updateGoal } from "../features/goalSlice";
import { Button, Overlay, Icon, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProgressChart, LineChart } from "react-native-chart-kit";
import { getWorkoutsThunk } from "../features/workoutsSlice";

const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: "transparent",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "transparent",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(114,102,226,${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const workoutsList = useSelector((state) => state.workouts.list);
  const goal = useSelector((state) => state.goal.personalGoal);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("workoutTime"); // State for active tab

  useEffect(() => {
    dispatch(fetchGoal());
    dispatch(getWorkoutsThunk());
  }, [dispatch]);

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  const filteredWorkouts = workoutsList.filter((workout) => {
    const workoutDate = new Date(workout.startTime);
    return workoutDate >= oneWeekAgo && workoutDate <= today;
  });
  function getDayIndex(date) {
    return (date.getDay() + 6) % 7;
  }
  // data for calorie chart
  let dailyDataCalories = [0, 0, 0, 0, 0, 0, 0]; // Monday=0, ... Sunday=6
  // data for time chart (total workout duration)
  let dailyDataTime = [0, 0, 0, 0, 0, 0, 0];

  filteredWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.startTime);
    const index = (workoutDate.getDay() + 6) % 7;

    // Calculate calories burned
    const calories = parseFloat(workout.calories) || 0;
    dailyDataCalories[index] += calories;

    // Calculate workout time (in minutes)
    const duration = parseFloat(workout.duration) || 0;
    dailyDataTime[index] += duration;
  });

  const workoutDataCalories = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        data: dailyDataCalories,
        color: (opacity = 1) => `rgba(134,65,244,${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const workoutDataTime = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        data: dailyDataTime,
        color: (opacity = 1) => `rgba(134,65,244,${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const totalDuration = filteredWorkouts.reduce((sum, workout) => {
    const duration = parseFloat(workout.duration) || 0;
    return sum + duration;
  }, 0);
  const targetTime = parseFloat(goal?.targetTime) * 60 || 0;
  let percentage = 0;
  if (targetTime > 0) {
    percentage = Math.floor((totalDuration / targetTime) * 100);
  }
  const personalGoal = {
    data: [percentage],
  };

  const handleSaveGoal = () => {
    if (goal) {
      // Goal exists, update it
      dispatch(updateGoal({ ...goal, targetTime: inputText }));
      {
        console.log("update goal");
      }
    } else {
      // No goal yet, add it
      dispatch(addGoal({ targetTime: inputText }));
      {
        console.log("add goal");
      }
    }
    setOverlayVisible(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.welcome}>
          <Icon
            style={styles.icon}
            name="hand-wave"
            type="material-community"
            size={20}
            color={"#7266E2"}
          />
          <Text style={styles.text}>Hi, {getAuthUser()?.displayName}!</Text>
        </View>
        <View
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
            marginBottom: 30,
          }}
        >
          <ProgressChart
            data={personalGoal}
            width={screenWidth * 0.7}
            height={220}
            strokeWidth={16}
            radius={100}
            chartConfig={chartConfig}
            hideLegend={true}
            style={{
              backgroundColor: "transparent",
            }}
          />
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "30%",
            }}
          >
            {goal && (
              <>
                <Text>Goal Progress</Text>
                <Text
                  style={{
                    fontSize: 40,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  {personalGoal.data[0]} %
                </Text>
              </>
            )}
            <TouchableOpacity>
              <Button
                color={"#7266E2"}
                onPress={() => {
                  setInputText(goal?.targetTime ?? "0");
                  setOverlayVisible(true);
                }}
              >
                <Text style={{ color: "white" }}>
                  {goal ? `Edit Goal` : "Add Goal"}
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
        </View>
        <Overlay
          isVisible={overlayVisible}
          onBackdropPress={() => setOverlayVisible(false)}
          overlayStyle={styles.overlayView}
        >
          <View style={styles.header}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 5,
              }}
            >
              Weekly Goal
            </Text>
            <Text>Total time you'd like to achieve</Text>
          </View>
          <View style={styles.withUnitContainer}>
            <Input
              containerStyle={styles.inputBoxWithUnit}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              placeholder="0"
              value={inputText}
              onChangeText={(text) => setInputText(text)}
              keyboardType="numeric"
            />
            <Text style={styles.unitText}>hr(s)/week</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "80%",
            }}
          >
            <Button
              title="Cancel"
              buttonStyle={styles.cancelButton}
              onPress={() => {
                setOverlayVisible(false);
              }}
            />
            <Button
              title="Save"
              buttonStyle={styles.saveButton}
              onPress={handleSaveGoal}
            />
          </View>
        </Overlay>

        <Text style={styles.title}>Weekly Performance Overview</Text>

        {/* Toggle Button */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "workoutTime" && styles.activeTab,
            ]}
            onPress={() => handleTabChange("workoutTime")}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === "workoutTime" && styles.activeText,
              ]}
            >
              Workout Time
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "caloriesBurned" && styles.activeTab,
            ]}
            onPress={() => handleTabChange("caloriesBurned")}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === "caloriesBurned" && styles.activeText,
              ]}
            >
              Calories burned
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the appropriate chart based on the selected tab */}
        {activeTab === "workoutTime" ? (
          <LineChart
            data={workoutDataTime} // Time chart data
            width={screenWidth * 0.9}
            height={256}
            verticalLabelRotation={30}
            chartConfig={chartConfig}
            bezier
          />
        ) : (
          <LineChart
            data={workoutDataCalories} // Calories chart data
            width={screenWidth * 0.9}
            height={256}
            verticalLabelRotation={30}
            chartConfig={chartConfig}
            bezier
          />
        )}

        <Button
          title="Log out"
          buttonStyle={styles.logoutButton}
          icon={{
            name: "save",
            type: "material",
            color: "white",
          }}
          onPress={async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert("Sign In Error", error.message, [{ text: "OK" }]);
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  header: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressRing: {},
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 18,
    color: "#7266E2",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 30,
  },
  overlayView: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  withUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  unitText: {
    fontSize: 16,
    color: "#7266E2",
    marginLeft: 10,
    fontWeight: "bold",
  },
  inputBoxWithUnit: {
    backgroundColor: "#F0E4FE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    paddingHorizontal: 5,
    width: "20%",
    height: 40,
  },
  saveButton: {
    backgroundColor: "#7266E2",
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: "black",
    borderRadius: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 30,
  },
  activeTab: {
    backgroundColor: "#7266E2",
  },
  toggleText: {
    color: "#333",
    fontSize: 16,
  },
  activeText: {
    color: "white",
  },
  logoutButton: {
    backgroundColor: "#7266E2",
    borderRadius: 10,
    marginTop: 30,
    width: "95%",
  },
});

export default ProfileScreen;
