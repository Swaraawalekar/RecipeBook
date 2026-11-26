import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const user = auth.currentUser;
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setFavorites(items);
    } catch (error) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      await deleteDoc(doc(db, 'favorites', docId));
      setFavorites((prev) => prev.filter((item) => item.id !== docId));
    } catch (error) {
      // ignore if delete fails
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>My Favorites</Text>
        <Button mode="outlined" compact onPress={() => navigation.navigate('Home')}>
          Home
        </Button>
      </View>

      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : favorites.length === 0 ? (
        <Text style={styles.emptyText}>No saved recipes yet. Tap "Save to Favorites" on any recipe!</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              {item.thumb ? <Card.Cover source={{ uri: item.thumb }} /> : null}
              <Card.Title title={item.title} subtitle={item.category || 'Recipe'} />
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate('Details', {
                      meal: {
                        idMeal: item.mealId || item.id,
                        strMeal: item.title,
                        strCategory: item.category,
                        strMealThumb: item.thumb,
                        strInstructions: item.instructions,
                      },
                    })
                  }
                >
                  Open
                </Button>
                <Button textColor="#C62828" onPress={() => handleDelete(item.id)}>
                  Remove
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
    paddingHorizontal: 14,
    backgroundColor: '#FFF8F3',
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
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#5D4037',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
});