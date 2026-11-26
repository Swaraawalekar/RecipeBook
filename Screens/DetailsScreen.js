import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text, Card, Button, Snackbar } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function DetailsScreen({ route, navigation }) {
  const { meal } = route.params;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
    }
  }

  const handleSaveFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      setMessage('Please log in first to save favorites.');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        mealId: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory || 'Meal',
        thumb: meal.strMealThumb || '',
        instructions: meal.strInstructions || '',
        ingredients,
        createdAt: Date.now(),
      });
      setMessage('Saved to Favorites!');
    } catch (error) {
      setMessage('Could not save favorite. Check Firestore rules.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          {meal.strMealThumb ? <Card.Cover source={{ uri: meal.strMealThumb }} /> : null}
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>{meal.strMeal}</Text>
            <Text variant="bodyMedium" style={styles.meta}>
              {meal.strCategory || 'Meal'} • {meal.strArea || 'World'}
            </Text>

            <Button
              mode="contained"
              onPress={handleSaveFavorite}
              loading={saving}
              disabled={saving}
              style={styles.saveButton}
            >
              Save to Favorites
            </Button>

            {ingredients.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.sectionTitle}>Ingredients</Text>
                {ingredients.map((item, index) => (
                  <Text key={index} style={styles.listItem}>• {item}</Text>
                ))}
              </>
            )}

            <Text variant="titleMedium" style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>{meal.strInstructions}</Text>
          </Card.Content>
        </Card>

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back
        </Button>
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
  card: {
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#D84315',
  },
  meta: {
    marginTop: 4,
    color: '#5D4037',
  },
  saveButton: {
    marginTop: 14,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  listItem: {
    marginBottom: 4,
    color: '#4E342E',
  },
  instructions: {
    lineHeight: 22,
    color: '#4E342E',
  },
  backButton: {
    marginTop: 12,
  },
});