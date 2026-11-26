
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        RecipeBook
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Discover, save & cook great meals
      </Text>

      <ActivityIndicator size="large" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF8F3',
  },
  title: {
    fontWeight: 'bold',
    color: '#D84315',
  },
  subtitle: {
    marginTop: 8,
    color: '#5D4037',
  },
  loader: {
    marginTop: 28,
  },
});
