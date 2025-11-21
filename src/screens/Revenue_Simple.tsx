import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useVendor } from "../context/VendorContext";

const Revenue = () => {
  const navigation = useNavigation<any>();
  const { vendorData } = useVendor();
  const [range, setRange] = useState("today");

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
    { id: "1", source: "Plant Sales", value: 45300, icon: "🌿", trend: "+14%" },
    { id: "2", source: "Gardening Services", value: 25630, icon: "🔧", trend: "+8%" },
    { id: "3", source: "Consultations", value: 14300, icon: "💬", trend: "+5%" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fb" }} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Hero Card - Enhanced & Consistent */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 28, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 20, elevation: 5 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" }}>Total Revenue</Text>
            <Text style={{ color: "#0f172a", fontSize: 52, fontWeight: "900", marginTop: 14, lineHeight: 56 }}>₹{(metrics.totalRevenue / 1000).toFixed(1)}K</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, gap: 10 }}>
              <View style={{ backgroundColor: "#d1fae5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ color: "#059669", fontSize: 14, fontWeight: "800" }}>{metrics.growth}</Text>
              </View>
              <Text style={{ color: "#94a3b8", fontSize: 14, fontWeight: "500" }}>vs last period</Text>
            </View>
          </View>
          <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#fef3c7", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fcd34d" }}>
            <Ionicons name="cash" size={36} color="#f59e0b" />
          </View>
        </View>

        {/* Range Picker */}
        <View style={{ backgroundColor: "#f8f9fb", borderRadius: 16, paddingHorizontal: 16, height: 52, overflow: "hidden", borderWidth: 1.5, borderColor: "#e2e8f0" }}>
          <Picker
            selectedValue={range}
            onValueChange={(v) => setRange(v)}
            dropdownIconColor="#f59e0b"
            style={{ height: 52, width: "100%", color: "#0f172a" }}
            mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
          >
            <Picker.Item label="Today" value="today" color="#0f172a" />
            <Picker.Item label="Weekly" value="weekly" color="#0f172a" />
            <Picker.Item label="Monthly" value="monthly" color="#0f172a" />
            <Picker.Item label="Yearly" value="yearly" color="#0f172a" />
          </Picker>
        </View>
      </View>

      {/* Profit & Expenses Cards */}
      <View style={{ paddingHorizontal: 16, marginTop: 36 }}>
        <Text style={{ color: "#0f172a", fontSize: 19, fontWeight: "800", letterSpacing: 0.3, marginBottom: 22 }}>Financial Breakdown</Text>
        
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          {/* Profit Card */}
          <View
            style={{
              width: "48%",
              backgroundColor: "#fff",
              borderRadius: 22,
              padding: 22,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 6 },
              shadowRadius: 16,
              elevation: 4,
              borderLeftWidth: 6,
              borderLeftColor: "#10b981",
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Ionicons name="trending-up" size={26} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>Profit</Text>
                <Text style={{ fontSize: 28, fontWeight: "900", color: "#10b981", marginTop: 6 }}>₹{(metrics.profit / 1000).toFixed(1)}K</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 12 }}>
              <Text style={{ color: "#10b981", fontSize: 13, fontWeight: "700" }}>Net Profit →</Text>
            </View>
          </View>

          {/* Expenses Card */}
          <View
            style={{
              width: "48%",
              backgroundColor: "#fff",
              borderRadius: 22,
              padding: 22,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 6 },
              shadowRadius: 16,
              elevation: 4,
              borderLeftWidth: 6,
              borderLeftColor: "#ef4444",
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Ionicons name="trending-down" size={26} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>Expenses</Text>
                <Text style={{ fontSize: 28, fontWeight: "900", color: "#ef4444", marginTop: 6 }}>₹{(metrics.expenses / 1000).toFixed(1)}K</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 12 }}>
              <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "700" }}>Total Costs →</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Profit vs Expenses Chart */}
      <View style={{ marginTop: 40, marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 24, padding: 28, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 28 }}>Profit vs Expenses</Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          <PieChart
            data={pieData}
            radius={70}
            innerRadius={35}
            textSize={11}
            labelsPosition="outward"
            shadow={false}
            strokeColor="transparent"
          />

          <View style={{ flex: 1, marginLeft: 16 }}>
            {pieData.map((p, i) => (
              <View key={i} style={{ marginBottom: 18 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <View style={{ width: 14, height: 14, backgroundColor: p.color, borderRadius: 7, marginRight: 12 }} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{p.text}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: "800", color: "#3b82f6", marginLeft: 26 }}>₹{(p.value / 1000).toFixed(0)}K</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Revenue by Source */}
      <View style={{ marginTop: 40, marginHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a", marginBottom: 22 }}>Revenue by Source</Text>
        {revenueBySource.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 20,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 3 },
              shadowRadius: 10,
              elevation: 2,
              borderLeftWidth: 6,
              borderLeftColor: "#3b82f6",
            }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center", marginRight: 16, borderWidth: 2, borderColor: "#dbeafe" }}>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a" }}>{item.source}</Text>
              <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>₹{(item.value / 1000).toFixed(1)}K</Text>
            </View>
            <View style={{ backgroundColor: "#d1fae5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#a7f3d0" }}>
              <Text style={{ fontSize: 13, fontWeight: "800", color: "#059669" }}>{item.trend}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Revenue;
