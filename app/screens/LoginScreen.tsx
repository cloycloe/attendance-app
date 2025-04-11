import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { username, password });
      
      const response = await axios.post(
        'http://192.168.254.163:5000/api/auth/login', 
        {
          username,
          password
        },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login response:', response.data);

      if (response.data.token) {
        try {
          // Store the token and user data
          await AsyncStorage.setItem('userToken', response.data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

          // Navigate based on role with user data
          if (response.data.user.role === 'Administrator') {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'AdminDashBoard',  // Updated name
                params: { user: response.data.user }
              }],
            });
          } else if (response.data.user.role === 'Instructor') {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'LecturerDashBoard',
                params: { user: response.data.user }
              }],
            });
          } else if (response.data.user.role === 'Student') {
            navigation.reset({
              index: 0,
              routes: [{ 
                name: 'StudentDashBoard',
                params: { user: response.data.user }
              }],
            });
          }
        } catch (storageError) {
          console.error('Storage error:', storageError);
          Alert.alert('Error', 'Failed to save login data');
        }
      }
    } catch (error) {
      console.error('Login error details:', error);
      
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Connection Error', 'Server is not responding. Please check your connection.');
      } else if (error.response) {
        Alert.alert('Login Failed', error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        Alert.alert('Connection Error', 'Cannot reach the server. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logoreal1.png')} 
            style={styles.logo}
          />
          <Text style={styles.loginTitle}>Login</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 15,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
  }
});

export default LoginScreen; 