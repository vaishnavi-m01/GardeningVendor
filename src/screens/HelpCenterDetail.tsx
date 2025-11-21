import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const HelpCenterDetail = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = [
    {
      title: "Getting Started",
      icon: "rocket",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      items: [
        { q: "How do I create my vendor account?", a: "Download the app, sign up with your email, and follow the verification process. It takes about 5 minutes to complete your profile." },
        { q: "How do I list my products?", a: "Go to Products tab → Add Product/Service → Fill in details and upload photos → Submit for verification." },
        { q: "How do I set pricing?", a: "In Products/Services, set your base price. You can create discounts and seasonal offers in the Offers section." },
      ]
    },
    {
      title: "Orders & Sales",
      icon: "shopping-cart",
      color: "#10b981",
      bgColor: "#ecfdf5",
      items: [
        { q: "How do I track orders?", a: "Go to Orders tab to see all incoming orders with live status updates. Customers get real-time notifications too." },
        { q: "How do I manage order refunds?", a: "In Orders, find the order → Tap menu → Select Refund option. Refunds are processed within 3-5 business days." },
        { q: "How do I set minimum order value?", a: "Go to Settings → Business Settings → Set minimum order amount. This applies to all your products." },
      ]
    },
    {
      title: "Payments & Withdrawals",
      icon: "wallet",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      items: [
        { q: "How do I withdraw my earnings?", a: "Go to Analytics → Revenue → Click Withdraw → Select amount (min ₹100) → Choose bank account → Confirm." },
        { q: "What is the commission rate?", a: "Standard vendors: 5% per transaction. Premium vendors: 3%. Partner vendors: Negotiated rates." },
        { q: "When do I get paid?", a: "Withdrawals are processed daily. Money reaches your bank account within 1-2 business days." },
      ]
    },
    {
      title: "Profile & Settings",
      icon: "settings",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
      items: [
        { q: "How do I update my business info?", a: "Go to Settings → My Business to update name, address, phone, and business documents." },
        { q: "Can I have multiple shops?", a: "Yes, premium vendors can manage multiple locations. Contact support for upgrade details." },
        { q: "How do I change my password?", a: "Settings → Account & Security → Change Password → Enter old password → Set new password." },
      ]
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#f3e8ff", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#ddd6fe", shadowColor: "#8b5cf6", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#8b5cf6", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="book" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Help Center</Text>
              <Text style={{ fontSize: 12, color: "#7c3aed", marginTop: 2, fontWeight: "700" }}>GUIDES & FAQS</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#6d28d9", lineHeight: 20 }}>Browse our comprehensive guide to understand every feature and grow your business faster.</Text>
        </View>

        {/* Categories with FAQs */}
        {categories.map((category, catIndex) => (
          <View key={catIndex} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: category.bgColor, justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                <Ionicons name={category.icon as any} size={20} color={category.color} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0f172a" }}>{category.title}</Text>
            </View>

            {category.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  marginBottom: 8,
                  overflow: "hidden",
                  shadowColor: "#1f2937",
                  shadowOpacity: 0.04,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  elevation: 1,
                }}
                activeOpacity={0.7}
                onPress={() => setExpandedIndex(expandedIndex === catIndex * 10 + itemIndex ? null : catIndex * 10 + itemIndex)}
              >
                <View style={{ padding: 14, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#0f172a", flex: 1, paddingRight: 8 }}>{item.q}</Text>
                  <Ionicons
                    name={expandedIndex === catIndex * 10 + itemIndex ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9ca3af"
                  />
                </View>

                {expandedIndex === catIndex * 10 + itemIndex && (
                  <View style={{ backgroundColor: "#f9fafb", borderTopWidth: 1, borderTopColor: "#e5e7eb", padding: 14 }}>
                    <Text style={{ fontSize: 12, color: "#6b7280", lineHeight: 18 }}>{item.a}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Info Box */}
        <View style={{ backgroundColor: "#fef3c7", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#f59e0b" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="bulb" size={18} color="#b45309" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#b45309" }}>Still Have Questions?</Text>
              <Text style={{ fontSize: 11, color: "#d97706", marginTop: 4 }}>Contact our support team for personalized help. We're available 24/7!</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenterDetail;
