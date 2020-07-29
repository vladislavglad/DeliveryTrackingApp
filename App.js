import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Custom Screens.
import HomeScreen from "./screens/HomeScreen"
import RequestTracking from "./screens/RequestTracking"
import CheckStatus from "./screens/CheckStatus"

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="homeScreen"
          component={HomeScreen}
          options={{
            title: "Delivery Tracking App",
            headerTitleAlign: "center"
          }}
        />
        <Stack.Screen
          name="requestScreen"
          component={RequestTracking}
          options={{
            title: "Request Tracking",
            headerTitleAlign: "center"
          }}
        />
        <Stack.Screen
          name="checkScreen"
          component={CheckStatus}
          options={{
            title: "Check Status",
            headerTitleAlign: "center"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
