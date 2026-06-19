import * as SQLite from 'expo-sqlite';

const getDB = async () => {
  return await SQLite.openDatabaseAsync('grocery_planner.db');
};

export const initDatabase = async () => {
  try {
    const db = await getDB();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shopping_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity TEXT NOT NULL,
        is_bought INTEGER DEFAULT 0
      );
    `);
    console.log("Database initialized.");
  } catch (error) {
    console.error("Error initializing database: ", error);
  }
};

export const addShoppingItem = async (name: string, quantity: string) => {
  try {
    const db = await getDB();
    const result = await db.runAsync(
      'INSERT INTO shopping_list (name, quantity, is_bought) VALUES (?, ?, 0);',
      [name, quantity]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error inserting item: ", error);
  }
};

export const getShoppingItems = async () => {
  try {
    const db = await getDB();
    return await db.getAllAsync('SELECT * FROM shopping_list ORDER BY id DESC;');
  } catch (error) {
    console.error("Error fetching items: ", error);
    return [];
  }
};

export const updateItemStatus = async (id: number, isBought: boolean) => {
  try {
    const db = await getDB();
    await db.runAsync('UPDATE shopping_list SET is_bought = ? WHERE id = ?;', [isBought ? 1 : 0, id]);
  } catch (error) {
    console.error("Error updating item: ", error);
  }
};

export const deleteShoppingItem = async (id: number) => {
  try {
    const db = await getDB();
    await db.runAsync('DELETE FROM shopping_list WHERE id = ?;', [id]);
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};