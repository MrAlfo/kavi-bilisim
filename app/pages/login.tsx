import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { styles } from './styles/login'

import { auth } from '@/utils/firebase';
import { useAuth } from '@/hooks/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      setIsLoggedIn(true); // Giriş durumu güncellenir
      router.push('/(tabs)'); // Ana sayfaya yönlendirme
    } catch (error: any) {
      console.error('Login error:', error.message);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#38635A', '#6AB3A3']}
        style={styles.gradientBackground}
      />
      <Image
        source={{ uri: 'https://source.unsplash.com/random/800x600/?nature,abstract' }}
        style={styles.backgroundImage}
        contentFit="cover"
        blurRadius={3}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Forgot Password pressed')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

