import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getShoppingItems, addShoppingItem, updateItemStatus, deleteShoppingItem } from '../conf/database';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: string;
  is_bought: number;
}

export default function ShoppingScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const loadItems = async () => {
    const data = await getShoppingItems();
    setItems(data as ShoppingItem[]);
  };

  useFocusEffect(useCallback(() => { loadItems(); }, []));

  const handleAddItem = async () => {
    if (!name.trim() || !qty.trim()) return;
    await addShoppingItem(name.trim(), qty.trim());
    setName(''); setQty(''); loadItems();
  };

  const handleToggle = async (id: number, current: number) => {
    await updateItemStatus(id, current !== 1);
    loadItems();
  };

  const handleDelete = async (id: number) => {
    await deleteShoppingItem(id);
    loadItems();
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Item" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Qty" value={qty} onChangeText={setQty} />
        <TouchableOpacity style={styles.btn} onPress={handleAddItem}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleToggle(item.id, item.is_bought)}>
              <Text style={[styles.itemText, item.is_bought === 1 && styles.done]}>{item.name} ({item.quantity})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item.id)}><Text style={styles.btnText}>X</Text></TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  form: { flexDirection: 'row', gap: 5, marginBottom: 15 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, flex: 1 },
  btn: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 5, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  row: { backgroundColor: '#fff', padding: 12, borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  itemText: { fontSize: 16, fontWeight: '500' },
  done: { textDecorationLine: 'line-through', color: '#aaa' },
  delBtn: { backgroundColor: '#d32f2f', padding: 6, borderRadius: 4 }
});