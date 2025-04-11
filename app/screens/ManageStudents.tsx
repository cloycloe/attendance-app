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
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ManageStudents = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    user_id: '',
    username: '',
    password: '',
    name: '',
    role: 'Student'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://192.168.5.178:5000/api/users?role=Student');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch students');
    }
  };

  const handleAddStudent = async () => {
    try {
      if (!newStudent.user_id || !newStudent.username || !newStudent.name) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      if (isEditing && selectedStudent) {
        // Update existing student
        const response = await axios.put(`http://192.168.5.178:5000/api/users/${selectedStudent._id}`, {
          name: newStudent.name,
          username: newStudent.username,
          ...(newStudent.password ? { password: newStudent.password } : {})
        });

        if (response.data) {
          Alert.alert('Success', 'Student updated successfully');
        }
      } else {
        // Add new student
        const response = await axios.post('http://192.168.5.178:5000/api/users/add', {
          ...newStudent,
          user_id: parseInt(newStudent.user_id),
          role: 'Student'
        });

        if (response.data.user) {
          Alert.alert('Success', 'Student added successfully');
        }
      }

      setModalVisible(false);
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error('Error with student:', error);
      Alert.alert('Error', isEditing ? 'Failed to update student' : 'Failed to add student');
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setNewStudent({
      user_id: student.user_id.toString(),
      username: student.username,
      password: '', // Don't include the current password
      name: student.name,
      role: 'Student'
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://192.168.5.178:5000/api/users/${studentId}`);
      Alert.alert('Success', 'Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', 'Failed to delete student');
    }
  };

  const resetForm = () => {
    setNewStudent({
      user_id: '',
      username: '',
      password: '',
      name: '',
      role: 'Student'
    });
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Students</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search student..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>

      {/* Add/Edit Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => {}} style={{ opacity: 0 }}>
          <Ionicons name="pencil" size={24} color="#4EABE9" />
        </TouchableOpacity>
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

      {/* Student List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <View style={styles.studentInfo}>
              <Image 
                source={require('../../assets/avatar.png')}
                style={styles.avatar} 
              />
              <Text style={styles.studentName}>{item.name}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => handleEditStudent(item)}
              >
                <Ionicons name="pencil" size={20} color="#4EABE9" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => {
                  Alert.alert(
                    'Confirm Delete',
                    `Are you sure you want to delete ${item.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', onPress: () => handleDeleteStudent(item._id) }
                    ]
                  );
                }}
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </Text>
            
            {!isEditing && (
              <TextInput
                style={styles.input}
                placeholder="Student ID"
                value={newStudent.user_id}
                onChangeText={(text) => setNewStudent({...newStudent, user_id: text})}
                keyboardType="numeric"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newStudent.username}
              onChangeText={(text) => setNewStudent({...newStudent, username: text})}
            />

            <TextInput
              style={styles.input}
              placeholder={isEditing ? "New Password (leave blank to keep current)" : "Password"}
              value={newStudent.password}
              onChangeText={(text) => setNewStudent({...newStudent, password: text})}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({...newStudent, name: text})}
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
                onPress={handleAddStudent}
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
  searchContainer: {
    padding: 10,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 10,
    paddingRight: 35,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  addButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  studentName: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 65,
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
    elevation: 5,
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
    alignItems: 'center',
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
  },
});

export default ManageStudents;