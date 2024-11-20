import { Button } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { signOut, getAuthUser } from "../AuthManager";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HomeScreen;
