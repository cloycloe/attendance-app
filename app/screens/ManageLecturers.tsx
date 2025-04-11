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

const ManageLecturers = ({ navigation }) => {
  const [lecturers, setLecturers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [newLecturer, setNewLecturer] = useState({
    user_id: '',
    username: '',
    password: '',
    name: '',
    role: 'Instructor'
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://192.168.5.178:5000/api/users?role=Instructor');
      setLecturers(response.data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      Alert.alert('Error', 'Failed to fetch lecturers');
    }
  };

  const handleAddLecturer = async () => {
    try {
      if (!newLecturer.user_id || !newLecturer.username || !newLecturer.name) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      if (isEditing && selectedLecturer) {
        // Update existing lecturer
        const response = await axios.put(`http://192.168.5.178:5000/api/users/${selectedLecturer._id}`, {
          name: newLecturer.name,
          username: newLecturer.username,
          ...(newLecturer.password ? { password: newLecturer.password } : {})
        });

        if (response.data) {
          Alert.alert('Success', 'Lecturer updated successfully');
        }
      } else {
        // Add new lecturer
        const response = await axios.post('http://192.168.5.178:5000/api/users/add', {
          ...newLecturer,
          user_id: parseInt(newLecturer.user_id),
          role: 'Instructor'
        });

        if (response.data.user) {
          Alert.alert('Success', 'Lecturer added successfully');
        }
      }

      setModalVisible(false);
      fetchLecturers();
      resetForm();
    } catch (error) {
      console.error('Error with lecturer:', error);
      Alert.alert('Error', isEditing ? 'Failed to update lecturer' : 'Failed to add lecturer');
    }
  };

  const handleEditLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    setNewLecturer({
      user_id: lecturer.user_id.toString(),
      username: lecturer.username,
      password: '', // Don't include the current password
      name: lecturer.name,
      role: 'Instructor'
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteLecturer = async (lecturerId) => {
    try {
      await axios.delete(`http://192.168.5.178:5000/api/users/${lecturerId}`);
      Alert.alert('Success', 'Lecturer deleted successfully');
      fetchLecturers();
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      Alert.alert('Error', 'Failed to delete lecturer');
    }
  };

  const resetForm = () => {
    setNewLecturer({
      user_id: '',
      username: '',
      password: '',
      name: '',
      role: 'Instructor'
    });
    setSelectedLecturer(null);
    setIsEditing(false);
  };

  const filteredLecturers = lecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Lecturers</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search lecturer..."
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

      {/* Lecturer List */}
      <FlatList
        data={filteredLecturers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.lecturerItem}>
            <View style={styles.lecturerInfo}>
              <Image 
                source={require('../../assets/avatar.png')} 
                style={styles.avatar} 
              />
              <Text style={styles.lecturerName}>{item.name}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => handleEditLecturer(item)}
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
                      { text: 'Delete', onPress: () => handleDeleteLecturer(item._id) }
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
              {isEditing ? 'Edit Lecturer' : 'Add New Lecturer'}
            </Text>
            
            {!isEditing && (
              <TextInput
                style={styles.input}
                placeholder="Lecturer ID"
                value={newLecturer.user_id}
                onChangeText={(text) => setNewLecturer({...newLecturer, user_id: text})}
                keyboardType="numeric"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newLecturer.username}
              onChangeText={(text) => setNewLecturer({...newLecturer, username: text})}
            />

            <TextInput
              style={styles.input}
              placeholder={isEditing ? "New Password (leave blank to keep current)" : "Password"}
              value={newLecturer.password}
              onChangeText={(text) => setNewLecturer({...newLecturer, password: text})}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newLecturer.name}
              onChangeText={(text) => setNewLecturer({...newLecturer, name: text})}
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
                onPress={handleAddLecturer}
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
  lecturerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  lecturerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  lecturerName: {
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

export default ManageLecturers;