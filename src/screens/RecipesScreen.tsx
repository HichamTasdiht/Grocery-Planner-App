import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import { addShoppingItem } from '../conf/database';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strIngredient1?: string;
  strMeasure1?: string;
}

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('Chicken');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes('Chicken'); }, []);

  const handleAddIngredient = async (name: string, qty: string) => {
    try {
      await addShoppingItem(name, qty || 'To taste');
      Alert.alert('Success', `"${name}" added to shopping list!`);
    } catch {
      Alert.alert('Error', 'Could not save item.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.input} placeholder="Search recipes..." value={searchQuery} onChangeText={setSearchQuery} />
        <TouchableOpacity style={styles.searchButton} onPress={() => fetchRecipes(searchQuery)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />}
      <FlatList 
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
            <View style={styles.cardContent}>
              <Text style={styles.mealTitle}>{item.strMeal}</Text>
              {item.strIngredient1 && (
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddIngredient(item.strIngredient1!, item.strMeasure1 || '')}>
                  <Text style={styles.addButtonText}>+ Add {item.strIngredient1}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginRight: 10, height: 40 },
  searchButton: { backgroundColor: '#2e7d32', paddingHorizontal: 15, justifyContent: 'center', borderRadius: 5 },
  searchButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 10, borderRadius: 8, overflow: 'hidden', flexDirection: 'row', elevation: 2 },
  mealImage: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
  mealTitle: { fontSize: 15, fontWeight: 'bold' },
  addButton: { backgroundColor: '#e8f5e9', padding: 6, borderRadius: 4, alignItems: 'center' },
  addButtonText: { color: '#2e7d32', fontSize: 12, fontWeight: 'bold' }
});