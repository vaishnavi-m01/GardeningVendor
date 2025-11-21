import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../utils/AppHeader";

// ---------- Typing Indicator ----------
const TypingIndicator = ({ size = 6, color = "#40916c", style }: any) => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -4, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );

    const a1 = createLoop(anim1, 0);
    const a2 = createLoop(anim2, 150);
    const a3 = createLoop(anim3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    marginHorizontal: 2,
    transform: [{ translateY: anim }],
  });

  return (
    <View className="flex-row items-center" style={style}>
      <Animated.View style={dotStyle(anim1)} />
      <Animated.View style={dotStyle(anim2)} />
      <Animated.View style={dotStyle(anim3)} />
    </View>
  );
};

// ---------- Filter Chip ----------
const FilterChip = ({ label, count, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full mr-3 ${active ? "bg-[#40916c]" : "bg-[#f0f0f0]"}`}
  >
    <View className="flex-row items-center">
      <Text className={`text-[13px] font-medium ${active ? "text-white" : "text-gray-700"}`}>
        {label}
      </Text>
      {typeof count === "number" && (
        <View className="ml-2 px-2 rounded-full items-center justify-center bg-[#ff4757]">
          <Text className="text-[10px] font-semibold text-white">{count}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// ---------- Dummy Chat Data ----------
const chatData = {
  today: [
    {
      initials: "RK",
      name: "Rajesh Kumar",
      time: "2 min ago",
      typing: true,
      unreadCount: 3,
      urgent: true,
      unread: true,
      orderRef: "📦 Order #ORD-8901",
    },
    {
      initials: "PS",
      name: "Priya Sharma",
      time: "15 min ago",
      message: "📷 Can you send me photos of the plants before delivery?",
      unreadCount: 2,
      unread: true,
      orderRef: "📦 Order #ORD-8898",
    },
    {
      initials: "NK",
      name: "Neha Kapoor",
      time: "1 hour ago",
      message:
        "Hi! I need help with my roof garden setup. What's the cost for 800 sq ft area?",
      unreadCount: 1,
      unread: true,
    },
  ],
  yesterday: [
    {
      initials: "VS",
      name: "Vikram Singh",
      time: "Yesterday, 6:45 PM",
      message:
        "The maintenance service was excellent. Can we schedule monthly visits?",
      orderRef: "🛠️ Service #SRV-1234",
    },
    {
      initials: "MA",
      name: "Meera Agarwal",
      time: "Yesterday, 4:20 PM",
      message: "Great! I'll be home after 5 PM for the delivery",
      orderRef: "📦 Order #ORD-8887",
    },
    {
      initials: "DM",
      name: "Deepak Mehta",
      time: "Yesterday, 2:15 PM",
      message:
        "Is the organic fertilizer safe for vegetable plants? Also, how long does it last?",
      unreadCount: 1,
      unread: true,
    },
  ],
  thisWeek: [
    {
      initials: "ST",
      name: "Sunita Trivedi",
      time: "Nov 1, 3:20 PM",
      message:
        "Do you provide consultation for terrace garden design? What are your charges?",
    },
    {
      initials: "KS",
      name: "Karan Sethi",
      time: "Oct 31, 5:45 PM",
      message:
        "Thanks for the quote. I'd like to proceed with the bulk order of 50 plants.",
    },
    {
      initials: "AN",
      name: "Anjali Nair",
      time: "Oct 30, 11:15 AM",
      message:
        "🎥 Could you send me a video on how to care for snake plants?",
      orderRef: "📦 Order #ORD-8850",
    },
  ],
};

// ---------- Chat Card ----------
const ChatCard = ({
  initials,
  name,
  time,
  message,
  unreadCount,
  urgent,
  unread,
  orderRef,
  typing,
  onPress,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.95}
    className={`rounded-xl p-4 mb-3 flex-row gap-3 ${unread ? "bg-[#f0f9ff]" : "bg-white"}`}
    style={unread ? styles.chatCardUnread : styles.chatCard}
  >
    <View style={{ position: "relative" }}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        className="w-12 h-12 rounded-full items-center justify-center"
      >
        <Text className="text-white font-semibold text-[16px]">{initials}</Text>
      </LinearGradient>
      <View style={styles.onlineIndicator} />
    </View>

    <View className="flex-1 min-w-0">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-row items-center">
          <Text className="text-[15px] font-semibold text-gray-800 mr-2" numberOfLines={1}>
            {name}
          </Text>
          {urgent && (
            <View className="ml-2 px-2 rounded-full bg-[#ff4757]">
              <Text className="text-[10px] font-semibold text-white">URGENT</Text>
            </View>
          )}
        </View>
        <Text className="text-[11px] text-gray-500">{time}</Text>
      </View>

      {typing ? (
        <View className="flex-row items-center mb-2">
          <Text className="text-[13px] text-gray-700 mr-2 italic">typing</Text>
          <TypingIndicator />
        </View>
      ) : (
        <Text
          className={`${unread ? "text-gray-800 font-medium" : "text-gray-600"} mb-2 text-[13px]`}
          numberOfLines={2}
        >
          {message}
        </Text>
      )}

      {orderRef && (
        <View className="inline-flex px-3 py-1 rounded-full bg-[#e7f5ff]">
          <Text className="text-[11px] font-semibold text-[#1971c2]">{orderRef}</Text>
        </View>
      )}
    </View>

    {unreadCount ? (
      <View style={styles.unreadBadge}>
        <Text className="text-[11px] font-semibold text-white">{unreadCount}</Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

// ---------- Messages Screen ----------
const MessagesScreen = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("All");

  const handleChatPress = (chat: any) => {
    navigation.navigate("Chat", {
      userName: chat.name,
      initials: chat.initials,
    });
  };

  const filters = [
    { label: "All", count: 24 },
    { label: "Unread", count: 8 },
    { label: "Orders" },
    { label: "Services" },
    { label: "Inquiries" },
    { label: "Archived" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f5f7fa]">
      <AppHeader
        title="Messages"
        showBack
        rightIcon="✏️"
        showSearch
        searchPlaceholder="Search conversations..."
      />


      <View className="bg-white px-4 py-3 flex-row justify-around border-b border-gray-200">
        {[
          { num: "24", label: "Total Chats" },
          { num: "8", label: "Unread" },
          { num: "3", label: "Urgent" },
        ].map((s, i) => (
          <View key={i} className="items-center">
            <Text className="text-[20px] font-bold text-[#40916c]">{s.num}</Text>
            <Text className="text-[11px] text-gray-600">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="bg-white border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          {filters.map((f) => (
            <FilterChip key={f.label} {...f} active={activeFilter === f.label} onPress={() => setActiveFilter(f.label)} />
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        {/* TODAY */}
        <View style={styles.dateDivider}>
          <Text className="text-[12px] font-semibold text-gray-500">TODAY</Text>
        </View>
        {chatData.today.map((chat, i) => (
          <ChatCard key={i} {...chat} onPress={() => handleChatPress(chat)} />
        ))}

        {/* YESTERDAY */}
        <View style={styles.dateDivider}>
          <Text className="text-[12px] font-semibold text-gray-500">YESTERDAY</Text>
        </View>
        {chatData.yesterday.map((chat, i) => (
          <ChatCard key={i} {...chat} onPress={() => handleChatPress(chat)} />
        ))}

        {/* THIS WEEK */}
        <View style={styles.dateDivider}>
          <Text className="text-[12px] font-semibold text-gray-500">THIS WEEK</Text>
        </View>
        {chatData.thisWeek.map((chat, i) => (
          <ChatCard key={i} {...chat} onPress={() => handleChatPress(chat)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  chatCardUnread: {
    backgroundColor: "#f0f9ff",
    borderRadius: 15,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#40916c",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: "#28a745",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  unreadBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDivider: {
    alignItems: "center",
    marginVertical: 18,
  },
});

export default MessagesScreen;
