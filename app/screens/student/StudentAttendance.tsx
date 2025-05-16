import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'qrcode';
import { db, signInAnonymouslyToFirebase } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const StudentAttendance = ({ navigation, route }) => {
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    // Sign in anonymously when component mounts
    signInAnonymouslyToFirebase();
    generateQR();
    // Regenerate QR code every 30 seconds
    const interval = setInterval(generateQR, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateQR = async () => {
    try {
      const qrData = {
        studentId: route.params?.user?.user_id,
        name: route.params?.user?.name,
        timestamp: new Date().toISOString(),
        nonce: Math.random().toString(36).substring(7)
      };

      // Store QR data in Firestore
      await addDoc(collection(db, 'qr_codes'), {
        ...qrData,
        createdAt: new Date()
      });

      const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));
      setQrImage(qrCodeImage);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.qrContainer}>
        {qrImage ? (
          <Image
            source={{ uri: qrImage }}
            style={styles.qrCode}
          />
        ) : (
          <Text>Generating QR code...</Text>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="qr-code-outline" size={24} color="white" />
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
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 5,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4EABE9',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  qrCode: {
    width: 250,
    height: 250,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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

export default StudentAttendance;
