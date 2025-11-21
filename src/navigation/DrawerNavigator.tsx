import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "react-native";
import Tabs from "./Tabs";
import CustomDrawerContent from "../components/Drawer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { 
          backgroundColor: '#FFFFFF', 
          width: '75%',
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={Tabs} 
        options={{ 
          headerShown: false,
          drawerLabel: 'Home',
        }} 
      />
    </Drawer.Navigator>
  );
}
