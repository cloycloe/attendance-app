import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
  Button,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { firebaseService } from '../../services/firebase';

const LecturerScanner = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedStudents, setScannedStudents] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const qrData = JSON.parse(data);
      
      // Verify timestamp (30 seconds validity)
      const scannedTime = new Date(qrData.timestamp);
      const currentTime = new Date();
      if ((currentTime.getTime() - scannedTime.getTime()) > 30000) {
        Alert.alert('Error', 'QR Code has expired');
        return;
      }

      // Record attendance
      await firebaseService.recordAttendance({
        studentId: qrData.studentId,
        subjectId: qrData.subjectId,
        qrData: data,
        scannedBy: route.params?.user?.id
      });

      Alert.alert('Success', 'Attendance recorded successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setScanned(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Attendance</Text>
      </View>

      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Scan Student QR Code</Text>
        </View>
      </Camera>

      <View style={styles.scannedList}>
        <Text style={styles.listTitle}>Scanned Students ({scannedStudents.length})</Text>
        <FlatList
          data={scannedStudents}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.scanTime}>{item.scanTime}</Text>
            </View>
          )}
        />
      </View>

      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
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
  camera: {
    flex: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  scannedList: {
    flex: 0.5,
    padding: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentName: {
    fontSize: 16,
  },
  scanTime: {
    color: '#666',
  },
});

export default LecturerScanner;
