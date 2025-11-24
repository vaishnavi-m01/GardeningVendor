import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import { useVendor } from "../context/VendorContext";
import LinearGradient from "react-native-linear-gradient";

const Revenue = () => {
  const navigation = useNavigation<any>();
  const { vendorData } = useVendor();
  const [range, setRange] = useState("today");
  const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");


  const metrics = {
    totalRevenue: 85230,
    profit: 34560,
    expenses: 50670,
    growth: "+22%",
  };

  const pieData = [
    { value: 34560, color: "#10b981", text: "Profit" },
    { value: 50670, color: "#ef4444", text: "Expenses" },
  ];

  const revenueBySource = [
    { id: "1", source: "Plant Sales", value: 45300, trend: "+14%" },
    { id: "2", source: "Gardening Services", value: 25630, trend: "+8%" },
    { id: "3", source: "Consultations", value: 14300, trend: "+5%" },
  ];

  const gradientColors =
    selectedType === "Product"
      ? ["#4ade80", "#065f46"]
      : ["#fbbf24", "#d97706"];

  const iconBackground =
    selectedType === "Product"
      ? "rgba(255, 255, 255, 0.25)"
      : "rgba(255, 255, 255, 0.20)";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      {/* Header Section */}

      <View style={{ backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e6edf0" }}>
        <View style={{ flexDirection: "row" }}>
          {/* PRODUCT BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setSelectedType("Product");
            }}
            style={{
              flex: 1,
              marginRight: 8,
              borderRadius: 12,
              paddingVertical: 12,
              borderWidth: 2,
              borderColor: selectedType === "Product" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Product" ? "#ecfdf3" : "#fff",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: selectedType === "Product" ? "#15803d" : "#334155" }}>🌿 Product</Text>
          </TouchableOpacity>

          {/* SERVICE BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setSelectedType("Service");
              // setActiveTab("All");
            }}
            style={{
              flex: 1,
              marginLeft: 8,
              borderRadius: 12,
              paddingVertical: 12,
              borderWidth: 2,
              borderColor: selectedType === "Service" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Service" ? "#ecfdf3" : "#fff",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: selectedType === "Service" ? "#15803d" : "#334155" }}>🛠️ Service</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-gray-50 px-4 pt-5 pb-5">
        <View className="flex-row justify-between items-center mb-4">
          <View className="mb-4">
            <Text className="text-gray-900 text-lg font-extrabold">Revenue</Text>
            <Text className="text-gray-500 text-xs mt-1">
              Track earnings and manage orders.
            </Text>
          </View>


          <View className="w-[155px]">
            <View className="bg-white rounded-xl px-2 h-11 justify-center border border-gray-200 overflow-hidden">
              <Picker
                selectedValue={range}
                onValueChange={(v) => setRange(v)}
                dropdownIconColor="#16a34a"
                style={{ height: 55, width: "100%", color: "#111827" }}
                mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
              >
                <Picker.Item label="Today" value="today" />
                <Picker.Item label="This Week" value="weekly" />
                <Picker.Item label="This Month" value="monthly" />
                <Picker.Item label="This Year" value="yearly" />
              </Picker>
            </View>
          </View>
        </View>
      </View>


      {/* Main Content */}
      <View style={{ paddingHorizontal: 10, paddingTop: 24 }}>
        {/* Total Revenue Card - Featured */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 24,
            marginBottom: 28,
            overflow: "hidden",
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600", letterSpacing: 0.5 }}>
              TOTAL REVENUE
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 40, fontWeight: "800", marginTop: 8 }}>
              ₹{(metrics.totalRevenue / 1000).toFixed(1)}K
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: iconBackground,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name="trending-up" size={16} color="#ffffff" />
              </View>
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                {metrics.growth} vs last period
              </Text>
            </View>
          </View>
        </LinearGradient>


        {/* Financial Breakdown Grid */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "#111827", fontSize: 16, fontWeight: "700", marginBottom: 16 }}>Financial Breakdown</Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            {/* Profit Card */}
            <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#e5e7eb" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#ecfdf5", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Ionicons name="trending-up" size={20} color="#10b981" />
                </View>
              </View>
              <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "600" }}>Profit</Text>
              <Text style={{ color: "#111827", fontSize: 24, fontWeight: "700", marginTop: 8 }}>₹{(metrics.profit / 1000).toFixed(1)}K</Text>
              <Text style={{ color: "#10b981", fontSize: 11, marginTop: 8, fontWeight: "600" }}>Net margin</Text>
            </View>

            {/* Expenses Card */}
            <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#e5e7eb" }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#fee2e2", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Ionicons name="trending-down" size={20} color="#ef4444" />
                </View>
              </View>
              <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "600" }}>Expenses</Text>
              <Text style={{ color: "#111827", fontSize: 24, fontWeight: "700", marginTop: 8 }}>₹{(metrics.expenses / 1000).toFixed(1)}K</Text>
              <Text style={{ color: "#ef4444", fontSize: 11, marginTop: 8, fontWeight: "600" }}>Cost basis</Text>
            </View>
          </View>
        </View>

        {/* Profit vs Expenses Chart */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: "#111827", fontSize: 16, fontWeight: "700", marginBottom: 20 }}>Profit vs Expenses</Text>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center" }}>
            <PieChart
              data={pieData}
              donut
              radius={80}
              innerRadius={60}
              showTextBackground={false}
              textColor="#111827"
              textSize={12}
            />
            <View style={{ marginTop: 20, width: "100%", gap: 12 }}>
              {pieData.map((item, idx) => (
                <View key={idx} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.color, marginRight: 10 }} />
                    <Text style={{ color: "#6b7280", fontSize: 13 }}>{item.text}</Text>
                  </View>
                  <Text style={{ color: "#111827", fontSize: 13, fontWeight: "600" }}>₹{(item.value / 1000).toFixed(1)}K</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Revenue by Source */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: "#111827", fontSize: 16, fontWeight: "700", marginBottom: 16 }}>Revenue by Source</Text>
          {revenueBySource.map((source) => (
            <View key={source.id} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#111827", fontSize: 14, fontWeight: "600" }}>{source.source}</Text>
                <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>₹{(source.value / 1000).toFixed(1)}K</Text>
              </View>
              <View style={{ backgroundColor: "#d1fae5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                <Text style={{ color: "#059669", fontSize: 12, fontWeight: "600" }}>{source.trend}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Revenue;
