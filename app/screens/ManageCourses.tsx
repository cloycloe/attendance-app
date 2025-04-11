import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ManageCourses = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    course_id: '',
    course_name: '',
    course_code: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://192.168.254.163:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to fetch courses');
    }
  };

  const handleAddCourse = async () => {
    try {
      if (!newCourse.course_name || !newCourse.course_code) {
        Alert.alert('Error', 'Course name and code are required');
        return;
      }

      if (isEditing && selectedCourse) {
        // Update existing course
        const response = await axios.put(`http://192.168.254.163:5000/api/courses/${selectedCourse._id}`, {
          course_name: newCourse.course_name,
          course_code: newCourse.course_code
        });

        if (response.data) {
          Alert.alert('Success', 'Course updated successfully');
        }
      } else {
        // Add new course
        const response = await axios.post('http://192.168.254.163:5000/api/courses/add', newCourse);
        if (response.data) {
          Alert.alert('Success', 'Course added successfully');
        }
      }

      setModalVisible(false);
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error with course:', error);
      Alert.alert('Error', isEditing ? 'Failed to update course' : 'Failed to add course');
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setNewCourse({
      course_id: course.course_id?.toString() || '',
      course_name: course.course_name,
      course_code: course.course_code
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://192.168.254.163:5000/api/courses/${courseId}`);
      Alert.alert('Success', 'Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      Alert.alert('Error', 'Failed to delete course');
    }
  };

  const resetForm = () => {
    setNewCourse({
      course_id: '',
      course_name: '',
      course_code: ''
    });
    setSelectedCourse(null);
    setIsEditing(false);
  };

  const courseColors = ['#4EABE9', '#36BF7F', '#FB6259'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Courses</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Title and Actions */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Courses</Text>
        <View style={styles.titleActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Course List */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={[styles.courseItem, { backgroundColor: courseColors[index % courseColors.length] }]}>
            <Text style={styles.courseName}>{item.course_name}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditCourse(item)}
              >
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    'Confirm Delete',
                    `Are you sure you want to delete ${item.course_name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: () => handleDeleteCourse(item._id) }
                    ]
                  );
                }}
              >
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.courseList}
      />

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Course' : 'Add New Course'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={newCourse.course_name}
              onChangeText={(text) => setNewCourse({...newCourse, course_name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Course Code"
              value={newCourse.course_code}
              onChangeText={(text) => setNewCourse({...newCourse, course_code: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddCourse}
              >
                <Text style={styles.modalButtonText}>
                  {isEditing ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4EABE9',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginLeft: 15,
  },
  courseList: {
    padding: 15,
  },
  courseItem: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    minHeight: 80,
  },
  courseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  editButton: {
    marginRight: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#4EABE9',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ManageCourses;
