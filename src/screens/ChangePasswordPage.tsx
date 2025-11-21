import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    Alert.alert("Success", "Your password has been changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PasswordInput = ({ label, value, onChangeText, showPassword, setShowPassword, placeholder }: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a", marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 14, shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
        <TextInput
          style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: "#0f172a" }}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 70 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#fef3c7", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#fed7aa", shadowColor: "#f59e0b", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#f59e0b", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="key" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Change Password</Text>
              <Text style={{ fontSize: 12, color: "#b45309", marginTop: 2, fontWeight: "700" }}>ACCOUNT SECURITY</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#a16207", lineHeight: 20 }}>Keep your account secure by updating your password regularly. Use a strong, unique password.</Text>
        </View>

        {/* Password Requirements */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Password Requirements</Text>
          
          <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
            {[
              { icon: "checkmark-circle", text: "At least 8 characters long", color: "#10b981" },
              { icon: "checkmark-circle", text: "Mix of uppercase and lowercase", color: "#10b981" },
              { icon: "checkmark-circle", text: "At least one number", color: "#10b981" },
              { icon: "checkmark-circle", text: "At least one special character (!@#$%)", color: "#10b981" },
            ].map((req, index) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: index === 3 ? 0 : 12 }}>
                <Ionicons name={req.icon as any} size={18} color={req.color} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 12, color: "#6b7280", flex: 1 }}>{req.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Update Password</Text>
          
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
            placeholder="Enter your current password"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
            placeholder="Enter a new password"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            placeholder="Confirm your new password"
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#f59e0b",
              borderRadius: 12,
              padding: 16,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              shadowColor: "#f59e0b",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.7}
            onPress={handleChangePassword}
          >
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={{ backgroundColor: "#fffbeb", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="shield-checkmark" size={18} color="#b45309" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#b45309" }}>Security Tips</Text>
              <Text style={{ fontSize: 11, color: "#d97706", marginTop: 4 }}>Never share your password. We will never ask for it. If someone asks, it's a scam.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordPage;
