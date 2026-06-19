import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainApp from './main/app';

function EntryPoint() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#2e7d32" />
      <MainApp />
    </SafeAreaProvider>
  );
}

// CRUCIAL: This must be a default export so index.js can read it correctly
export default EntryPoint;