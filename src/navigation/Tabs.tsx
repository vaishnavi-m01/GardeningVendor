import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Home from "../tabs/Home";
import Orders from "../tabs/Orders";
import Products from "../tabs/Products";
import Message from "../tabs/Message";
import Profile from "../tabs/Profile";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: "Home", component: Home, icon: "🏠" },
    { name: "Orders", component: Orders, icon: "📋" },
    { name: "Products", component: Products, icon: "🌱" },
    { name: "Messages", component: Message, icon: "💬" },
    { name: "Profile", component: Profile, icon: "👤" },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home" 
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          backgroundColor: "#ffffff",
          borderTopColor: "#e0e0e0",
          borderTopWidth: 1,
          elevation: 8,
          paddingTop: 10,
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={index}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  height: 60,
                }}
              >
                {focused && (
                  <View
                    style={{
                      position: "absolute",
                      width: 60,
                      height: 60,
                      backgroundColor: "#d8f3dc",
                      borderRadius: 30,
                      shadowColor: "#40916c",
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 8,
                      zIndex: -1,
                      transform: [{ scale: 1.05 }],
                    }}
                  />
                )}

                <Text
                  style={{
                    fontSize: 22,
                    color: focused ? "#1b4332" : "#9ca3af",
                    textAlign: "center",
                  }}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: focused ? "700" : "600",
                    color: focused ? "#1b4332" : "#9ca3af",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  {tab.name}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default Tabs;
