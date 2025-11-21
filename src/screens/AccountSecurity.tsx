import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../types/type";

type AccountSecurityNavigationProp = NativeStackNavigationProp<RootStackParamList, "AccountSecurity">;

const AccountSecurity = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const navigation = useNavigation<AccountSecurityNavigationProp>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#e5e7eb" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#0f172a" }}>Account & Security</Text>
        <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Keep your account safe and secure</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Password Section */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#1f2937",
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 1,
            }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("ChangePasswordPage")}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#fce7f3", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="key" size={22} color="#ec4899" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0f172a" }}>Change Password</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Update your password regularly</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Two-Factor Authentication */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Authentication</Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#1f2937",
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 1,
            }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("TwoFactorAuthPage")}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#f3e8ff", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="shield" size={22} color="#8b5cf6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0f172a" }}>Two-Factor Authentication</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Add extra security to your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>

          {twoFactorEnabled && (
            <View style={{ backgroundColor: "#eff6ff", borderRadius: 12, padding: 12, marginTop: 12, borderLeftWidth: 4, borderLeftColor: "#3b82f6" }}>
              <Text style={{ fontSize: 12, color: "#1e40af", fontWeight: "600" }}>✓ Two-factor authentication is enabled</Text>
              <Text style={{ fontSize: 11, color: "#0284c7", marginTop: 4 }}>You'll be asked for a code when logging in from new devices</Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Payments</Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#1f2937",
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 1,
            }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("PaymentMethodsPage")}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#fffbeb", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="card" size={22} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0f172a" }}>Payment Methods</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Bank account & UPI</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Tax & Legal Documents */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Documents</Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#1f2937",
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 1,
            }}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("TaxLegalDocumentsPage")}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#ecfdf5", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="document-text" size={22} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0f172a" }}>Tax & Legal Documents</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>GST, PAN and other details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Account Activity */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Activity</Text>
          
          <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: "#f3f4f6" }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#f0fdf4", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Ionicons name="log-in" size={22} color="#059669" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Last Login</Text>
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Today at 10:30 AM</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#fef2f2", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Ionicons name="log-out" size={22} color="#dc2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Logout All Sessions</Text>
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Sign out from all devices</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </View>
          </View>
        </View>

        {/* Security Alert */}
        <View style={{ backgroundColor: "#fef3c7", borderRadius: 12, padding: 14, borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color="#b45309" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#92400e" }}>Keep Your Account Safe</Text>
              <Text style={{ fontSize: 11, color: "#78350f", marginTop: 4 }}>Never share your password with anyone. Our team will never ask for your password.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSecurity;
