import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
    const navigation = useNavigation<any>();
    console.log("Splash Screen")
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("SignIn");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-white">

            <Image
                source={require("../assets/images/Splash.png")}
                className="w-[163px] h-[66px]"
                resizeMode="contain"

            />

        </View>
    );
};

export default Splash;
