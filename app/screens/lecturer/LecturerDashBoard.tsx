import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { width } = Dimensions.get('window');

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

interface Course {
  course_id: string;
  course_name: string;
  subjects: Array<{
    subject_id: string;
    subject_name: string;
    section_id: string;
  }>;
}

const LecturerDashBoard = ({ navigation, route }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturerName, setLecturerName] = useState('');
  const user = route.params?.user;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get lecturer name from login data
    if (route.params?.user?.name) {
      setLecturerName(route.params.user.name);
    }
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/instructor/courses/${user.user_id}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Received courses:', data);
      setCourses(data || []);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        'Could not fetch courses. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.courseCard, { backgroundColor: getRandomColor() }]}
      onPress={() => navigation.navigate('Classes', { courseId: item._id })}
    >
      <Text style={styles.courseText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image
            source={require('../../../assets/profile1.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nameText}>{user?.name}</Text>
            <Text style={styles.roleText}>Instructor</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Courses</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>Loading courses...</Text>
        ) : courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.courseCard, styles.bsitCard]}
              onPress={() => navigation.navigate('LecturerClasses', {
                courseId: course.course_id,
                courseName: course.course_name,
                subjects: course.subjects 
              })}
            >
              <Text style={styles.courseText}>{course.course_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noCoursesText}>No courses assigned yet</Text>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#2567E8',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  coursesList: {
    paddingBottom: 20,
  },
  courseCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#2567E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: 24,
    paddingHorizontal: 5
  },
  sectionText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  bottomNavContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2567E8',
    paddingVertical: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
  },
  bsitCard: {
    backgroundColor: '#2567E8',
  },
  subjectsContainer: {
    marginTop: 10,
  },
  subjectItem: {
    marginBottom: 5,
  },
  subjectCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  subjectName: {
    fontSize: 12,
    color: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  noCoursesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default LecturerDashBoard;
