import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Linking } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const TutorialVideosDetail = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

  const tutorials = [
    {
      category: "Basics",
      icon: "film",
      color: "#06b6d4",
      bgColor: "#ecf9ff",
      videos: [
        { id: 1, title: "Getting Started with the App", duration: "5:30", description: "Learn how to set up your vendor account and profile." },
        { id: 2, title: "Adding Your First Product", duration: "4:45", description: "Step-by-step guide to list products on your shop." },
        { id: 3, title: "Understanding the Dashboard", duration: "3:20", description: "Navigate the Home tab and key features overview." },
      ]
    },
    {
      category: "Managing Sales",
      icon: "trending-up",
      color: "#10b981",
      bgColor: "#ecfdf5",
      videos: [
        { id: 4, title: "Processing Orders", duration: "6:15", description: "Accept, confirm, and manage customer orders." },
        { id: 5, title: "Creating Offers & Discounts", duration: "5:00", description: "Boost sales with promotions and seasonal offers." },
        { id: 6, title: "Analytics Deep Dive", duration: "7:40", description: "Track revenue, sales trends, and customer insights." },
      ]
    },
    {
      category: "Advanced Features",
      icon: "sparkles",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
      videos: [
        { id: 7, title: "Bulk Upload Products", duration: "8:20", description: "Upload multiple products using CSV file." },
        { id: 8, title: "Team Management", duration: "6:10", description: "Add team members and manage permissions." },
        { id: 9, title: "Inventory Management", duration: "5:50", description: "Track stock, set low stock alerts." },
      ]
    },
    {
      category: "Tips & Tricks",
      icon: "bulb",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      videos: [
        { id: 10, title: "Maximize Your Sales", duration: "4:30", description: "Proven strategies to increase order volume." },
        { id: 11, title: "Premium Vendor Benefits", duration: "3:45", description: "Learn about upgrading to premium tier." },
        { id: 12, title: "Customer Service Excellence", duration: "6:05", description: "Best practices for happy customers and 5-star reviews." },
      ]
    },
  ];

  const watchVideo = (title: string, duration: string) => {
    // In a real app, this would open a video player
    console.log(`Playing: ${title} (${duration})`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#f0fdf4", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#bbf7d0", shadowColor: "#10b981", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#10b981", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="play-circle" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Video Tutorials</Text>
              <Text style={{ fontSize: 12, color: "#059669", marginTop: 2, fontWeight: "700" }}>48+ VIDEOS</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#15803d", lineHeight: 20 }}>Learn everything about managing your business with our comprehensive video guides. Watch at your own pace.</Text>
        </View>

        {/* Video Categories */}
        {tutorials.map((tutorial, catIndex) => (
          <View key={catIndex} style={{ marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                shadowColor: "#1f2937",
                shadowOpacity: 0.04,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
                elevation: 1,
              }}
              activeOpacity={0.7}
              onPress={() => setExpandedCategory(expandedCategory === catIndex ? null : catIndex)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: tutorial.bgColor, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Ionicons name={tutorial.icon as any} size={20} color={tutorial.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>{tutorial.category}</Text>
                  <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{tutorial.videos.length} videos</Text>
                </View>
              </View>
              <Ionicons name={expandedCategory === catIndex ? "chevron-up" : "chevron-down"} size={18} color="#9ca3af" />
            </TouchableOpacity>

            {expandedCategory === catIndex && (
              <View style={{ marginTop: 10, gap: 10 }}>
                {tutorial.videos.map((video) => (
                  <TouchableOpacity
                    key={video.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      shadowColor: "#1f2937",
                      shadowOpacity: 0.04,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 6,
                      elevation: 1,
                    }}
                    activeOpacity={0.7}
                    onPress={() => watchVideo(video.title, video.duration)}
                  >
                    <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: tutorial.bgColor, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                      <Ionicons name="play" size={18} color={tutorial.color} />
                    </View>
                    
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#0f172a" }}>{video.title}</Text>
                      <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{video.description}</Text>
                      <Text style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, fontWeight: "600" }}>{video.duration}</Text>
                    </View>

                    <Ionicons name="play-circle" size={24} color={tutorial.color} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Info Box */}
        <View style={{ backgroundColor: "#f0fdf4", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#10b981" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="checkmark-circle" size={18} color="#059669" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#059669" }}>Pro Tips</Text>
              <Text style={{ fontSize: 11, color: "#15803d", marginTop: 4 }}>Watch tutorials regularly to discover new features and optimization strategies for your business.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TutorialVideosDetail;
