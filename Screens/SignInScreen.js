import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { signIn, signUp, subscribeToAuthChanges } from "../AuthManager";
import { addUser } from "../features/AuthSlice";

function SigninBox({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign In</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter email address"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter password"
            autoCapitalize="none"
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginButtonRow}>
        <Button
          titleStyle={styles.loginButtonText}
          buttonStyle={styles.loginButton}
          onPress={async () => {
            try {
              await signIn(email, password);
            } catch (error) {
              Alert.alert(
                "You Were Unable to Get in",
                `The robot said: ${error.message}`,
                [{ text: "OK" }]
              );
            }
          }}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}

function SignupBox({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const dispatch = useDispatch();
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign Up</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Display Name: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter display name"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setDisplayName(text)}
            value={displayName}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter email address"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter password"
            autoCapitalize="none"
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginButtonRow}>
        <Button
          titleStyle={styles.loginButtonText}
          buttonStyle={styles.loginButton}
          onPress={async () => {
            try {
              const newUser = await signUp(displayName, email, password);
              dispatch(addUser(newUser));
            } catch (error) {
              Alert.alert("Sign Up Error", error.message, [{ text: "OK" }]);
            }
          }}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
}

function SignInScreen({ navigation }) {
  const [loginMode, setLoginMode] = useState(true);
  useEffect(() => {
    subscribeToAuthChanges(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/FitPath.png")}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>FitPath</Text>
      </ImageBackground>
      <View style={styles.bodyContainer}>
        {loginMode ? (
          <SigninBox navigation={navigation} />
        ) : (
          <SignupBox navigation={navigation} />
        )}
        <View styles={styles.modeSwitchContainer}>
          {loginMode ? (
            <Text>
              New user?
              <Text
                onPress={() => {
                  setLoginMode(!loginMode);
                }}
                style={{ color: "#574AD6" }}
              >
                {" "}
                Sign up{" "}
              </Text>
              instead!
            </Text>
          ) : (
            <Text>
              Returning user?
              <Text
                onPress={() => {
                  setLoginMode(!loginMode);
                }}
                style={{ color: "#574AD6" }}
              >
                {" "}
                Sign in{" "}
              </Text>
              instead!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerContainer: {
    flex: 0.25,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    overflow: "hidden",
  },
  headerText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: "20%",
  },
  bodyContainer: {
    flex: 0.6,
    width: "80%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: "10%",
    paddingBottom: "10%",
  },
  loginHeader: {
    width: "100%",
    padding: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginHeaderText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    paddingBottom: "5%",
  },
  loginRow: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    paddingBottom: "4%",
  },
  loginLabelContainer: {
    justifyContent: "center",
    width: "50%",
    paddingVertical: "2%",
  },
  loginLabelText: {
    fontSize: 16,
  },
  loginInputContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  loginInputBox: {
    width: "100%",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    padding: "2%",
  },
  modeSwitchContainer: {
    flex: 0.2,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "10%",
  },
  loginButtonRow: {
    width: "100%",
    justifyContent: "center",
    marginTop: "8%",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#7266E2",
    borderRadius: 6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  listContainer: {
    flex: 0.7,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
export default SignInScreen;
