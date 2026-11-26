import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Searchbar, Card, Button, ActivityIndicator } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMeals = async (query = '') => {
    setLoading(true);
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals('');
  }, []);

  const handleSearch = () => {
    fetchMeals(searchQuery.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <Text variant="titleLarge" style={styles.title}>Recipes</Text>
        <View style={styles.navButtons}>
          <Button mode="outlined" compact onPress={() => navigation.navigate('Favorites')}>
            Favorites
          </Button>
          <Button mode="contained-tonal" compact onPress={() => navigation.navigate('Profile')}>
            Profile
          </Button>
        </View>
      </View>

      <Searchbar
        placeholder="Search meals (e.g. Chicken, Pasta)..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        onIconPress={handleSearch}
        style={styles.searchbar}
      />

      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loader} />
      ) : meals.length === 0 ? (
        <Text style={styles.emptyText}>No recipes found. Try another search!</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('Details', { meal: item })}
            >
              <Card.Cover source={{ uri: item.strMealThumb }} />
              <Card.Title
                title={item.strMeal}
                subtitle={`${item.strCategory || 'Meal'} • ${item.strArea || 'World'}`}
              />
              <Card.Actions>
                <Button onPress={() => navigation.navigate('Details', { meal: item })}>
                  View Recipe
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#D84315',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  searchbar: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
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