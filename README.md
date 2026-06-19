# Technical Report: Smart Grocery & Recipe Planner

**Institution:** SUPMTI
**Program:** 4th Year ISII  
**Author:** Hisham  
**Project Type:** React Native Mobile Application Evaluation  

---

## 1. Introduction
The **Smart Grocery & Recipe Planner** is a cross-platform mobile application designed to seamlessly bridge online culinary discovery with offline task management. The application allows users to query a global food database to discover recipes and immediately extract required ingredients into a persistent, locally managed SQLite database. 

This project was developed to demonstrate core mobile development competencies, specifically focusing on asynchronous API consumption, local relational database management (CRUD), and advanced view routing.

---

## 2. Technology Stack
* **Framework:** React Native via Expo (SDK 54/56 compatibility bypass)
* **Navigation:** `@react-navigation/bottom-tabs` (Standard native routing)
* **Local Storage:** `expo-sqlite` (Offline data persistence)
* **Network Requests:** Native `fetch` API via `async/await`
* **UI Components:** React Native Core Components (`FlatList`, `TouchableOpacity`, `TextInput`)

---

## 3. Application Interfaces & Core Features

### 3.1. The Recipes Explorer (API Integration)
This interface acts as the online consumer of the application. It connects to **TheMealDB** REST API (`https://www.themealdb.com/api/json/v1/1/search.php?s=`) to fetch live data.

* **Key Functionality:** Implements asynchronous `fetch` requests wrapped in `try/catch/finally` blocks to handle network states (loading indicators) and error boundaries gracefully.
* **Data Binding:** Results are rendered via an optimized `FlatList` component, passing the API's unique `idMeal` as the render key.

> **[Insert Screenshot: Recipes Search & Feed]** > ![Recipes Interface](./screenshots/recipes_screen.png)

### 3.2. The Offline Shopping List (Local SQLite CRUD)
This interface acts as the local data manager, allowing the user to track their inventory securely on their physical device.

* **Key Functionality:** * **Create:** Users can manually input items or pipe them directly from the Recipes tab.
  * **Read:** The `useFocusEffect` hook triggers an automatic `SELECT` query every time the tab is opened to ensure data freshness.
  * **Update:** Tapping an item fires an `UPDATE` query, toggling the integer state of `is_bought` and triggering a UI strike-through.
  * **Delete:** A dedicated action drops the row from the local data table.

> **[Insert Screenshot: Shopping List & CRUD Form]** > ![Shopping List Interface](./screenshots/shopping_list_screen.png)

---

## 4. Software Architecture & Directory Map

To ensure clean separation of concerns and bypass forced file-based routing protocols from newer Expo SDK templates, the application uses a custom entry point and a highly structured `src` directory.

```text
/
├── package.json               <-- Modified to target "src/index"
├── index.js                   <-- Absolute native bridge (registerRootComponent)
└── src/                       
    ├── index.tsx              <-- App wrapper and SafeArea provider
    ├── main/
    │   └── app.tsx            <-- Tab Navigator & Database Initialization
    ├── conf/
    │   └── database.tsx       <-- Database helper (Raw SQL executions)
    └── screens/
        ├── RecipesScreen.tsx  <-- View: API Consumption
        └── ShoppingScreen.tsx <-- View: Local SQLite UI
/
```
---
		
## 5. Database Schema

The local storage relies on a SQLite relational structure that is initialized automatically upon application launch if it does not already exist. 

**Table:** `shopping_list`

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique record identifier. |
| `name` | TEXT | NOT NULL | Name of the ingredient or custom item. |
| `quantity` | TEXT | NOT NULL | Specified measure or amount needed. |
| `is_bought` | INTEGER | DEFAULT 0 | Status flag (`0` = Needs purchase, `1` = Bought). |

---

## 6. Technical Challenges & Solutions

During the development and deployment phases, several architectural challenges were identified and successfully resolved:

* **Challenge: Routing Engine Conflicts (Expo Router vs. React Navigation)**
    Newer versions of the Expo CLI (SDK 56) enforce file-based routing (`expo-router`) by default. This automatically intercepted the standard `@react-navigation` library required for the project, causing fatal rendering collisions and throwing default fallback screens.
    * **Solution:** The architecture was restructured by manually defining the `main` entry in `package.json`. A custom `index.js` root file was created to explicitly invoke `registerRootComponent()`, bypassing the Expo Router engine entirely and forcing the bundler to compile the custom tab navigation layout.

* **Challenge: SDK Version Mismatch for Physical Testing**
    The physical testing device running the Expo Go application from the Google Play Store (locked to SDK 54) was initially incompatible with the default SDK 56 project build.
    * **Solution:** To ensure stability and avoid forcing mismatched versions, a clean project environment was re-initialized using a specific legacy template matching the hardware (`npx create-expo-app --template default@sdk-54`). This ensured perfect harmony between the local development server, the installed dependencies, and the testing device.

---

## 7. Conclusion

The **Smart Grocery & Recipe Planner** successfully fulfills all technical and functional requirements for the module evaluation. It demonstrates a robust handling of asynchronous online data streams (REST API) combined with reliable, offline persistent storage mechanisms (SQLite), all wrapped in a responsive, cross-platform user interface. The project highlights a strong practical understanding of modern React Native architecture, local state management, and mobile database integration.