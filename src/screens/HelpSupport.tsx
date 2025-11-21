import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../types/type";

type HelpSupportNavigationProp = NativeStackNavigationProp<RootStackParamList, "HelpSupport">;

const HelpSupport = () => {
  const navigation = useNavigation<HelpSupportNavigationProp>();
  const supportEmail = "support@gardeningvendor.com";
  const supportPhone = "+91-XXXX-XXXX-XXXX";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#e5e7eb" }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: "#0f172a" }}>Help & Support</Text>
        <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Get answers and assistance anytime</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Support - Featured */}
        <TouchableOpacity
          style={{
            backgroundColor: "#f0f9ff",
            borderRadius: 16,
            padding: 18,
            marginBottom: 24,
            borderWidth: 2,
            borderColor: "#bfdbfe",
            shadowColor: "#3b82f6",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 8,
            elevation: 2,
          }}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ContactSupportDetail")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a" }}>Contact Support</Text>
              <Text style={{ fontSize: 11, color: "#0284c7", marginTop: 2, fontWeight: "700" }}>LIVE CHAT</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </View>
          <Text style={{ fontSize: 13, color: "#1e40af", lineHeight: 18 }}>Chat with our support team. Typical response time: within 5 minutes.</Text>
        </TouchableOpacity>

        {/* Quick Help Options */}
        <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Quick Help</Text>

        <View style={{ marginBottom: 28 }}>
          {[
            { icon: "book", title: "Help Center", sub: "Browse FAQs & guides", color: "#8b5cf6", bgColor: "#f3e8ff", action: () => navigation.navigate("HelpCenterDetail") },
            { icon: "play-circle", title: "Tutorials", sub: "Video guides & tips", color: "#ec4899", bgColor: "#fce7f3", action: () => navigation.navigate("TutorialVideosDetail") },
            { icon: "document", title: "Terms & Conditions", sub: "Vendor policies", color: "#10b981", bgColor: "#ecfdf5", action: () => navigation.navigate("TermsAndConditionsDetail") },
            { icon: "lock-closed", title: "Privacy Policy", sub: "Data protection info", color: "#f59e0b", bgColor: "#fffbeb", action: () => navigation.navigate("PrivacyPolicyDetail") },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
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
              onPress={item.action}
            >
              <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: item.bgColor, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>{item.title}</Text>
                <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Information */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Contact Us</Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 14,
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
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Email Support</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{supportEmail}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 14,
              padding: 14,
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
            onPress={() => {}}
          >
            <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#dbeafe", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
              <Ionicons name="call" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>Phone Support</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Mon-Fri, 9AM-6PM IST</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Frequently Asked</Text>

          {[
            { q: "How do I withdraw my earnings?", a: "Go to Analytics → Revenue to withdraw. Minimum amount is ₹100." },
            { q: "How do I update my profile?", a: "Open Settings and select 'Edit Profile' to make changes." },
            { q: "What is the commission rate?", a: "Standard commission is 5% per transaction. Premium vendors get 3%." },
          ].map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#0f172a" }}>{faq.q}</Text>
              <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>{faq.a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box */}
        <View style={{ backgroundColor: "#eff6ff", borderRadius: 12, padding: 14, borderLeftWidth: 4, borderLeftColor: "#3b82f6" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color="#1e40af" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#1e40af" }}>We're Here to Help</Text>
              <Text style={{ fontSize: 11, color: "#0284c7", marginTop: 4 }}>Average response time for support queries is less than 5 minutes. Availability: 24/7</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupport;
