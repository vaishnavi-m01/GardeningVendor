import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, Switch } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const TwoFactorAuthPage = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [backupCodesVisible, setBackupCodesVisible] = useState(false);

  const handleEnable2FA = () => {
    if (!is2FAEnabled) {
      Alert.alert("Enable 2FA", "You will need to scan a QR code with an authenticator app or enter a setup key.", [
        { text: "Cancel", onPress: () => {} },
        { 
          text: "Continue", 
          onPress: () => {
            setIs2FAEnabled(true);
            Alert.alert("Success", "Two-Factor Authentication has been enabled");
          }
        }
      ]);
    } else {
      Alert.alert("Disable 2FA", "Are you sure you want to disable 2FA? This makes your account less secure.", [
        { text: "Cancel", onPress: () => {} },
        { 
          text: "Disable", 
          onPress: () => {
            setIs2FAEnabled(false);
            Alert.alert("Success", "Two-Factor Authentication has been disabled");
          },
          style: "destructive"
        }
      ]);
    }
  };

  const backupCodes = ["ABCD-1234", "EFGH-5678", "IJKL-9012", "MNOP-3456", "QRST-7890"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#f0fdf4", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#bbf7d0", shadowColor: "#10b981", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#10b981", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="shield-checkmark" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Two-Factor Authentication</Text>
              <Text style={{ fontSize: 12, color: "#059669", marginTop: 2, fontWeight: "700" }}>{is2FAEnabled ? "ENABLED" : "DISABLED"}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#15803d", lineHeight: 20 }}>Add an extra layer of security to your account with two-factor authentication.</Text>
        </View>

        {/* Current Status */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Status</Text>
          
          <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Two-Factor Authentication</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{is2FAEnabled ? "Your account is protected" : "Not currently enabled"}</Text>
            </View>
            <Switch value={is2FAEnabled} onValueChange={handleEnable2FA} />
          </View>
        </View>

        {/* How It Works */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>How It Works</Text>
          
          {[
            { step: "1", title: "Download Authenticator", description: "Install Google Authenticator, Microsoft Authenticator, or Authy on your phone" },
            { step: "2", title: "Scan QR Code", description: "When logging in, scan the QR code with your authenticator app" },
            { step: "3", title: "Enter Code", description: "Enter the 6-digit code shown in the app to verify your identity" },
            { step: "4", title: "Stay Secure", description: "Your account is now protected with an additional security layer" },
          ].map((item, index) => (
            <View key={index} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb", flexDirection: "row", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#0284c7" }}>{item.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#0f172a" }}>{item.title}</Text>
                <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Backup Codes */}
        {is2FAEnabled && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Backup Codes</Text>
            
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                shadowColor: "#1f2937",
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
                elevation: 1,
              }}
              activeOpacity={0.7}
              onPress={() => setBackupCodesVisible(!backupCodesVisible)}
            >
              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Save Backup Codes</Text>
                <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Use if you lose access to authenticator</Text>
              </View>
              <Ionicons name={backupCodesVisible ? "eye" : "eye-off"} size={18} color="#6b7280" />
            </TouchableOpacity>

            {backupCodesVisible && (
              <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, marginTop: 8, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
                {backupCodes.map((code, index) => (
                  <View key={index} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: index === backupCodes.length - 1 ? 0 : 1, borderBottomColor: "#e5e7eb" }}>
                    <Ionicons name="key" size={16} color="#6b7280" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 12, fontFamily: "monospace", color: "#0f172a" }}>{code}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Enable/Disable Button */}
        <TouchableOpacity
          style={{
            backgroundColor: is2FAEnabled ? "#ef4444" : "#10b981",
            borderRadius: 12,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            shadowColor: is2FAEnabled ? "#ef4444" : "#10b981",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 24,
          }}
          activeOpacity={0.7}
          onPress={handleEnable2FA}
        >
          <Ionicons name={is2FAEnabled ? "close-circle" : "checkmark-circle"} size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>{is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}</Text>
        </TouchableOpacity>

        {/* Security Note */}
        <View style={{ backgroundColor: "#fecaca", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#ef4444" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="warning" size={18} color="#7f1d1d" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#7f1d1d" }}>Important</Text>
              <Text style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TwoFactorAuthPage;
