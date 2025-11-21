import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const GetStarted = () => {
    
  return (
    <View className="flex-1 justify-center items-center bg-green-200">
      <TouchableOpacity className="bg-green-400 rounded-lg px-6 py-4" >
        <Text className="text-white text-lg font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStarted;
