import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Linking, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ContactSupportDetail = () => {
  const [message, setMessage] = useState("");
  const supportEmail = "support@gardeningvendor.com";
  const supportPhone = "+91-XXXX-XXXX-XXXX";

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert("Success", "Your message has been sent to our support team. We'll respond within 5 minutes.");
      setMessage("");
    } else {
      Alert.alert("Error", "Please type a message before sending.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#f0f9ff", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#bfdbfe", shadowColor: "#3b82f6", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Live Chat Support</Text>
              <Text style={{ fontSize: 12, color: "#0284c7", marginTop: 2, fontWeight: "700" }}>INSTANT HELP</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#1e40af", lineHeight: 20 }}>Connect with our support team instantly. Average response time is less than 5 minutes during business hours.</Text>
        </View>

        {/* Support Stats */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Support Stats</Text>
          
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <Ionicons name="flash" size={24} color="#fbbf24" style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#f59e0b" }}>{"< 5 min"}</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 4, textAlign: "center" }}>Average Response</Text>
            </View>
            
            <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <Ionicons name="star" size={24} color="#ec4899" style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#ec4899" }}>4.9/5</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 4, textAlign: "center" }}>Support Rating</Text>
            </View>
            
            <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#10b981" }}>24/7</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 4, textAlign: "center" }}>Available</Text>
            </View>
          </View>
        </View>

        {/* Message Input */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Send a Message</Text>
          
          <View style={{ backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#e5e7eb", overflow: "hidden", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
            <TextInput
              style={{ padding: 16, minHeight: 120, fontSize: 14, color: "#0f172a", textAlignVertical: "top" }}
              placeholder="Describe your issue or question..."
              placeholderTextColor="#9ca3af"
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#3b82f6",
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              shadowColor: "#3b82f6",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.7}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Methods */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Other Ways to Reach Us</Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
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
            onPress={() => Linking.openURL(`mailto:${supportEmail}`)}
          >
            <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#ecfdf5", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="mail" size={20} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Email</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{supportEmail}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#d1d5db" />
          </TouchableOpacity>

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
            onPress={() => Alert.alert("Phone Support", supportPhone)}
          >
            <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="call" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Phone</Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Mon-Fri, 9AM-6PM IST</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={{ backgroundColor: "#eff6ff", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#3b82f6" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color="#1e40af" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#1e40af" }}>Pro Tip</Text>
              <Text style={{ fontSize: 11, color: "#0284c7", marginTop: 4 }}>For faster resolution, include order numbers or transaction IDs in your message.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactSupportDetail;
