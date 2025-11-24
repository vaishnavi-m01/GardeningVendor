import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

interface HeaderStat {
  label: string;
  value: string;
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onFilterPress?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
  onSearchSubmit?: () => void;
  showStats?: boolean;
  statsData?: HeaderStat[];
  gradient?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  leftIcon,
  rightIcon,
  onFilterPress,
  onLeftPress,
  onRightPress,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onSearchSubmit,
  showStats = false,
  statsData = [],
  gradient = true,
}) => {
  const navigation = useNavigation<any>();

  const Wrapper = gradient ? LinearGradient : View;
  const wrapperProps = gradient
    ? {
      colors: ["#2d6a4f", "#40916c"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    }
    : {};

  const isEmoji = (str?: string) =>
    !!str && str.match(/[\p{Emoji}\u200d]/u) && str.length <= 3;

  return (
    <Wrapper {...(wrapperProps as any)} className="px-5 pt-12 pb-4 shadow-md">
      <View className="flex-row justify-between items-center mb-3">
        {(showBack || leftIcon) ? (
          <TouchableOpacity
            onPress={onLeftPress || (() => navigation.goBack())}
            className="w-10 h-10 rounded-full justify-center items-center bg-white/15"
          >
            {isEmoji(leftIcon) ? (
              <Text className="text-white text-xl">{leftIcon}</Text>
            ) : (
              <Ionicons name={leftIcon || "arrow-back"} size={26} color="#fff" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-12" />
        )}

        {/* Title */}
        <View className="flex-1 items-center">
          <Text className="text-white text-[18px] font-semibold text-center">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-white/90 text-[13px] text-center">
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Button */}
        {/* Right Button */}
        {rightIcon ? (
          <View className="flex-row space-x-3">
            {/* Add Button */}
            <TouchableOpacity
              onPress={onRightPress}
              className="w-10 h-10 rounded-full justify-center items-center bg-white/15"
            >
              {isEmoji(rightIcon) ? (
                <Text className="text-white text-xl">{rightIcon}</Text>
              ) : (
                <Ionicons name={rightIcon} size={26} color="#fff" />
              )}
            </TouchableOpacity>

            {/* 🔍 Filter Button */}

          </View>
        ) : (
          <View className="w-12" />
        )}

      </View>

      {/* Search Bar */}
      {showSearch && (
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 mb-3">
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChangeText={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            onSubmitEditing={onSearchSubmit}
            placeholderTextColor="#999"
            returnKeyType="search"
            className="flex-1 ml-2 text-gray-700 text-sm"
          />
        </View>
      )}

      {/* Stats Row */}
      {showStats && (
        <View className="flex-row gap-2">
          {statsData.map((item, index) => (
            <View key={index} className="flex-1 bg-white rounded-lg py-2">
              <Text className="text-[#2d6a4f] text-center text-base font-bold">
                {item.value}
              </Text>
              <Text className="text-gray-600 text-center text-[10px]">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Wrapper>
  );
};

export default AppHeader;
