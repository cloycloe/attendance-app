import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import existing admin screens
import AdminDashBoard from '../screens/admin/AdminDashBoard';
import ManageCourses from '../screens/admin/ManageCourses';
import ManageStudents from '../screens/admin/ManageStudents';
import ManageLecturers from '../screens/admin/ManageLecturers';
import Reports from '../screens/admin/Reports';
import AttendanceReport from '../screens/admin/AttendanceReport';

// Import new screens
import LoginScreen from '../screens/LoginScreen';
import StudentDashBoard from '../screens/student/StudentDashBoard';
import QRCodeScreen from '../screens/student/QRCodeScreen';
import StudentAttendance from '../screens/student/StudentAttendance';

// Lecturer imports
import LecturerDashBoard from '../screens/lecturer/LecturerDashBoard';
import LecturerScanner from '../screens/lecturer/LecturerScanner';
import LecturerDashboard from '../screens/lecturer/LecturerDashboard';
import LecturerClasses from '../screens/lecturer/LecturerClasses';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Student Tab Navigator
const StudentTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'QR Code') {
          iconName = focused ? 'qr-code' : 'qr-code-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4EABE9',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={StudentDashBoard}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="QR Code" 
      component={QRCodeScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

// Lecturer Tab Navigator
const LecturerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Scanner') {
          iconName = focused ? 'scan' : 'scan-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4EABE9',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={LecturerDashBoard}
      options={{ headerShown: false }}
    />
    <Tab.Screen 
      name="Scanner" 
      component={LecturerScanner}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Login screen as initial screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Student routes */}
        <Stack.Screen 
          name="StudentDashBoard"
          component={StudentTabNavigator}
        />
        
        {/* Existing admin routes */}
        <Stack.Screen name="AdminDashboard" component={AdminDashBoard} />
        <Stack.Screen name="ManageCourses" component={ManageCourses} />
        <Stack.Screen name="ManageStudents" component={ManageStudents} />
        <Stack.Screen name="ManageLecturers" component={ManageLecturers} />
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="AttendanceReport" component={AttendanceReport} />
        
        {/* Lecturer routes */}
        <Stack.Screen 
          name="LecturerDashBoard"
          component={LecturerTabNavigator}
        />
        <Stack.Screen 
          name="LecturerDashboard" 
          component={LecturerDashboard} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LecturerClasses" 
          component={LecturerClasses} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
