import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
  Animated,
  Dimensions,
} from "react-native";
import AppHeader from "../utils/AppHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import apiClient from "../api/apiBaseUrl";
import { useVendor } from "../context/VendorContext";
import Toast from "react-native-toast-message";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

interface OrderDto {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
  deliveryCharge: number;
  description: string;
  productImageUrl: string;
}

interface Order {
  id: number;
  productOrderId: string;
  userName: string;
  userPhone?: string;
  addressId: string | number;
  orderStatus: string;
  totalAmount: number;
  createdDate: string;
  orderDto: OrderDto[];
}

interface Vendor {
  id: number;
  name: string;
  shopName: string;
}


const Home = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { vendorData } = useVendor();
  const [vendorDetails, setVendorDetails] = useState<Vendor | null>(null);
  const [addresses, setAddresses] = useState<{ [key: number]: string }>({});

  useFocusEffect(
    useCallback(() => {
      if (vendorData?.id) {
        fetchOrders(vendorData.id);
      }
    }, [vendorData])
  );


  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorData?.id) return;

      try {
        setLoading(true);
        const response = await apiClient.get<Vendor>(
          `api/public/vendor/getOne/${vendorData.id}`
        );
        setVendorDetails(response.data);
      } catch (error) {
        console.error("Error fetching vendor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorData]);


  const fetchAddress = async (addressId: number) => {
    try {
      const response = await apiClient.get(`api/public/address/getOne/${addressId}`);
      const addr = response.data;
      const addressString = `${addr.addressLine1}, ${addr.city}, ${addr.state}, ${addr.country}`;
      setAddresses((prev) => ({ ...prev, [addressId]: addressString }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchOrders = async (vendorId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get<Order[]>(
        `api/public/order/getAll?vendorId=${vendorId}`
      );

      const latestOrders = response.data
        .sort(
          (a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
        .filter(order => order.orderStatus !== "PENDING_PAYMENT")
        .slice(0, 2);

      setOrders(latestOrders);
      latestOrders.forEach((order) => {
        if (order.addressId) fetchAddress(Number(order.addressId));
      });


    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateOrderStatus = async (
    orderId: number,
    currentStatus: string,
    newStatus: string
  ) => {
    if (newStatus === "CONFIRMED" && currentStatus === "CONFIRMED") {
      if (Platform.OS === "android") {
        ToastAndroid.show("Order is already confirmed!", ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "info",
          text1: "Already Confirmed",
          text2: "This order has already been confirmed.",
        });
      }
      return;
    }

    try {
      const payload = {
        orderIds: [orderId],
        orderStatus: newStatus,
      };

      await apiClient.patch("api/public/order/updateOrderStatus", payload);

      let message = "";
      let title = "";

      switch (newStatus) {
        case "CONFIRMED":
          title = "Order Confirmed";
          message = "Order confirmed successfully!";
          break;

        case "CANCELLED":
          title = "Order Cancelled";
          message = "Order cancelled successfully!";
          break;

        case "REJECT":
          title = "Order Rejected";
          message = "Order rejected successfully!";
          break;

        case "COMPLETED":
          title = "Order Completed";
          message = "Order completed successfully!";
          break;

        default:
          title = "Status Updated";
          message = "Order status updated successfully!";
      }

      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "success",
          text1: title,
          text2: message,
        });
      }


      if (vendorData?.id) {
        fetchOrders(vendorData.id);
      }
    } catch (error: any) {
      console.error("Order Update Error:", error?.response?.data || error.message);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Failed to update the order. Please try again."
      );
    }
  };

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#40916c" />;
  // }

  const getDateLabel = (dateString: string) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      orderDate.getFullYear() === today.getFullYear() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getDate() === today.getDate()
    ) return "Today";

    if (
      orderDate.getFullYear() === yesterday.getFullYear() &&
      orderDate.getMonth() === yesterday.getMonth() &&
      orderDate.getDate() === yesterday.getDate()
    ) return "Yesterday";

    const day = orderDate.getDate().toString().padStart(2, "0");
    const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
    const year = orderDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#f8fafb] to-[#f0f4f8]">
      {/* HEADER */}
      <AppHeader
        title={`Welcome, ${vendorDetails?.shopName ?? "Vendor"}`}
        rightIcon="🔔"
        leftIcon="menu"
        gradient
        onLeftPress={() => navigation.openDrawer?.()}
        showStats
        statsData={[
          { label: "New Orders", value: "12" },
          { label: "Today's Sales", value: "₹8.5K" },
          { label: "Rating", value: "4.8⭐" },
        ]}
      />

      {/* MAIN CONTENT */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* TODAY'S ORDERS SECTION */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-[16px] font-bold text-gray-900">
                {orders.length > 0 ? getDateLabel(orders[0].createdDate) : "Today's Orders"}
              </Text>
              <View className="h-1 w-12 bg-[#40916c] rounded-full mt-1" />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Orders", { type: "Product" })}
              className="p-2"
            >
              <Text className="text-[#40916c] text-sm font-semibold">View All →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#40916c" />
            </View>
          ) : orders.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center border border-gray-100">
              <Text className="text-5xl mb-3">📋</Text>
              <Text className="text-gray-600 text-center font-medium">No orders yet</Text>
              <Text className="text-gray-400 text-center text-sm mt-1">Your orders will appear here</Text>
            </View>
          ) : (
            orders.map((order, idx) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
                style={{
                  shadowColor: "#40916c",
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("Orders", { orderId: order.id })
                }
              >
                {/* Order Header */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-[13px] text-gray-500 font-medium mb-1">Order ID</Text>
                    <Text className="text-base font-bold text-gray-900">
                      #{order.productOrderId}
                    </Text>
                  </View>

                  <View
                    className="px-4 py-2 rounded-full items-center justify-center"
                    style={{
                      backgroundColor:
                        order.orderStatus === "CONFIRMED"
                          ? "#d4edda"
                          : order.orderStatus === "PENDING"
                            ? "#fff3cd"
                            : order.orderStatus === "DELIVERED" ? "#d4edda"
                              : order.orderStatus === "CANCELLED" ? "#f8d7da"
                                : order.orderStatus === "REJECT"
                                  ? "#f8d7da"
                                  : "#cce5ff",
                    }}
                  >
                    <Text
                      className="text-[12px] font-bold"
                      style={{
                        color:
                          order.orderStatus === "CONFIRMED"
                            ? "#155724"
                            : order.orderStatus === "PENDING"
                              ? "#856404"
                              : order.orderStatus === "CANCELLED" ? "#721c24"
                                : order.orderStatus === "REJECT"
                                  ? "#842029"
                                  : order.orderStatus === "DELIVERED" ? "#155724"
                                    : "#004085",
                      }}
                    >
                      {order.orderStatus}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-gray-100 mb-3" />

                {/* Order Details */}
                <View className="mb-3">
                  <Text className="text-[13px] text-gray-600 mb-2 font-medium">
                    Items: {order.orderDto.map((item) => `${item.quantity}x ${item.productName}`).join(", ")}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Chat", {
                        userName: order.userName,
                        userPhone: order.userPhone,
                      })
                    }
                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", padding: 10, borderRadius: 10, }}
                  >
                    <LinearGradient colors={["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 44, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                        {order.userName ? order.userName.split(" ")[0][0] : "U"}
                        {order.userName?.split(" ")[1]?.[0] || ""}
                      </Text>
                    </LinearGradient>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{order.userName}</Text>
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>📍 {addresses[Number(order.addressId)] || "Loading address..."}</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                      if (!order.userPhone) return;
                      // call logic
                      if (Platform.OS === "android") {
                        ToastAndroid.show(`Call: ${order.userPhone}`, ToastAndroid.SHORT);
                      } else {
                        Toast.show({ type: "info", text1: `Call: ${order.userPhone}` });
                      }
                    }}>
                      <Ionicons name="call-outline" size={22} color="#40916c" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>

                {/* Total Amount */}
                <View className="bg-gradient-to-r from-[#f0f9ff] to-[#e8f5f0] rounded-xl p-3 flex-row justify-between">
                  <Text className="text-[12px] text-gray-600 font-medium mb-1">Total Amount</Text>
                  <Text className="text-[#2d6a4f] text-xl font-black">
                    ₹{order.totalAmount}
                  </Text>
                </View>

                {/* Action Buttons */}
                {order.orderStatus !== "CONFIRMED" && order.orderStatus !== "REJECT" && order.orderStatus !== "CANCELLED" && order.orderStatus !== "DELIVERED" && (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{
                        flex: 0.48,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: "#fee2e2",
                        borderWidth: 1,
                        borderColor: "#fca5a5",
                        alignItems: "center",
                        marginRight: 8,
                      }}
                      onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "REJECT")}
                    >
                      <Text style={{ fontWeight: "bold", color: "#991b1b" }}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 0.48,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: "#40916c",
                        alignItems: "center",
                      }}
                      onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "CONFIRMED")}
                    >
                      <Text style={{ fontWeight: "bold", color: "white" }}>Accept</Text>
                    </TouchableOpacity>
                  </View>

                )}

                {order.orderStatus === "CONFIRMED" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 12,
                    }}
                  >
                    {/* CANCEL BUTTON */}
                    <TouchableOpacity
                      onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "CANCELLED")}
                      style={{
                        flex: 1,
                        marginRight: 6,
                        backgroundColor: "#fee2e2",
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#b91c1c", fontWeight: "700" }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* COMPLETE BUTTON */}
                    <TouchableOpacity
                      onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "DELIVERED")}
                      style={{
                        flex: 1,
                        marginLeft: 6,
                        backgroundColor: "#d1fae5",
                        paddingVertical: 12,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#065f46", fontWeight: "700" }}>Completed</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}


        </View>

        {/* QUICK ACTIONS */}
        <View className="mt-8">
          <View className="mb-5">
            <Text className="text-[16px] font-bold text-gray-900">Quick Actions</Text>
            <View className="h-1 w-12 bg-[#40916c] rounded-full mt-1" />
          </View>

          <View className="flex-row flex-wrap justify-between gap-3">
            {[
              { icon: "📦", title: "Products", subtitle: "Manage inventory", action: () => navigation.navigate("Products",), color: "#fbbf24" },
              { icon: "🛠️", title: "Services", subtitle: "Service catalog", action: () => navigation.navigate("Products", { type: "Service" }), color: "#60a5fa" },
              { icon: "➕", title: "Add Product", subtitle: "List new item", action: () => navigation.navigate("AddProductForm"), color: "#34d399" },
              { icon: "📊", title: "Analytics", subtitle: "View reports", action: () => navigation.navigate("Analytics"), color: "#f472b6" },
            ].map((actionItem, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={actionItem.action}
                className="bg-white rounded-2xl p-5 w-[48%] mb-3 items-center border border-gray-100"
                style={{
                  shadowColor: "#40916c",
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mb-3"
                  style={{ backgroundColor: actionItem.color + "20" }}
                >
                  <Text className="text-2xl">{actionItem.icon}</Text>
                </View>
                <Text className="text-[13px] font-bold text-gray-900 text-center">
                  {actionItem.title}
                </Text>
                <Text className="text-[11px] text-gray-500 text-center mt-1">
                  {actionItem.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View className="mt-8 mb-2">
          <View className="mb-5">
            <Text className="text-[16px] font-bold text-gray-900">Recent Activity</Text>
            <View className="h-1 w-12 bg-[#40916c] rounded-full mt-1" />
          </View>

          {[
            { icon: "⭐", title: "New 5-star review received", time: "2 hours ago", color: "#fbbf24" },
            { icon: "💬", title: "Customer inquiry about fertilizers", time: "4 hours ago", color: "#60a5fa" },
            { icon: "✅", title: "Order #8895 completed", time: "6 hours ago", color: "#34d399" },
          ].map((activity, index) => (
            <View
              key={index}
              className="flex-row bg-white rounded-2xl p-4 mb-3 items-center border border-gray-100"
              style={{
                shadowColor: "#40916c",
                shadowOpacity: 0.06,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-lg items-center justify-center mr-4"
                style={{ backgroundColor: activity.color + "15" }}
              >
                <Text className="text-xl">{activity.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-semibold text-gray-900 mb-1">
                  {activity.title}
                </Text>
                <Text className="text-[11px] text-gray-400">{activity.time}</Text>
              </View>
              <Text className="text-gray-300 text-lg">→</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
