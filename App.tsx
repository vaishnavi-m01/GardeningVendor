import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackScreen from './src/navigation/StackScreen';
import "./global.css";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StackScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
