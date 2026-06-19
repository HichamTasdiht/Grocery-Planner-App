import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { initDatabase } from '../conf/database';
import RecipesScreen from '../screens/RecipesScreen';
import ShoppingScreen from '../screens/ShoppingScreen';

import { ShoppingBag, Utensils } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDatabase();
      } catch (err) {
        console.error("Failed to boot SQLite: ", err);
      }
    };
    setupDB();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        // 2. Change screenOptions to a function to read the route name
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#2e7d32',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: { paddingBottom: 5, height: 60 },
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          
          // 3. Add the tabBarIcon function here
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Recipes') {
              return <Utensils color={color} size={size} />;
            } else if (route.name === 'ShoppingList') {
              return <ShoppingBag color={color} size={size} />;
            }
          },
        })}
      >
        <Tab.Screen 
          name="Recipes" 
          component={RecipesScreen} 
          options={{ title: 'Find Recipes' }} 
        />
        <Tab.Screen 
          name="ShoppingList" 
          component={ShoppingScreen} 
          options={{ title: 'My Shopping List' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}