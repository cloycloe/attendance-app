import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AttendanceReport = ({ navigation, route }) => {
  // Mock data - replace with actual data from your backend
  const [attendanceData] = useState([
    { date: '03/10/2024', status: 'Present' },
    { date: '03/11/2024', status: 'Absent' },
    { date: '03/12/2024', status: 'Present' },
    { date: '03/14/2024', status: 'Absent' },
  ]);

  const calculateAttendanceRate = () => {
    const presentCount = attendanceData.filter(item => item.status === 'Present').length;
    return (presentCount / attendanceData.length) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class</Text>
      </View>

      <View style={styles.subjectInfo}>
        <Text style={styles.label}>Subject:</Text>
        <Text style={styles.value}>Data Structure and Algorithms</Text>
        
        <Text style={styles.label}>Section:</Text>
        <Text style={styles.value}>IT2B</Text>
        
        <Text style={styles.label}>Start/End Time:</Text>
        <Text style={styles.value}>7:00 AM - 9:00 AM</Text>
      </View>

      <View style={styles.attendanceRate}>
        <View style={styles.circle}>
          <Text style={styles.rateText}>{`${Math.round(calculateAttendanceRate())}%`}</Text>
          <Text style={styles.rateLabel}>Attendance Rate</Text>
        </View>
      </View>

      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.attendanceItem}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={[
              styles.status,
              { color: item.status === 'Present' ? '#4CAF50' : '#F44336' }
            ]}>
              {item.status}
            </Text>
          </View>
        )}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4EABE9',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  subjectInfo: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  attendanceRate: {
    alignItems: 'center',
    padding: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4EABE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  rateText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  rateLabel: {
    color: 'white',
    fontSize: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
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

export default AttendanceReport;
