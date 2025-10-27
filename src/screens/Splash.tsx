import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
    const navigation = useNavigation<any>();
    console.log("Splash Screen")
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("MainTabs");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-blue-500">
            <Text className="text-white text-xl font-semibold">
                Hello TailwindCSS 
            </Text>
        </View>
    );
};

export default Splash;
