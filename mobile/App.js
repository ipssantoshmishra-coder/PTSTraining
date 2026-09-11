import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LodgingScreen from './src/screens/LodgingScreen';
import FoodingScreen from './src/screens/FoodingScreen';
import IndoorScreen from './src/screens/IndoorScreen';
import OutdoorScreen from './src/screens/OutdoorScreen';
import LeavePortalScreen from './src/screens/LeavePortalScreen';
import ExamPortalScreen from './src/screens/ExamPortalScreen';

const Stack = createNativeStackNavigator();

const commonHeaderOptions = {
  headerStyle: { backgroundColor: '#0B2545' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={commonHeaderOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'प्रशिक्षु डैशबोर्ड (Dashboard)', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Lodging"
          component={LodgingScreen}
          options={{ title: 'आवास आवंटन (Lodging)' }}
        />
        <Stack.Screen
          name="Fooding"
          component={FoodingScreen}
          options={{ title: 'मेस आवंटन (Fooding)' }}
        />
        <Stack.Screen
          name="Indoor"
          component={IndoorScreen}
          options={{ title: 'अंत: कक्ष प्रशिक्षण (Indoor)' }}
        />
        <Stack.Screen
          name="Outdoor"
          component={OutdoorScreen}
          options={{ title: 'वाह्य कक्ष प्रशिक्षण (Outdoor)' }}
        />
        <Stack.Screen
          name="LeavePortal"
          component={LeavePortalScreen}
          options={{ title: 'अवकाश पोर्टल (Leave)' }}
        />
        <Stack.Screen
          name="ExamPortal"
          component={ExamPortalScreen}
          options={{ title: 'परीक्षा समय सारिणी (Exams)' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}