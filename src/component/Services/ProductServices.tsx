import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

type ServiceCardProps = {
  name: string;
  image: string | number;
};

const ProductServices = ({ name, image }: ServiceCardProps) => {
  // Shared animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // Run animation when component mounts
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });
    translateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) });
  }, []);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="flex-1 items-center justify-center py-2 px-1 bg-gray-100"
    >
      <View className="bg-white rounded-lg shadow-md overflow-hidden w-48 h-[150px]">
        {/* Image Section */}
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          className="w-full h-[100px]"
          resizeMode="cover"
        />

        {/* Label Section */}
        <View className="bg-[#003602] px-2  flex-1 justify-center items-center">
          <Text
            className="text-white text-center font-semibold text-base leading-5"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProductServices;
