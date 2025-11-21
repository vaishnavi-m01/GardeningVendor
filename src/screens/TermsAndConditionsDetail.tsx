import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const TermsAndConditionsDetail = () => {
  const sections = [
    {
      title: "1. Vendor Agreement",
      icon: "document-text",
      content: [
        "By using this app, you agree to comply with all terms and conditions outlined herein.",
        "You must be at least 18 years old and have the legal capacity to enter into agreements.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "Unauthorized use of your account should be reported immediately.",
      ]
    },
    {
      title: "2. Prohibited Activities",
      icon: "ban",
      content: [
        "No fraudulent or deceptive practices",
        "No sale of counterfeit or illegal products",
        "No violation of intellectual property rights",
        "No harassment or abusive behavior toward customers",
        "No manipulation of product listings or reviews",
        "No circumventing payment systems or commission structures",
      ]
    },
    {
      title: "3. Commission & Payments",
      icon: "wallet",
      content: [
        "Standard vendors pay 5% commission per transaction",
        "Premium vendors get 2% discount on commissions",
        "Minimum withdrawal amount is ₹100",
        "Payments are processed within 1-2 business days",
        "Failed withdrawals may be retried or refunded",
        "We reserve the right to adjust commission rates with 30 days notice",
      ]
    },
    {
      title: "4. Product Policies",
      icon: "cube",
      content: [
        "All products must comply with local laws and regulations",
        "Product images must be original or properly licensed",
        "Descriptions must be accurate and honest",
        "Pricing must be clearly displayed",
        "Out-of-stock items should be marked or removed",
        "We reserve the right to reject inappropriate listings",
      ]
    },
    {
      title: "5. Customer Service",
      icon: "people",
      content: [
        "Vendors must respond to customer inquiries within 24 hours",
        "Orders must be processed according to agreed timelines",
        "Cancellations and refunds must be handled fairly",
        "Vendors must maintain professional communication",
        "Disputes will be resolved through our mediation process",
        "Repeated violations may result in account suspension",
      ]
    },
    {
      title: "6. Liability & Disclaimer",
      icon: "shield-checkmark",
      content: [
        "We provide the platform as-is without guarantees",
        "We are not liable for direct or indirect damages",
        "Vendors are responsible for their own content",
        "We do not endorse any vendor or product",
        "Use of the platform is at your own risk",
        "Local laws and regulations take precedence",
      ]
    },
    {
      title: "7. Account Suspension & Termination",
      icon: "alert-circle",
      content: [
        "Violation of terms may result in account suspension",
        "Repeated violations lead to permanent termination",
        "Suspended accounts cannot withdraw pending earnings",
        "We will provide notice of suspension with reason",
        "Appeal process available within 7 days",
        "Terminated accounts cannot be reinstated",
      ]
    },
    {
      title: "8. Changes to Terms",
      icon: "refresh",
      content: [
        "We may update these terms at any time",
        "Changes will be notified via email or in-app notice",
        "Continued use constitutes acceptance of new terms",
        "You have 30 days to opt-out if you disagree",
        "The latest version is always available in the app",
      ]
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#ede9fe", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#ddd6fe", shadowColor: "#7c3aed", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#7c3aed", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="document-text" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Terms & Conditions</Text>
              <Text style={{ fontSize: 12, color: "#6d28d9", marginTop: 2, fontWeight: "700" }}>VENDOR AGREEMENT</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#5b21b6", lineHeight: 20 }}>Last updated: November 2025. Please read carefully before using the platform.</Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#f3e8ff", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                <Ionicons name={section.icon as any} size={18} color="#7c3aed" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{section.title}</Text>
            </View>

            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 14, shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              {section.content.map((item, itemIndex) => (
                <View key={itemIndex} style={{ flexDirection: "row", marginBottom: itemIndex === section.content.length - 1 ? 0 : 10 }}>
                  <Text style={{ fontSize: 16, color: "#d1d5db", marginRight: 8, fontWeight: "600" }}>•</Text>
                  <Text style={{ fontSize: 12, color: "#6b7280", lineHeight: 18, flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer Info */}
        <View style={{ backgroundColor: "#fef3c7", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color="#b45309" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#b45309" }}>Important Notice</Text>
              <Text style={{ fontSize: 11, color: "#d97706", marginTop: 4 }}>By using this app, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsDetail;
