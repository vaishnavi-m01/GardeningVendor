import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface ProductCardProps {
  productName: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  imageUrl,
  price,
  stockQuantity,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="bg-white w-[48%] mb-4 rounded-2xl overflow-hidden shadow"
      onPress={onPress}
    >
      {/* Image */}
      <View className="relative w-full h-[120px]">
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          className="w-full h-full"
        />
        <View
          className={`absolute top-2 right-2 px-2 py-[2px] rounded-full ${
            stockQuantity > 10
              ? "bg-green-100"
              : stockQuantity > 0
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          <Text
            className={`text-[10px] font-semibold ${
              stockQuantity > 10
                ? "text-green-700"
                : stockQuantity > 0
                ? "text-yellow-700"
                : "text-red-700"
            }`}
          >
            {stockQuantity > 10
              ? "In Stock"
              : stockQuantity > 0
              ? "Low Stock"
              : "Out of Stock"}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View className="p-3">
        <Text
          className="text-[13px] font-semibold text-gray-800"
          numberOfLines={2}
        >
          {productName}
        </Text>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-[15px] font-bold text-green-700">
            ₹{price}
          </Text>
          <Text className="text-[11px] text-gray-600">
            Stock: {stockQuantity}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
