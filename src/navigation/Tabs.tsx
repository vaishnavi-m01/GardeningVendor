import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from "../tabs/Home";
import Profile from "../tabs/Profile";
import Setting from "../tabs/Settings";


const Tab = createBottomTabNavigator();

const Tabs = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#16a34a",
                tabBarInactiveTintColor: "gray",
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;

                    if (route.name === "Home") {
                        iconName = "home-outline";
                    } else if (route.name === "Profile") {
                        iconName = "person-outline";
                    } else if (route.name === "Settings") {
                        iconName = "settings-outline";
                    }
                    else {
                        iconName = "ellipse-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },

            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Settings" component={Setting} />

        </Tab.Navigator>
    );
};

export default Tabs;
