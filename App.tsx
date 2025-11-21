import "react-native-reanimated";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";

import StackScreen from "./src/navigation/StackScreen";
import "./global.css";
import { VendorProvider } from "./src/context/VendorContext";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <VendorProvider>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <StackScreen />
          <Toast />
        </VendorProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
