import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import Ionicons from 'react-native-vector-icons/Ionicons';

const StockSummary = () => {
  const navigation = useNavigation<any>();

  const totals = { totalProducts: 430, outOfStock: 12, lowStock: 45, inStock: 373 };
  const outOfStockItems = [
    { id: "p1", name: "Monstera Deliciosa", lastStock: "25-Oct-2025", daysOut: 17 },
    { id: "p2", name: "Aloe Vera", lastStock: "22-Oct-2025", daysOut: 20 },
    { id: "p3", name: "Snake Plant", lastStock: "18-Oct-2025", daysOut: 24 },
    { id: "p4", name: "Peace Lily", lastStock: "15-Oct-2025", daysOut: 27 },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fb" }} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Hero Card - Enhanced */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, backgroundColor: "#fff", marginHorizontal: 16, marginTop: 16, borderRadius: 28, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 20, elevation: 5 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text style={{ color: "#64748b", fontSize: 11, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" }}>Inventory Status</Text>
            <Text style={{ color: "#0f172a", fontSize: 52, fontWeight: "900", marginTop: 14, lineHeight: 56 }}>{totals.totalProducts}</Text>
            <Text style={{ color: "#94a3b8", fontSize: 14, fontWeight: "500", marginTop: 10 }}>Total products in catalog</Text>
          </View>
          <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: "#fff7ed", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fee7a9" }}>
            <Ionicons name="layers" size={36} color="#f59e0b" />
          </View>
        </View>
      </View>

      {/* Stock Status Cards - Enhanced Layout */}
      <View style={{ paddingHorizontal: 16, marginTop: 36 }}>
        <Text style={{ color: "#0f172a", fontSize: 19, fontWeight: "800", letterSpacing: 0.3, marginBottom: 22 }}>Stock Overview</Text>
        
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
          {/* In Stock Card */}
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
                <Ionicons name="checkmark-circle" size={26} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>In Stock</Text>
                <Text style={{ fontSize: 32, fontWeight: "900", color: "#10b981", marginTop: 6 }}>{totals.inStock}</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 12 }}>
              <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "600" }}>Ready to sell</Text>
            </View>
          </View>

          {/* Low Stock Card */}
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
              borderLeftColor: "#f59e0b",
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Ionicons name="alert" size={26} color="#d97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>Low Stock</Text>
                <Text style={{ fontSize: 32, fontWeight: "900", color: "#f59e0b", marginTop: 6 }}>{totals.lowStock}</Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 12 }}>
              <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "600" }}>Reorder soon</Text>
            </View>
          </View>
        </View>

        {/* Out of Stock Card - Full Width Alert */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Products")}
          activeOpacity={0.8}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 22,
            padding: 24,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 16,
            elevation: 4,
            borderLeftWidth: 6,
            borderLeftColor: "#ef4444",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 60, height: 60, borderRadius: 16, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', marginRight: 18 }}>
                <Ionicons name="alert-circle" size={28} color='#ef4444' />
              </View>
              <View>
                <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>Out of Stock</Text>
                <Text style={{ fontSize: 36, fontWeight: "900", color: "#ef4444", marginTop: 6 }}>{totals.outOfStock}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: "#fee2e2", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#dc2626" }}>Action →</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Out of Stock Items List */}
      <View style={{ marginTop: 40, marginHorizontal: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Out of Stock Items</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Products")}
            style={{ backgroundColor: "#fee2e2", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#dc2626" }}>View all →</Text>
          </TouchableOpacity>
        </View>

        {outOfStockItems.map((item) => (
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
              borderLeftColor: "#ef4444",
            }}
          >
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#fff1f2", alignItems: "center", justifyContent: "center", marginRight: 16, borderWidth: 2, borderColor: "#fecaca" }}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a" }}>{item.name}</Text>
              <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Out for {item.daysOut} days • Last stock {item.lastStock}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Products")}
              style={{ backgroundColor: "#fee2e2", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#fecaca" }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#dc2626" }}>Restock</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Quick Action Buttons */}
      <View style={{ marginTop: 40, marginHorizontal: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", gap: 14, justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Products")}
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 18,
              paddingVertical: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 6 },
              shadowRadius: 16,
              elevation: 4,
              borderTopWidth: 4,
              borderTopColor: "#3b82f6",
            }}
          >
            <Ionicons name="grid" size={28} color="#3b82f6" />
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a", marginTop: 8 }}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Analytics")}
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 18,
              paddingVertical: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 6 },
              shadowRadius: 16,
              elevation: 4,
              borderTopWidth: 4,
              borderTopColor: "#f59e0b",
            }}
          >
            <Ionicons name="stats-chart" size={28} color="#f59e0b" />
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#0f172a", marginTop: 8 }}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default StockSummary;
