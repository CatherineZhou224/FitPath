import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getAuthUser } from "../AuthManager";
import { Button, Overlay, Icon, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ProfileScreen({ navigation }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [inputText, setInputText] = useState(0);

  const dispatch = useDispatch();
  //const goal = useSelector((state) => state.goal);

  //   useEffect(() => {
  //     dispatch(fetchGaol());
  //   }, []);

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
              setOverlayVisible(true);
            }}
          >
            <Text>Add Goal</Text>
          </Button>
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={styles.overlayView}
      >
        <View style={styles.inputBox}>
          <Text style={[styles.text, { color: "grey" }]}>{inputText}</Text>
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
              setInputText("");
              setOverlayVisible(false);
            }}
          />
          <Button
            title="Save"
            onPress={() => {
              //   if (selectedItem) {
              //     dispatch(
              //       updateGroup({ group: selectedItem, inputName: inputText })
              //     );
              //   } else {
              //     dispatch(addGroup(inputText));
              //   }
              setInputText("");
              setOverlayVisible(false);
            }}
          />
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
