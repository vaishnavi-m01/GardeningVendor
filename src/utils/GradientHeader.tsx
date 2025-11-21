import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface GradientHeaderProps {
  title: string;
  onBack?: () => void;
  rightText?: string;
  onRightPress?: () => void;
  rightIcon?: string;
}

const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  onBack,
  rightText,
  onRightPress,
  rightIcon,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#2d6a4f", "#40916c"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 16,
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Center Title */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "600",
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Text>
        </View>

        {/* Right Section (icon or text) */}
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <MaterialIcons name={rightIcon} size={22} color="#fff" />
          </TouchableOpacity>
        ) : rightText ? (
          <TouchableOpacity
            onPress={onRightPress}
            activeOpacity={0.7}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
              {rightText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </LinearGradient>
  );
};

export default GradientHeader;
