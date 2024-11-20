import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/AuthSlice";
import SignInScreen from "./Screens/SignInScreen";
import HomeScreen from "./Screens/HomeScreen";

const store = configureStore({
  reducer: {
    AuthSlice,
  },
});

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Signin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Signin" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
