import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const PaymentMethodsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("bank");

  const bankAccounts = [
    { id: 1, name: "HDFC Bank", account: "••••••••5432", type: "Checking", isDefault: true },
    { id: 2, name: "ICICI Bank", account: "••••••••9876", type: "Savings", isDefault: false },
  ];

  const upiAccounts = [
    { id: 1, upi: "vendor@hdfc", isDefault: true },
    { id: 2, upi: "vendor@icici", isDefault: false },
  ];

  const handleAddMethod = () => {
    Alert.alert("Add Payment Method", "Choose payment method to add", [
      { text: "Cancel", onPress: () => {} },
      { text: "Bank Account", onPress: () => Alert.alert("Success", "Bank account added") },
      { text: "UPI", onPress: () => Alert.alert("Success", "UPI added") }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#dbeafe", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#bfdbfe", shadowColor: "#3b82f6", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="wallet" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Payment Methods</Text>
              <Text style={{ fontSize: 12, color: "#0284c7", marginTop: 2, fontWeight: "700" }}>MANAGE ACCOUNTS</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#1e40af", lineHeight: 20 }}>Add and manage your bank accounts and UPI for quick withdrawals.</Text>
        </View>

        {/* Bank Accounts */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", textTransform: "uppercase", letterSpacing: 0.5 }}>Bank Accounts</Text>
            <TouchableOpacity onPress={handleAddMethod}>
              <Ionicons name="add-circle" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {bankAccounts.map((account) => (
            <View key={account.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#eff6ff", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                    <Ionicons name="home" size={20} color="#3b82f6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>{account.name}</Text>
                    <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{account.type}</Text>
                  </View>
                </View>
                {account.isDefault && (
                  <View style={{ backgroundColor: "#dbeafe", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#0284c7" }}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{account.account}</Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {!account.isDefault && (
                  <TouchableOpacity style={{ flex: 1, backgroundColor: "#eff6ff", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#bfdbfe" }} activeOpacity={0.7} onPress={() => Alert.alert("Success", "Set as default")}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#3b82f6" }}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={{ flex: 1, backgroundColor: "#fef2f2", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#fecaca" }} activeOpacity={0.7} onPress={() => Alert.alert("Remove", "This account will be removed", [{ text: "Cancel" }, { text: "Remove", style: "destructive", onPress: () => Alert.alert("Removed", "Account has been removed") }])}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#ef4444" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* UPI */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", textTransform: "uppercase", letterSpacing: 0.5 }}>UPI Addresses</Text>
            <TouchableOpacity onPress={handleAddMethod}>
              <Ionicons name="add-circle" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {upiAccounts.map((account) => (
            <View key={account.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#fef3c7", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                    <Ionicons name="phone-portrait" size={20} color="#f59e0b" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>UPI</Text>
                    <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Instant Transfer</Text>
                  </View>
                </View>
                {account.isDefault && (
                  <View style={{ backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#b45309" }}>DEFAULT</Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{account.upi}</Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {!account.isDefault && (
                  <TouchableOpacity style={{ flex: 1, backgroundColor: "#fffbeb", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#fed7aa" }} activeOpacity={0.7} onPress={() => Alert.alert("Success", "Set as default")}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: "#f59e0b" }}>Set Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={{ flex: 1, backgroundColor: "#fef2f2", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#fecaca" }} activeOpacity={0.7} onPress={() => Alert.alert("Remove", "This account will be removed", [{ text: "Cancel" }, { text: "Remove", style: "destructive", onPress: () => Alert.alert("Removed", "Account has been removed") }])}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#ef4444" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add New Method Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: 12,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            shadowColor: "#3b82f6",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 24,
          }}
          activeOpacity={0.7}
          onPress={handleAddMethod}
        >
          <Ionicons name="add-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Add Payment Method</Text>
        </TouchableOpacity>

          <View style={{ backgroundColor: "#dbeafe", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#3b82f6" }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Ionicons name="information-circle" size={18} color="#0284c7" style={{ marginRight: 10, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#0284c7" }}>Security</Text>
                <Text style={{ fontSize: 11, color: "#0284c7", marginTop: 4 }}>Your payment information is encrypted and secure. We never store full account numbers.</Text>
              </View>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodsPage;
