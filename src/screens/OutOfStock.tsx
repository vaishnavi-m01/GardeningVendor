import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient";

const OutOfStock = () => {
  const navigation = useNavigation<any>();
  const [range, setRange] = useState("today");

  const stockMetrics = {
    outOfStock: 12,
    daysAverage: 22,
    revenue: 125400,
    impact: "-8.5%",
  };

  const outOfStockItems = [
    { id: "1", name: "Monstera Deliciosa", daysOut: 17, expectedRestockDays: 3, priority: "High" },
    { id: "2", name: "Aloe Vera", daysOut: 20, expectedRestockDays: 2, priority: "High" },
    { id: "3", name: "Snake Plant", daysOut: 24, expectedRestockDays: 5, priority: "Medium" },
    { id: "4", name: "Peace Lily", daysOut: 27, expectedRestockDays: 4, priority: "Medium" },
    { id: "5", name: "Pothos Vine", daysOut: 8, expectedRestockDays: 1, priority: "High" },
    { id: "6", name: "Rubber Plant", daysOut: 15, expectedRestockDays: 3, priority: "Medium" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-gray-50 px-4 pt-5 pb-5">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-gray-900 text-lg font-extrabold">Out of Stock</Text>
            <Text className="text-gray-500 text-xs mt-1">Items requiring restock</Text>
          </View>

          <View className="w-[150px] border border-gray-300 rounded-xl overflow-hidden h-11 justify-center">
            <Picker
              selectedValue={range}
              onValueChange={(v) => setRange(v)}
              dropdownIconColor="#10b981"
              style={{ height: 55, width: "100%", color: "#111827" }}
              mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
            >
              <Picker.Item label="Today" value="today" color="#111827" />
              <Picker.Item label="This Week" value="weekly" color="#111827" />
              <Picker.Item label="This Month" value="monthly" color="#111827" />
              <Picker.Item label="This Year" value="yearly" color="#111827" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-4 pt-5">

        {/* Hero Card (Gradient) */}
        <LinearGradient
          colors={["#34d399","#a7f3d0" ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 24,
            marginBottom: 28,
            shadowColor: "#10b981",
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <View className="mb-3">
            <Text className="text-white/90 text-[11px] font-semibold uppercase tracking-wider">
              Total Out of Stock
            </Text>
            <Text className="text-white text-[28px] font-extrabold mt-1 leading-8">
              {stockMetrics.outOfStock} items
            </Text>
          </View>

          <View className="flex-row justify-between items-center pt-3 border-t border-white/30">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-md bg-white/25 justify-center items-center mr-2">
                <Ionicons name="alert-circle" size={16} color="#fff" />
              </View>
              <Text className="text-white text-[13px] font-semibold">
                Avg {stockMetrics.daysAverage} days
              </Text>
            </View>
            <Text className="text-white/80 text-[12px] font-medium">
              out of stock
            </Text>
          </View>
        </LinearGradient>



        {/* Impact Summary */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-extrabold">Impact Summary</Text>
          </View>

          <View className="flex-row justify-between">
            {/* Lost Revenue */}
            <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-xl p-4 mr-2">
              <View className="flex-row items-start mb-3">
                <View className="w-12 h-12 rounded-lg bg-red-100 justify-center items-center mr-3">
                  <Ionicons name="trending-down" size={22} color="#ef4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-semibold">Lost Revenue</Text>
                  <Text className="text-gray-900 text-[17px] font-extrabold mt-1">
                    ₹{(stockMetrics.revenue / 1000).toFixed(0)}K
                  </Text>
                </View>
              </View>
              <Text className="text-red-500 text-[11px] font-semibold">View impact →</Text>
            </TouchableOpacity>

            {/* Sales Impact */}
            <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-xl p-4 ml-2">
              <View className="flex-row items-start mb-3">
                <View className="w-12 h-12 rounded-lg bg-red-100 justify-center items-center mr-3">
                  <Ionicons name="stats-chart" size={22} color="#dc2626" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-semibold">Sales Impact</Text>
                  <Text className="text-gray-900 text-[17px] font-extrabold mt-1">
                    {stockMetrics.impact}
                  </Text>
                </View>
              </View>
              <Text className="text-red-500 text-[11px] font-semibold">View details →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Out of Stock Items */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-extrabold">Items to Restock</Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 text-xs font-semibold">Priority Sort</Text>
            </TouchableOpacity>
          </View>

          {outOfStockItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1.5">
                    <Text className="text-gray-900 text-[15px] font-bold">{item.name}</Text>
                    <View
                      style={{
                        backgroundColor: getPriorityColor(item.priority),
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginLeft: 8,
                      }}
                    >
                      <Text className="text-white text-[10px] font-bold">{item.priority}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-[12px] mb-1.5">
                    Out for {item.daysOut} days
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={14} color="#10b981" />
                    <Text className="text-emerald-600 text-[12px] font-semibold ml-1">
                      Restock in {item.expectedRestockDays} days
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-8 gap-4">
          <TouchableOpacity className="bg-white border border-gray-200 rounded-lg p-4 flex-row justify-center items-center">
            <Ionicons name="document-outline" size={18} color="#10b981" />
            <Text className="text-emerald-600 text-[14px] font-bold ml-2">
              Generate Restock Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddProductForm")}
            className="bg-red-500 rounded-lg p-4 flex-row justify-center items-center"
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text className="text-white text-[14px] font-bold ml-2">Quick Restock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default OutOfStock;
