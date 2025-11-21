import React from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const PrivacyPolicyDetail = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: "information-circle",
      content: [
        "Personal information: Name, email, phone, address",
        "Business information: Shop name, products, pricing",
        "Payment information: Bank details, transaction history",
        "Device information: IP address, device ID, app usage data",
        "Communication: Messages, support tickets, feedback",
        "Analytics: Usage patterns, feature interactions",
      ]
    },
    {
      title: "2. How We Use Your Information",
      icon: "checkmark-circle",
      content: [
        "To provide and improve our services",
        "To process payments and withdrawals",
        "To communicate about your account",
        "To send promotional offers and updates",
        "To detect and prevent fraud",
        "To comply with legal requirements",
      ]
    },
    {
      title: "3. Data Security",
      icon: "shield-checkmark",
      content: [
        "We use encryption for data transmission",
        "Password hashing for account security",
        "Regular security audits and updates",
        "Limited staff access to personal data",
        "Compliance with data protection laws",
        "No sharing of passwords or sensitive info",
      ]
    },
    {
      title: "4. Third-Party Sharing",
      icon: "people",
      content: [
        "We do not sell your personal data",
        "Payment processors receive necessary payment info",
        "Analytics providers get anonymized usage data",
        "Legal authorities when required by law",
        "Business partners only with your consent",
        "Data is not shared for marketing without permission",
      ]
    },
    {
      title: "5. Your Rights",
      icon: "person",
      content: [
        "Right to access your personal data",
        "Right to correct inaccurate information",
        "Right to request data deletion",
        "Right to data portability",
        "Right to opt-out of marketing emails",
        "Right to file complaints with authorities",
      ]
    },
    {
      title: "6. Cookies & Tracking",
      icon: "radio",
      content: [
        "We use cookies to improve user experience",
        "Analytics cookies track app usage",
        "You can disable cookies in settings",
        "Third-party services may use cookies",
        "Local storage for app preferences",
        "No tracking without user consent",
      ]
    },
    {
      title: "7. Data Retention",
      icon: "hourglass",
      content: [
        "Account data retained during active account",
        "Transaction history kept for 7 years",
        "Support tickets archived for 2 years",
        "Deleted accounts purged after 90 days",
        "Backup copies may be retained longer",
        "Legal holds override deletion requests",
      ]
    },
    {
      title: "8. International Data Transfers",
      icon: "globe",
      content: [
        "Data may be processed in multiple countries",
        "We comply with international data standards",
        "Data transfers are secured and encrypted",
        "Your data rights are protected globally",
        "GDPR compliance for EU customers",
        "Local laws are respected in all jurisdictions",
      ]
    },
    {
      title: "9. Children's Privacy",
      icon: "happy",
      content: [
        "This service is not intended for minors",
        "We do not knowingly collect child data",
        "Parents/guardians should supervise",
        "Contact us if we collect data from children",
        "We will delete such data immediately",
        "Special protections for under-13 users",
      ]
    },
    {
      title: "10. Policy Updates",
      icon: "refresh",
      content: [
        "We may update this policy anytime",
        "Changes notified via email or in-app",
        "Continued use means acceptance",
        "You have 30 days to review changes",
        "Version history available in app",
        "Major changes require explicit consent",
      ]
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Featured Card */}
        <View style={{ backgroundColor: "#fef3c7", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#fed7aa", shadowColor: "#f59e0b", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#f59e0b", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="lock-closed" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Privacy Policy</Text>
              <Text style={{ fontSize: 12, color: "#b45309", marginTop: 2, fontWeight: "700" }}>DATA PROTECTION</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#a16207", lineHeight: 20 }}>We are committed to protecting your privacy and ensuring transparency about how we handle your data.</Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#fef3c7", justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                <Ionicons name={section.icon as any} size={18} color="#f59e0b" />
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

        {/* Contact Info */}
        <View style={{ backgroundColor: "#ecfdf5", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#10b981", marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="mail" size={18} color="#059669" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#059669" }}>Data Privacy Officer</Text>
              <Text style={{ fontSize: 11, color: "#15803d", marginTop: 4 }}>Contact us at privacy@gardeningvendor.com for privacy concerns or data requests.</Text>
            </View>
          </View>
        </View>

        {/* Footer Info */}
        <View style={{ backgroundColor: "#f0fdf4", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#059669" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#059669" }}>Your Privacy Matters</Text>
              <Text style={{ fontSize: 11, color: "#15803d", marginTop: 4 }}>We take your privacy seriously. Our practices comply with international data protection regulations.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyDetail;
