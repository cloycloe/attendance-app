import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './app/screens/LoginScreen';
import AdminDashBoard from './app/screens/admin/AdminDashBoard';
import ManageStudents from './app/screens/admin/ManageStudents';
import ManageLecturers from './app/screens/admin/ManageLecturers';
import ManageCourses from './app/screens/admin/ManageCourses';
import Reports from './app/screens/admin/Reports';
import LecturerDashBoard from './app/screens/lecturer/LecturerDashBoard';
import LecturerClasses from './app/screens/lecturer/LecturerClasses';
import StudentDashBoard from './app/screens/student/StudentDashBoard';
import ClassDetails from './app/screens/lecturer/ClassDetails';
import StudentList from './app/screens/lecturer/StudentList';
import LecturerScanner from './app/screens/lecturer/LecturerScanner';

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
          <Stack.Screen name="LecturerClasses" component={LecturerClasses} />
          <Stack.Screen name="StudentDashBoard" component={StudentDashBoard} />
          <Stack.Screen name="ClassDetails" component={ClassDetails} />
          <Stack.Screen name="StudentList" component={StudentList} />
          <Stack.Screen name="LecturerScanner" component={LecturerScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}