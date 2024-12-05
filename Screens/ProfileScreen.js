import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuthUser } from "../AuthManager";
import { fetchGoal, addGoal, updateGoal } from "../features/userSlice";
import { Button, Overlay, Icon, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const userId = getAuthUser()?.uid;

  const goal = useSelector((state) => state.user?.personalGoal);
  console.log("goal:", goal);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchGoal(userId));
    }
  }, [dispatch, userId]);

  const handleSaveGoal = () => {
    if (goal) {
      dispatch(
        updateGoal({
          userId,
          updatedGoal: { ...goal, targetTime: inputText },
        })
      );
      {
        console.log("update");
      }
    } else {
      dispatch(addGoal({ userId, goal: { targetTime: inputText } }));
      {
        console.log("add");
      }
    }
    setOverlayVisible(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.welcome}>
          <Icon
            style={styles.icon}
            name="hand-wave"
            type="material-community"
            size={20}
            color="#000"
          />
          <Text style={styles.text}>Hi, {getAuthUser().displayName}!</Text>
        </View>
        <TouchableOpacity>
          <Button
            onPress={() => {
              setInputText(goal?.targetTime ?? "0");
              setOverlayVisible(true);
            }}
          >
            <Text>
              {goal ? `Edit Goal: ${goal.targetTime} hrs/week` : "Add Goal"}
            </Text>
          </Button>
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={styles.overlayView}
      >
        <View style={styles.inputBox}>
          <Input
            placeholder="0"
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            keyboardType="numeric"
          />
          <Text style={styles.text}>hrs/week</Text>
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
            onPress={() => {
              setOverlayVisible(false);
            }}
          />
          <Button title="Save" onPress={handleSaveGoal} />
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 18,
  },
  overlayView: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
});

export default ProfileScreen;
