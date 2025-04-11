import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView as SafeAreaViewRN } from 'react-native-safe-area-context';

const handleLogout = (navigation) => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Simply navigate back to login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    ]
  );
};

const AdminDashboard = ({ navigation, route }) => {
  const [studentCount, setStudentCount] = useState(0);
  const [lecturerCount, setLecturerCount] = useState(0);

  useEffect(() => {
    fetchUserCounts();
  }, []);

  const fetchUserCounts = async () => {
    try {
      const response = await axios.get('http://192.168.254.163:5000/api/users');
      const users = response.data;
      
      // Count students and lecturers
      const students = users.filter(user => user.role === 'Student');
      const lecturers = users.filter(user => user.role === 'Instructor');
      
      setStudentCount(students.length);
      setLecturerCount(lecturers.length);
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  return (
    <SafeAreaViewRN style={styles.container} edges={['top']}>
      <StatusBar backgroundColor="#4EABE9" barStyle="light-content" />
      
      {/* Dashboard Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={require('../../assets/avatar.png')}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{route.params?.user?.name || 'Admin'}</Text>
            <Text style={styles.userRole}>Administrator</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => handleLogout(navigation)}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Total number of Students: <Text style={styles.statValue}>{studentCount}</Text></Text>
        <Text style={styles.statText}>Total number of Lecturers: <Text style={styles.statValue}>{lecturerCount}</Text></Text>
      </View>
      
      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        {/* Row 1 */}
        <View style={styles.menuRow}>
          {/* Students */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: '#4EABE9' }]}
            onPress={() => navigation.navigate('ManageStudents')}
          >
            <Ionicons name="people" size={32} color="white" />
            <Text style={styles.menuText}>Students</Text>
          </TouchableOpacity>
          
          {/* Lecturer */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: '#36BF7F' }]}
            onPress={() => navigation.navigate('ManageLecturers')}
          >
            <Ionicons name="person" size={32} color="white" />
            <Text style={styles.menuText}>Lecturer</Text>
          </TouchableOpacity>
        </View>
        
        {/* Row 2 */}
        <View style={styles.menuRow}>
          {/* Courses */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: '#F1DC50' }]}
            onPress={() => navigation.navigate('ManageCourses')}
          >
            <Ionicons name="school" size={32} color="white" />
            <Text style={styles.menuText}>Courses</Text>
          </TouchableOpacity>
          
          {/* Reports */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: '#FB6259' }]}
            onPress={() => navigation.navigate('Reports')}
          >
            <Ionicons name="document-text" size={32} color="white" />
            <Text style={styles.menuText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminDashboard')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ManageStudents')}>
          <Ionicons name="people" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ManageLecturers')}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ManageCourses')}>
          <Ionicons name="school" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Reports')}>
          <Ionicons name="document-text" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaViewRN>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4EABE9',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  statsContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  statText: {
    fontSize: 16,
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
  },
  menuGrid: {
    padding: 15,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItem: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4EABE9',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdminDashboard;
