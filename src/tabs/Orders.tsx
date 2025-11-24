import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppHeader from "../utils/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import apiClient from "../api/apiBaseUrl";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/core";
import Toast from "react-native-toast-message";
import { useVendor } from "../context/VendorContext";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, TouchableWithoutFeedback } from 'react-native';


interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  deliveryCharge: number;
}

interface Order {
  id: number;
  productOrderId: string;
  createdDate: string;
  orderStatus: string;
  userName: string;
  addressId: string | number;
  totalAmount: number;
  orderDto?: OrderItem[];
  userPhone?: string;
  deliveryCharge?: number;
  gst?: number;
  isService?: boolean;
}

interface TabCounts {
  All: number;
  PENDINGREQUEST: number;
  CONFIRMED: number;
  REJECT: number;
  PROCESSING: number;
  DELIVERED: number;
  CANCELLED: number;
}


type OrdersScreenParams = {
  type?: "Product" | "Service";
};

const OrdersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<any>();
  const [tabCounts, setTabCounts] = useState<TabCounts>({
    All: 0,
    CONFIRMED: 0,
    PENDINGREQUEST: 0,
    PROCESSING: 0,
    DELIVERED: 0,
    REJECT: 0,
    CANCELLED: 0,
  });
  const { vendorData } = useVendor();
  const [addresses, setAddresses] = useState<{ [key: number]: string }>({});
  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<Record<string, OrdersScreenParams>, string>>();
  useEffect(() => {
    if (route?.params?.type) {
      setSelectedType(route.params.type);
    }
  }, [route]);

  useEffect(() => {
    // load recent searches for current vendor
    const loadRecent = async () => {
      try {
        const key = `recentSearches:${vendorData?.id ?? 'global'}`;
        const raw = await AsyncStorage.getItem(key);
        if (raw) setRecentSearches(JSON.parse(raw));
        else setRecentSearches([]);
      } catch (e) {
        console.warn('Failed to load recent searches', e);
        setRecentSearches([]);
      }
    };
    loadRecent();
  }, [vendorData?.id]);

  const saveRecent = async (q: string) => {
    try {
      const trimmed = q?.trim();
      if (!trimmed) return;
      const key = `recentSearches:${vendorData?.id ?? 'global'}`;
      setRecentSearches((prev) => {
        const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 6);
        AsyncStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.warn('Failed to save recent search', e);
    }
  };

  const clearRecent = async () => {
    try {
      const key = `recentSearches:${vendorData?.id ?? 'global'}`;
      await AsyncStorage.removeItem(key);
      setRecentSearches([]);
    } catch (e) {
      console.warn('Failed to clear recent searches', e);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchFocus = () => setShowRecent(true);
  const handleSearchBlur = () => {

    setTimeout(() => setShowRecent(false), 150);
  };

  const handleSearchSubmit = () => {
    saveRecent(searchQuery);
    setShowRecent(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (vendorData?.id) {
        fetchOrders(vendorData.id);
      }
    }, [vendorData])
  );

  const fetchOrders = async (vendorId: string) => {
    try {
      setLoading(true);

      const safeDate = (d: any) => {
        const time = new Date(d).getTime();
        return isNaN(time) ? 0 : time;
      };

      // Fetch product orders
      const ordersResponse = await apiClient.get<Order[]>(
        `api/public/order/getAll?vendorId=${vendorId}`
      );
      let fetchedOrders = ordersResponse.data || [];
      fetchedOrders = fetchedOrders.filter((o) => o.orderStatus !== "PENDING_PAYMENT");

      // Fetch service bookings
      // Fetch service bookings
      const serviceResponse = await apiClient.get<any[]>(
        `api/public/serviceBooking/getAll?vendorId=${vendorId}`
      );
      const serviceBookings = serviceResponse.data || [];

      // Filter out PENDING_PAYMENT services
      const serviceBookingsFiltered = serviceBookings.filter(
        (s) => s.orderStatus !== "PENDING_PAYMENT"
      );

      // Map services
      const mappedServices: Order[] = serviceBookingsFiltered.map((s) => ({
        id: s.id,
        productOrderId: s.serviceBookingId || `SB-${s.id}`,
        createdDate: s.createdDate,
        orderStatus: s.orderStatus,
        userName: s.userName || "Service User",
        userPhone: s.userPhone,
        totalAmount: s.totalAmount,
        orderDto: [
          {
            productName: `${s.serviceName}`,
            quantity: 1,
            price: s.totalAmount,
            deliveryCharge: 0,
          },
        ],
        addressId: s.addressId,
        gst: s.gst || 0,
        isService: true,
      }));


      const allOrders = [...fetchedOrders, ...mappedServices];

      const sortedOrders = allOrders.sort((a, b) => {
        const dateDiff = safeDate(b.createdDate) - safeDate(a.createdDate);
        if (dateDiff !== 0) return dateDiff;
        return b.id - a.id;
      });

      setOrders(sortedOrders);


      sortedOrders.forEach((order) => {
        if (order.addressId) fetchAddress(Number(order.addressId));
      });

      // Keep original overall counts (optional)
      const counts: TabCounts = {
        All: sortedOrders.length,
        PENDINGREQUEST: sortedOrders.filter((o) => o.orderStatus === "ORDER_REQUESTED").length,
        CONFIRMED: sortedOrders.filter((o) => o.orderStatus === "CONFIRMED").length,
        REJECT: sortedOrders.filter((o) => o.orderStatus === "REJECT").length,
        PROCESSING: sortedOrders.filter((o) => o.orderStatus === "PROCESSING").length,
        DELIVERED: sortedOrders.filter((o) => o.orderStatus === "DELIVERED").length,
        CANCELLED: sortedOrders.filter((o) => o.orderStatus === "CANCELLED").length,
      };
      setTabCounts(counts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateOrderStatus = async (
    orderId: number,
    currentStatus: string,
    newStatus: string,
    isService?: boolean
  ) => {
    try {
      let payload;
      let endpoint = "";

      if (isService) {
        // === SERVICE UPDATE === //
        payload = {
          serviceBookingIds: [orderId],
          bookingOrderStatus: newStatus,
        };
        console.log("Services Payload:", payload)
        endpoint = "api/public/serviceBooking/updateBookingStatus";
      } else {
        // === PRODUCT UPDATE === //
        payload = {
          orderIds: [orderId],
          orderStatus: newStatus,
        };
        endpoint = "api/public/order/updateOrderStatus";
      }

      await apiClient.patch(endpoint, payload);

      // SUCCESS TOAST
      const msg = isService
        ? `Service booking ${newStatus.toLowerCase()} successfully`
        : `Order ${newStatus.toLowerCase()} successfully`;

      if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: msg,
        });
      }

      if (vendorData?.id) fetchOrders(vendorData.id);
    } catch (error: any) {
      console.log("Update Error:", error?.response?.data);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update status"
      );
    }
  };




  // filter by type (product/service) first
  let typeFilteredOrders = orders;
  if (selectedType === "Product") {
    typeFilteredOrders = orders.filter((o) => !o.isService);
  } else if (selectedType === "Service") {
    typeFilteredOrders = orders.filter((o) => o.isService);
  }

  // compute counts based on selectedType (important fix)
  const filteredTabCounts: TabCounts = {
    All: typeFilteredOrders.length,
    PENDINGREQUEST: typeFilteredOrders.filter((o) => o.orderStatus === "ORDER_REQUESTED").length,
    CONFIRMED: typeFilteredOrders.filter((o) => o.orderStatus === "CONFIRMED").length,
    REJECT: typeFilteredOrders.filter((o) => o.orderStatus === "REJECT").length,
    PROCESSING: typeFilteredOrders.filter((o) => o.orderStatus === "PROCESSING").length,
    DELIVERED: typeFilteredOrders.filter((o) =>
      selectedType === "Service"
        ? o.orderStatus === "COMPLETED"
        : o.orderStatus === "DELIVERED"
    ).length,
    CANCELLED: typeFilteredOrders.filter((o) => o.orderStatus === "CANCELLED").length,
  };

  // now apply the active status tab on the type-filtered list
  let filteredOrders: Order[] = [];

  if (activeTab === "All") {
    filteredOrders = typeFilteredOrders;
  } else if (activeTab === "PENDINGREQUEST") {
    filteredOrders = typeFilteredOrders.filter((o) => o.orderStatus === "ORDER_REQUESTED");
  } else if (activeTab === "DELIVERED") {
    filteredOrders = typeFilteredOrders.filter((o) =>
      selectedType === "Service"
        ? o.orderStatus === "COMPLETED"
        : o.orderStatus === "DELIVERED"
    );
  } else {
    filteredOrders = typeFilteredOrders.filter((o) => o.orderStatus === activeTab);
  }

  // Apply text search on top of the current filteredOrders
  const finalOrders = searchQuery?.trim()
    ? filteredOrders.filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        String(o.productOrderId || "").toLowerCase().includes(q) ||
        String(o.userName || "").toLowerCase().includes(q) ||
        String(o.userPhone || "").toLowerCase().includes(q)
      );
    })
    : filteredOrders;



  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDateLabel = (dateString: string) => {
    const orderDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      orderDate.getFullYear() === today.getFullYear() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getDate() === today.getDate()
    )
      return "Today";

    if (
      orderDate.getFullYear() === yesterday.getFullYear() &&
      orderDate.getMonth() === yesterday.getMonth() &&
      orderDate.getDate() === yesterday.getDate()
    )
      return "Yesterday";

    const day = orderDate.getDate().toString().padStart(2, "0");
    const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
    const year = orderDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

  const groupedOrders = finalOrders.reduce((groups: any, order) => {
    const dateLabel = getDateLabel(order.createdDate);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(order);
    return groups;
  }, {});

  const dateKeys = Object.keys(groupedOrders);

  const formatTabLabel = (label: string) => {
    if (selectedType === "Service" && label === "DELIVERED") return "Completed";
    return label === "PENDINGREQUEST"
      ? "Pending Request"
      : label.charAt(0) + label.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchAddress(orders[0]?.addressId as number);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <AppHeader
        title="Orders"
        showBack={false}
        leftIcon="arrow-back"
        rightIcon="settings-outline"
        showSearch
        searchPlaceholder="Search by order ID, customer name..."
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onSearchBlur={handleSearchBlur}
        onSearchSubmit={handleSearchSubmit}
        onRightPress={() => navigation.navigate("Settings")}
      />

      {/* Recent searches modal-like overlay to avoid layout overlap */}
      {showRecent && recentSearches.length > 0 && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowRecent(false)}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 999 }} />
          </TouchableWithoutFeedback>

          <View style={{ position: 'absolute', top: insets.top + 110, left: 12, right: 12, zIndex: 1000 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 6, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 6, marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '700' }}>Recent searches</Text>
                {/* <TouchableOpacity onPress={clearRecent}>
                  <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>Clear</Text>
                </TouchableOpacity> */}
              </View>
              {recentSearches.map((item, idx) => (
                <View key={idx} style={{ borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: '#eef2f7' }}>
                  <TouchableOpacity
                    onPress={() => { setSearchQuery(item); saveRecent(item); setShowRecent(false); }}
                    style={{ paddingVertical: 10, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={18} color="#9ca3af" />
                      <Text style={{ marginLeft: 10, color: '#111827' }}>{item}</Text>
                    </View>
                    <TouchableOpacity onPress={async () => {
                      try {
                        const key = `recentSearches:${vendorData?.id ?? 'global'}`;
                        const next = recentSearches.filter((s) => s !== item);
                        await AsyncStorage.setItem(key, JSON.stringify(next));
                        setRecentSearches(next);
                      } catch (e) { console.warn(e); }
                    }}>
                      <Text style={{ color: '#9ca3af', fontWeight: '700' }}>Remove</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      <View style={{ backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e6edf0" }}>
        <View style={{ flexDirection: "row" }}>
          {/* PRODUCT BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setSelectedType("Product");
              setActiveTab("All");
            }}
            style={{
              flex: 1,
              marginRight: 8,
              borderRadius: 12,
              paddingVertical: 12,
              borderWidth: 2,
              borderColor: selectedType === "Product" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Product" ? "#ecfdf3" : "#fff",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: selectedType === "Product" ? "#15803d" : "#334155" }}>🌿 Product</Text>
          </TouchableOpacity>

          {/* SERVICE BUTTON */}
          <TouchableOpacity
            onPress={() => {
              setSelectedType("Service");
              setActiveTab("All");
            }}
            style={{
              flex: 1,
              marginLeft: 8,
              borderRadius: 12,
              paddingVertical: 12,
              borderWidth: 2,
              borderColor: selectedType === "Service" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Service" ? "#ecfdf3" : "#fff",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "600", color: selectedType === "Service" ? "#15803d" : "#334155" }}>🛠️ Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e6edf0" }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {Object.keys(filteredTabCounts).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(key)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderBottomWidth: activeTab === key ? 3 : 0,
                borderBottomColor: activeTab === key ? "#40916c" : "transparent",
                marginRight: 12,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: activeTab === key ? "#40916c" : "#374151", marginRight: 8 }}>
                  {formatTabLabel(key)}
                </Text>
                <View style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: activeTab === key ? "#40916c" : "#e5e7eb",
                }}>
                  <Text style={{ color: activeTab === key ? "#fff" : "#374151", fontWeight: "700", fontSize: 12 }}>
                    {filteredTabCounts[key as keyof typeof filteredTabCounts]}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.View
        key={selectedType + activeTab}
        entering={SlideInRight.duration(250)}
        exiting={SlideOutLeft.duration(200)}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(20, insets.bottom) }}>
          {loading ? (
            <ActivityIndicator size="large" color="#40916c" style={{ marginTop: 40 }} />
          ) : dateKeys.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#9ca3af", fontSize: 16 }}>No orders found.</Text>
            </View>
          ) : (
            dateKeys.map((dateKey) => (
              <View key={dateKey}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginTop: 16, marginLeft: 12 }}>{dateKey}</Text>

                {groupedOrders[dateKey].map((order: Order) => (
                  <View key={order.id} style={{ marginBottom: 8, marginTop: 8, paddingHorizontal: 12 }}>
                    <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, borderLeftWidth: 4, shadowColor: "#000", shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1, borderLeftColor: order.isService ? "#ffa94d" : "#40916c" }}>
                      {/* TOP HEADER */}
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <View>
                          <Text style={{ fontSize: 15, fontWeight: "800", color: "#0f172a" }}>#{order.productOrderId}</Text>
                          <Text style={{ fontSize: 12, color: "#6b7280" }}>{formatTime(order.createdDate)}</Text>
                        </View>

                        {/* STATUS BADGE */}
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 999,
                            backgroundColor:
                              order.orderStatus === "PENDING"
                                ? "#fff3cd"
                                : order.orderStatus === "PROCESSING"
                                  ? "#d1ecf1"
                                  : order.orderStatus === "READY" || order.orderStatus === "CONFIRMED"
                                    ? "#d4edda"
                                    : order.orderStatus === "REJECT"
                                      ? "#f8d7da"
                                      : order.orderStatus === "CANCELLED"
                                        ? "#f8d7da"
                                        : order.orderStatus === "DELIVERED" ||
                                          order.orderStatus === "COMPLETED"
                                          ? "#d4edda"
                                          : order.orderStatus === "ORDER_REQUESTED"
                                            ? "#cce5ff"
                                            : "#f3f4f6",
                          }}
                        >

                          <Text style={{
                            fontSize: 11, fontWeight: "700", color:
                              order.orderStatus === "PENDING" ? "#856404" :
                                order.orderStatus === "PROCESSING" ? "#0c5460" :
                                  order.orderStatus === "READY" || order.orderStatus === "CONFIRMED" ? "#155724" :
                                    order.orderStatus === "REJECT" ? "#721c24" :
                                      order.orderStatus === "CANCELLED" ? "#721c24" :
                                        order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED" ? "#155724" :
                                          order.orderStatus === "ORDER_REQUESTED" ? "#004085" : "#374151"
                          }}>
                            {order.isService && order.orderStatus === "DELIVERED"
                              ? "Completed"
                              : order.orderStatus}
                          </Text>
                        </View>
                      </View>

                      {/* CUSTOMER INFO */}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Chat", {
                            userName: order.userName,
                            userPhone: order.userPhone,
                          })
                        }
                        style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", padding: 10, borderRadius: 10, marginBottom: 8 }}
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

                      {/* ITEMS */}
                      {order.orderDto && (
                        <View style={{ marginBottom: 6 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "700",
                              color: order.isService ? "#9a3412" : "#1e3a8a",
                              backgroundColor: order.isService ? "#fff4e6" : "#e7f5ff",
                              width: "100%",
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              borderRadius: 8,
                              marginBottom: 6,
                              // textAlign: "center",      
                            }}
                          >
                            {order.isService ? "🛠 Service" : "🌿 Products"}
                          </Text>


                          {order.orderDto.map((item, idx) => (
                            <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#eef2f7", paddingVertical: 6 }}>
                              <Text style={{ flex: 1, color: "#111827", fontSize: 13 }}>{item.productName}</Text>
                              {!order.isService && (
                                <Text style={{ color: "#6b7280", marginHorizontal: 8 }}>x{item.quantity}</Text>
                              )}
                              <Text style={{ fontWeight: "700", color: "#111827" }}>₹{item.price}</Text>
                            </View>
                          ))}
                        </View>
                      )}


                      {/* PRICE SUMMARY — SHOW ONLY IN PRODUCT MODE */}
                      {!order.isService && (
                        <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: "#eef2f7", paddingTop: 8 }}>

                          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                            <Text style={{ color: "#6b7280" }}>SubTotal</Text>
                            <Text style={{ fontWeight: "600", color: "#111827" }}>
                              ₹{order.orderDto?.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                            <Text style={{ color: "#6b7280" }}>Delivery Charge</Text>
                            <Text style={{ fontWeight: "600", color: "#111827" }}>
                              ₹{order.orderDto?.[0]?.deliveryCharge || 0}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                            <Text style={{ color: "#6b7280" }}>GST</Text>
                            <Text style={{ fontWeight: "600", color: "#111827" }}>₹{order.gst || 0}</Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 8,
                              paddingTop: 8,
                              borderTopWidth: 1,
                              borderTopColor: "#e6eef3",
                            }}
                          >
                            <Text style={{ fontSize: 15, fontWeight: "700", color: "#111827" }}>Total Amount</Text>
                            <Text style={{ fontSize: 15, fontWeight: "900", color: "#40916c" }}>
                              ₹{order.totalAmount}
                            </Text>
                          </View>

                        </View>
                      )}


                      {/* ACTIONS */}
                      {order.orderStatus !== "CONFIRMED" && order.orderStatus !== "REJECT" && order.orderStatus !== "CANCELLED" && order.orderStatus !== "DELIVERED" && order.orderStatus !== "COMPLETED" && (
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                          <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#fee2e2", borderColor: "#fca5a5", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginRight: 8 }}
                            onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "REJECT", order.isService)}

                          >
                            <Text style={{ fontWeight: "bold", color: "#991b1b" }}>Reject</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ flex: 1, backgroundColor: "#40916c", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginLeft: 8 }}
                            onPress={() =>
                              handleUpdateOrderStatus(order.id, order.orderStatus, "CONFIRMED", order.isService)
                            }
                          >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* ACTION BUTTONS FOR CONFIRMED STATUS */}
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
                            onPress={() => handleUpdateOrderStatus(order.id, order.orderStatus, "CANCELLED", order.isService)}
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
                            onPress={() =>
                              handleUpdateOrderStatus(
                                order.id,
                                order.orderStatus,
                                order.isService ? "COMPLETED" : "DELIVERED",
                                order.isService
                              )
                            }
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

                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView >
  );
};

export default OrdersScreen;
