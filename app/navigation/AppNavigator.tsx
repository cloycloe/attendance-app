import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import AdminDashboard from '../screens/AdminDashboard';
import ManageCourses from '../screens/ManageCourses';
import ManageStudents from '../screens/ManageStudents';
import ManageLecturers from '../screens/ManageLecturers';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="ManageCourses" component={ManageCourses} />
        <Stack.Screen name="ManageStudents" component={ManageStudents} />
        <Stack.Screen name="ManageLecturers" component={ManageLecturers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
