import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Icon } from "@rneui/themed";

import AuthSlice from "./features/AuthSlice";

import SignInScreen from "./Screens/SignInScreen";

import HomeScreen from "./Screens/HomeScreen";
import HomeEditScreen from "./Screens/HomeEditScreen";
import HomeDetailScreen from "./Screens/HomeDetailScreen";
import CameraScreen from "./Screens/CameraScreen";
import CalendarScreen from "./Screens/CalendarScreen";

import ProfileScreen from "./Screens/ProfileScreen";

import store from './app/store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarActiveTintColor: "#7266E2",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="calendar"
                type="font-awesome"
                color={color}
                size={size}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarActiveTintColor: "#7266E2",
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon name="people" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false, // Hide the default header
      }}
    >
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='HomeEditScreen' component={HomeEditScreen}/>
      <Stack.Screen name='HomeDetailScreen' component={HomeDetailScreen}/>
      <Stack.Screen name='CameraScreen' component={CameraScreen}/>
      <Stack.Screen name='CalendarScreen' component={CalendarScreen}/>
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Signin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Signin" component={SignInScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
