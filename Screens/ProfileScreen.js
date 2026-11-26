import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [recipeTitle, setRecipeTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddRecipe = async () => {
    if (!user) {
      setMessage('No logged-in user found.');
      return;
    }
    if (!recipeTitle.trim() || !instructions.trim()) {
      setMessage('Please enter a recipe title and instructions.');
      return;
    }

    setSaving(true);
    try {
      const ingredients = ingredientsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        mealId: `custom_${Date.now()}`,
        title: recipeTitle.trim(),
        category: category.trim() || 'Custom Recipe',
        thumb: '',
        instructions: instructions.trim(),
        ingredients,
        createdAt: Date.now(),
      });

      setRecipeTitle('');
      setCategory('');
      setIngredientsText('');
      setInstructions('');
      setMessage('Custom recipe added to Favorites!');
    } catch (error) {
      setMessage('Could not save recipe.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      setMessage('Could not log out.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>Profile & Add Recipe</Text>
          <Button mode="outlined" compact onPress={() => navigation.navigate('Home')}>
            Home
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Account</Text>
            <Text style={styles.emailText}>Email: {user?.email || 'Guest'}</Text>
            <Button mode="outlined" textColor="#C62828" onPress={handleLogout} style={styles.logoutBtn}>
              Log Out
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Add Your Own Recipe</Text>

            <TextInput
              label="Recipe Title"
              value={recipeTitle}
              onChangeText={setRecipeTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Category (e.g. Breakfast, Snack)"
              value={category}
              onChangeText={setCategory}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Ingredients (comma separated)"
              value={ingredientsText}
              onChangeText={setIngredientsText}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Cooking Instructions"
              value={instructions}
              onChangeText={setInstructions}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleAddRecipe}
              loading={saving}
              disabled={saving}
              style={styles.saveBtn}
            >
              Save Recipe
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={2500}>
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  scrollContent: {
    padding: 14,
    paddingTop: 44,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontWeight: 'bold',
    color: '#D84315',
  },
  card: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3E2723',
  },
  emailText: {
    color: '#5D4037',
    marginBottom: 10,
  },
  logoutBtn: {
    alignSelf: 'flex-start',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  saveBtn: {
    marginTop: 6,
  },
});