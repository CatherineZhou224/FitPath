import { View, Text, StyleSheet } from "react-native";
import { getAuthUser } from "../AuthManager";
import { Icon } from "@rneui/themed";
import { Button } from "@rneui/themed";

function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
      <Button>
        <Text>Add Goal</Text>
      </Button>
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
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 18,
  },
});

export default ProfileScreen;
