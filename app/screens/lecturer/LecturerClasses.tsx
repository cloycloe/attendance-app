import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  LecturerClasses: {
    courseId: string;
    courseName: string;
    subjects: Array<{
      subject_id: string;
      subject_name: string;
      section_id: string;
    }>;
  };
};

type LecturerClassesProps = {
  navigation: StackNavigationProp<RootStackParamList, 'LecturerClasses'>;
  route: RouteProp<RootStackParamList, 'LecturerClasses'>;
};

const LecturerClasses: React.FC<LecturerClassesProps> = ({ route, navigation }) => {
  const { subjects } = route.params;

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
        <Text style={styles.headerTitle}>Classes</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your classes</Text>
        
        {subjects.map((subject, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.subjectCard}
            onPress={() => navigation.navigate('ClassDetails', {
              subject_name: subject.subject_name,
              subject_id: subject.subject_id,
              section_id: subject.section_id
            })}
          >
            <View>
              <Text style={styles.subjectName}>{subject.subject_name}</Text>
              <Text style={styles.subjectCode}>{subject.subject_id}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  subjectCard: {
    backgroundColor: '#2567E8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  subjectName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  subjectCode: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  bottomNavContainer: {
    backgroundColor: '#F9FAFB',
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
  },
  navItem: {
    alignItems: 'center',
  },
});

export default LecturerClasses;
