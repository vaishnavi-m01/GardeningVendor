import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import { useVendor } from "../context/VendorContext";

const Orders = () => {
  const navigation = useNavigation<any>();
  const { vendorData } = useVendor();
  const [range, setRange] = useState("today");

  const metrics = {
    totalOrders: 1240,
    confirmed: 1075,
    pending: 120,
    cancelled: 45,
    growth: "+15%",
  };

  const statusData = [
    { value: 1075, color: "#10b981", text: "Confirmed" },
    { value: 120, color: "#f59e0b", text: "Pending" },
    { value: 45, color: "#ef4444", text: "Cancelled" },
  ];

  const recentOrders = [
    { id: "1", orderId: "#ORD-001", customer: "Vaishnavi", status: "Confirmed", amount: 2599, icon: "✓" },
    { id: "2", orderId: "#ORD-002", customer: "Karthik", status: "Pending", amount: 1899, icon: "⏱" },
    { id: "3", orderId: "#ORD-003", customer: "Ananya", status: "Confirmed", amount: 3249, icon: "✓" },
    { id: "4", orderId: "#ORD-004", customer: "Ravi", status: "Cancelled", amount: 749, icon: "✕" },
  ];

  const statusColorMap: any = {
    Confirmed: { bg: "#d1fae5", text: "#059669", light: "#ecfdf5" },
    Pending: { bg: "#fef3c7", text: "#d97706", light: "#fffbeb" },
    Cancelled: { bg: "#fee2e2", text: "#dc2626", light: "#fee2e2" },
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fb" }} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Hero Card */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 12, elevation: 3 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <View>
            <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" }}>Total Orders</Text>
            <Text style={{ color: "#0f172a", fontSize: 44, fontWeight: "900", marginTop: 10 }}>{metrics.totalOrders}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View style={{ backgroundColor: "#d1fae5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                <Text style={{ color: "#059669", fontSize: 12, fontWeight: "700" }}>{metrics.growth}</Text>
              </View>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 10 }}>vs last period</Text>
            </View>
          </View>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: "#fff7ed", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#fee7a9" }}>
            <Ionicons name="cube" size={28} color="#f59e0b" />
          </View>
        </View>

        {/* Range Picker */}
        <View style={{ backgroundColor: "#f8f9fb", borderRadius: 14, paddingHorizontal: 14, height: 48, overflow: "hidden", borderWidth: 1.5, borderColor: "#e2e8f0" }}>
          <Picker
            selectedValue={range}
            onValueChange={(v) => setRange(v)}
            dropdownIconColor="#3b82f6"
            style={{ height: 48, width: "100%", color: "#0f172a" }}
            mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
          >
            <Picker.Item label="Today" value="today" color="#0f172a" />
            <Picker.Item label="Weekly" value="weekly" color="#0f172a" />
            <Picker.Item label="Monthly" value="monthly" color="#0f172a" />
            <Picker.Item label="Yearly" value="yearly" color="#0f172a" />
          </Picker>
        </View>
      </View>

      {/* Status Stats - 3 Cards */}
      <View style={{ paddingHorizontal: 16, marginTop: 28 }}>
        <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "800", marginBottom: 16 }}>Order Status</Text>
        
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
              elevation: 2,
              borderTopWidth: 4,
              borderTopColor: "#10b981",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="checkmark-done" size={20} color="#10b981" />
                </View>
                <View>
                  <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "600" }}>Confirmed Orders</Text>
                  <Text style={{ fontSize: 28, fontWeight: "900", color: "#10b981", marginTop: 8 }}>{metrics.confirmed}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bbf7d0" />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View
            style={{
              width: "48%",
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
              elevation: 2,
              borderTopWidth: 4,
              borderTopColor: "#f59e0b",
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="time-outline" size={20} color="#d97706" />
                </View>
                <View>
                  <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "600" }}>Pending</Text>
                  <Text style={{ fontSize: 28, fontWeight: "900", color: "#f59e0b", marginTop: 8 }}>{metrics.pending}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ffedd5" />
            </View>
          </View>

          <View
            style={{
              width: "48%",
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 18,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 10,
              elevation: 2,
              borderTopWidth: 4,
              borderTopColor: "#ef4444",
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="close" size={20} color="#ef4444" />
                </View>
                <View>
                  <Text style={{ color: "#64748b", fontSize: 12, fontWeight: "600" }}>Cancelled</Text>
                  <Text style={{ fontSize: 28, fontWeight: "900", color: "#ef4444", marginTop: 8 }}>{metrics.cancelled}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#fecaca" />
            </View>
          </View>
        </View>
      </View>

      {/* Status Distribution Chart */}
      <View style={{ marginTop: 32, marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 18, padding: 22, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 10, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a", marginBottom: 20 }}>Order Distribution</Text>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
          <PieChart
            data={statusData}
            radius={65}
            innerRadius={30}
            textSize={10}
            labelsPosition="outward"
            shadow={false}
            strokeColor="transparent"
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            {statusData.map((p, i) => (
              <View key={i} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                  <View style={{ width: 12, height: 12, backgroundColor: p.color, borderRadius: 6, marginRight: 10 }} />
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#64748b", flex: 1 }}>{p.text}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a", marginLeft: 22 }}>{p.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Orders List */}
      <View style={{ marginTop: 32, marginHorizontal: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a", marginBottom: 16 }}>Recent Orders</Text>
        {recentOrders.map((order) => {
          const colors = statusColorMap[order.status];
          return (
            <View
              key={order.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 8,
                elevation: 1,
                borderTopWidth: 3,
                borderTopColor: colors.text,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 14, borderWidth: 1.5, borderColor: colors.text + "40" }}>
                <Text style={{ fontSize: 20 }}>{order.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a" }}>{order.orderId}</Text>
                <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{order.customer}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View style={{ backgroundColor: colors.bg, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: colors.text + "40" }}>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: colors.text }}>{order.status}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: "800", color: "#0f172a" }}>₹{order.amount}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Orders;
