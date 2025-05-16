import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';

interface Student {
  user_id: string;
  name: string;
  username: string;
}

interface Section {
  section_name: string;
  section_id: string;
}

const ClassDetails: React.FC<any> = ({ route, navigation }) => {
  const { subject_name, subject_id, section_id } = route.params;
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Fetch sections for this subject and instructor
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/teacher-assignments/sections/${subject_id}`
        );
        setSections(response.data.sections);
        // Auto-select first section if available
        if (response.data.sections.length > 0) {
          setSelectedSection(response.data.sections[0].section_id);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, [subject_id]);

  // Fetch students whenever section changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSection) return;
      
      try {
        const response = await axios.get(
          `${API_URL}/enrollments/students/${selectedSection}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [selectedSection]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentId}>{item.username}</Text>
      <Text style={styles.studentName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Current Date/Time Display */}
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>{formatDate(currentDateTime)}</Text>
        <Text style={styles.timeText}>{formatTime(currentDateTime)}</Text>
      </View>

      {/* Class Info */}
      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{subject_name}</Text>
          <Text style={styles.subValue}>{subject_id}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Section:</Text>
          <TouchableOpacity style={styles.sectionSelector}>
            <Text style={styles.sectionText}>{section_id}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Class Students:</Text>
          <TouchableOpacity 
            style={styles.studentsButton}
            onPress={() => navigation.navigate('StudentList', { 
              subject_id,
              section_id 
            })}
          >
            <Text style={styles.studentsButtonText}>{students.length} students</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    padding: 5,
  },
  dateTimeContainer: {
    backgroundColor: '#2567E8',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  timeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#2567E8',
    fontWeight: '600',
  },
  subValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionText: {
    fontSize: 16,
    color: '#000',
  },
  studentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  studentsButtonText: {
    fontSize: 16,
    color: '#666',
  },
  studentItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentId: {
    width: 100,
    color: '#666',
  },
  studentName: {
    flex: 1,
    color: '#333',
  },
});

export default ClassDetails;
