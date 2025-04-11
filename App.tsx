import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './app/screens/LoginScreen';
import AdminDashBoard from './app/screens/AdminDashBoard';
import ManageStudents from './app/screens/ManageStudents';
import ManageLecturers from './app/screens/ManageLecturers';
import ManageCourses from './app/screens/ManageCourses';
import Reports from './app/screens/Reports';
import LecturerDashBoard from './app/screens/LecturerDashBoard';
import StudentDashBoard from './app/screens/StudentDashBoard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' }
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminDashBoard" component={AdminDashBoard} />
          <Stack.Screen name="ManageStudents" component={ManageStudents} />
          <Stack.Screen name="ManageLecturers" component={ManageLecturers} />
          <Stack.Screen name="ManageCourses" component={ManageCourses} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="LecturerDashBoard" component={LecturerDashBoard} />
          <Stack.Screen name="StudentDashBoard" component={StudentDashBoard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}