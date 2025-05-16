import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Reports = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://192.168.5.178:5000/api/courses');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      Alert.alert('Error', 'Failed to fetch classes');
    }
  };

  const generateCSV = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }

    try {
      const response = await axios.get('http://192.168.5.178:5000/api/attendance/report', {
        params: {
          classId: selectedClass,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      // Convert data to CSV format
      const headers = 'Date,Student ID,Student Name,Status\n';
      const csvData = response.data.map(record => 
        `${record.date},${record.student_id},${record.student_name},${record.status}`
      ).join('\n');
      
      const csv = headers + csvData;
      
      // Generate filename with current date
      const fileName = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
      
      if (Platform.OS === 'android') {
        const fileUri = `${FileSystem.documentDirectory}/${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, csv);
        await Sharing.shareAsync(fileUri);
      } else {
        // iOS handling
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, csv);
        await Sharing.shareAsync(fileUri);
      }

      Alert.alert('Success', 'Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDate(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDate(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Report</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Class Picker */}
        <Text style={styles.label}>Class:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedClass}
            onValueChange={(itemValue) => setSelectedClass(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a class" value="" />
            {classes.map((cls) => (
              <Picker.Item 
                key={cls._id} 
                label={cls.course_name} 
                value={cls._id} 
              />
            ))}
          </Picker>
        </View>

        {/* Date Range */}
        <Text style={styles.label}>Date Range:</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowStartDate(true)}
          >
            <Text>From: {startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowEndDate(true)}
          >
            <Text>To: {endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showStartDate && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={onStartDateChange}
          />
        )}

        {showEndDate && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={onEndDateChange}
          />
        )}

        {/* Generate Button */}
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={generateCSV}
        >
          <Text style={styles.generateButtonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  generateButton: {
    backgroundColor: '#4EABE9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reports;