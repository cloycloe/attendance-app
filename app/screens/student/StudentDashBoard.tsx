import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { API_URL } from '../../config/api';

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
        text: "Yes",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    ]
  );
};

const SubjectCard = ({ subject }) => (
  <TouchableOpacity style={styles.subjectCard}>
    <Text style={styles.subjectName}>{subject.name}</Text>
    <Text style={styles.subjectCode}>{subject.code}</Text>
  </TouchableOpacity>
);

const StudentDashboard = ({ navigation, route }) => {
  const [subjects, setSubjects] = useState([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    if (route.params?.user?.name) {
      setStudentName(route.params.user.name);
    }
    fetchStudentSubjects();
  }, []);

  const fetchStudentSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects?studentId=${route.params?.user?._id}`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle" size={40} color="white" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>
              {route.params?.user?.name || 'Student Name'}
            </Text>
            <Text style={styles.roleText}>Student</Text>
          </View>
          <TouchableOpacity onPress={() => handleLogout(navigation)}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.loadingText}>Fetching data...</Text>
      </View>

      <Text style={styles.sectionTitle}>Subjects</Text>
      
      <FlatList
        data={subjects}
        renderItem={({ item }) => <SubjectCard subject={item} />}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.subjectList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: {
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  subjectsContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subjectsList: {
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#4EABE9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  subjectName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subjectCode: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4EABE9',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentDashboard;
