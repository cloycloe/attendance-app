import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../config/api';
import axios from 'axios';

const QRCodeScreen = ({ navigation, route }) => {
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    // Generate QR data
    const generateQRData = async () => {
      try {
        const response = await axios.post(`${API_URL}/attendance/generate-qr`, {
          studentId: route.params?.user?._id,
          timestamp: new Date().toISOString()
        });

        const data = await response.data;
        setQrData(data.qrCode);
      } catch (error) {
        console.error('QR generation error:', error);
      }
    };

    generateQRData();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="close" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.qrContainer}>
        {qrData && (
          <QRCode
            value={qrData}
            size={200}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55ACEE',
    margin: 20,
    borderRadius: 10,
  },
});

export default QRCodeScreen;
