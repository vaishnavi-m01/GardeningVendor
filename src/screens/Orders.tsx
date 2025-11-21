import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Modal, ActivityIndicator, TouchableWithoutFeedback, ToastAndroid, Animated } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import { useVendor } from "../context/VendorContext";
import LinearGradient from "react-native-linear-gradient";
import apiClient from "../api/apiBaseUrl";
import Toast from "react-native-toast-message";
import GradientHeader from "../utils/GradientHeader";

type OrdersScreenParams = {
    type?: "Product" | "Service";
};
type OrderItem = {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    deliveryCharge?: number;
};

type Order = {
    id: number;
    productOrderId: string;
    userName: string;
    totalAmount: number;
    userPhone?: string;
    addressId?: number;
    gst?: number;
    isService?: boolean;
    orderStatus: string;
    orderDto?: OrderItem[];
};

type ServiceBooking = {
    id: number;
    serviceBookingId: string;
    serviceName: string;
    userName: string;
    createdDate: string;
    bookingStatus: string;
    totalAmount: number;
    addressName1?: string;
    addressName2?: string;
    userPhone?: string;
    orderStatus: string;
};

const Orders = () => {
    const navigation = useNavigation<any>();
    const { vendorData } = useVendor();
    const [range, setRange] = useState("today");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<{ [key: number]: string }>({});
    const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [statusData, setStatusData] = useState<any>([]);

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.96, duration: 90, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
        ]).start();
    };

    const handleSlicePress = (idx: number, item: any) => {
        const next = selectedSlice === idx ? null : idx;
        setSelectedSlice(next);
        animatePress();
    };



    const formatDate = (d: string) => new Date(d).toLocaleDateString();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [selectedServicesbookings, setSelectedbookings] = useState<ServiceBooking | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [servicesModal, setServicesModal] = useState(false);

    const [keyMetrics, setKeyMetrics] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        rejectedOrders: 0,
    });

    const metrics = selectedType === "Service"
        ? {
            total: keyMetrics.totalOrders,
            confirmed: keyMetrics.confirmedOrders,
            completed: keyMetrics.completedOrders,
            pending: keyMetrics.pendingOrders,
            cancelled: keyMetrics.cancelledOrders,
            rejected: keyMetrics.rejectedOrders,
            growth: "+15%",
        }
        : {
            total: keyMetrics.totalOrders,
            confirmed: keyMetrics.confirmedOrders,
            completed: keyMetrics.completedOrders,
            pending: keyMetrics.pendingOrders,
            cancelled: keyMetrics.cancelledOrders,
            rejected: keyMetrics.rejectedOrders,
            growth: "+15%",
        };


    const route = useRoute<RouteProp<Record<string, OrdersScreenParams>, string>>();
    useEffect(() => {
        if (route?.params?.type) {
            setSelectedType(route.params.type);
        }
    }, [route]);


    const isProduct = selectedType === "Product";
    const gradientColors = isProduct ? ["#10b981", "#059669"]
        : ["#fde68a", "#fbbf24"];
    const labelColor = isProduct ? "#ffffff" : "#78350f";
    const growthColor = isProduct ? "#ffffff" : "#92400e";
    const iconBackground = isProduct ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)";
    const iconName = isProduct ? "calendar" : "trending-up";


    const statusItems = [
        { key: "Completed", icon: "checkmark-done-circle-outline", color: "#10b981", count: metrics.completed },
        { key: "Confirmed", icon: "checkmark-circle-outline", color: "#10b981", count: metrics.confirmed },
        { key: "Pending", icon: "time-outline", color: "#f59e0b", count: metrics.pending },
        { key: "Cancelled", icon: "close-circle-outline", color: "#ef4444", count: metrics.cancelled },
        { key: "Rejected", icon: "alert-circle-outline", color: "#f87171", count: metrics.rejected },
    ];


    const EMPTY_STATUS_DATA = [
        { value: 0, color: "#10b981", text: "Completed" },
        { value: 0, color: "#34d399", text: "Confirmed" },
        { value: 0, color: "#fbbf24", text: "Pending" },
        { value: 0, color: "#f87171", text: "Cancelled" },
        { value: 0, color: "#f871b6", text: "Rejected" },
    ];



    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return { bg: "bg-green-50", text: "text-emerald-600" };
            case "PENDING":
                return { bg: "bg-amber-50", text: "text-amber-600" };
            case "CANCELLED":
                return { bg: "bg-red-50", text: "text-red-600" };
            case "DELIVERED":
                return { bg: "bg-green-50", text: "text-green-600" };
            case "REJECT":
                return { bg: "bg-pink-50", text: "text-pink-600" };
            case "COMPLETED":
                return { bg: "bg-green-50", text: "text-green-600" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-500" };
        }
    };

    //fetchDashboardCount
    const fetchDashboardCounts = async () => {
        try {
            const response = await apiClient.get(
                `/api/public/dashboard/totalStatusCounts?vendorId=${vendorData?.id}`
            );

            const bookings = response.data.counts[0];
            const orders = response.data.counts[1];

            const isService = selectedType === "Service";

            // 1️⃣ Extract percentages safely
            const percentageData = isService
                ? bookings.bookingPercentage
                : orders.orderPercentage;


            setKeyMetrics({
                totalOrders: isService ? bookings.totalBookings : orders.totalOrders,
                pendingOrders: isService ? bookings.pendingBookings : orders.pendingOrders,
                confirmedOrders: isService ? bookings.confirmedBookings : orders.confirmedOrders,
                cancelledOrders: isService ? bookings.cancelledBookings : orders.cancelledOrders,
                completedOrders: isService ? bookings.completedBookings : orders.completedOrders,
                rejectedOrders: isService ? bookings.rejectedBookings : orders.rejectedOrders,
            });

            const safeNumber = (value?: string) => {
                if (!value) return 0;
                return parseFloat(value.replace("%", "")) || 0;
            };



            // 3️⃣ Update pie chart dataset
            setStatusData([
                { value: safeNumber(percentageData.completed), color: "#10b981", text: "Completed" },
                { value: safeNumber(percentageData.confirmed), color: "#34d399", text: "Confirmed" },
                { value: safeNumber(percentageData.pending), color: "#fbbf24", text: "Pending" },
                { value: safeNumber(percentageData.cancelled), color: "#f87171", text: "Cancelled" },
                { value: safeNumber(percentageData.rejected), color: "#f871b6", text: "Rejected" },
            ]);
        } catch (err) {
            console.log("Error fetching dashboard counts:", err);
        }
    };


    useEffect(() => {
        fetchDashboardCounts();
    }, [selectedType]);




    const fetchAddress = async (addressId: number) => {
        const response = await apiClient.get(`api/public/address/getOne/${addressId}`);
        const addr = response.data;
        const addressString = `${addr.addressLine1}, ${addr.city}, ${addr.state}, ${addr.country}`;
        setAddresses((prev) => ({ ...prev, [addressId]: addressString }));
    };


    const fetchOrdersData = async () => {
        try {
            const response = await apiClient.get(`/api/public/order/getAll?userId=${vendorData?.id}`);
            console.log("Orders data:", response.data);

            // Sort by createdDate descending
            const sortedOrders = response.data.sort(
                (a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
            );

            // Take latest 4 orders
            const latestOrders = sortedOrders.slice(0, 4).map((order: any) => ({
                id: order.id,
                customer: order.userName,
                status: order.orderStatus,
                amount: order.totalAmount,
            }));

            setRecentOrders(latestOrders);
            latestOrders.forEach((order: any) => {
                if (order.addressId) fetchAddress(Number(order.addressId));
            });
        } catch (error) {
            console.log("Error fetching orders data:", error);
        }
    };


    useEffect(() => {
        fetchOrdersData();
    }, []);

    const handleOpenModal = async (orderId: number) => {
        setLoading(true);
        setModalVisible(true);
        try {
            const response = await apiClient.get(`/api/public/order/getOne/${orderId}`);
            setSelectedOrder(response.data);

            if (response.data.addressId) {
                fetchAddress(response.data.addressId);
            }
        } catch (error) {
            console.log("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleCloseModal = () => {
        setSelectedOrder(null);
        setModalVisible(false);
    };



    const fetchServiceBookings = async (vendorId: string) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/public/serviceBooking/getAll?vendorId=${vendorId}`);

            const sortedBookings = response.data.sort(
                (a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
            );

            const latestBookings = sortedBookings.slice(0, 4);


            const formattedBookings: ServiceBooking[] = latestBookings.map((b: any) => ({
                id: b.id,
                bookingId: b.serviceBookingId,
                serviceName: b.serviceName,
                userName: b.userName,
                bookingDate: b.createdDate,
                bookingStatus: b.orderStatus,
                totalAmount: b.totalAmount,
                description: `${b.addressName1}, ${b.addressName2}`,
            }));

            setBookings(formattedBookings);
        } catch (e) {
            console.error("Error fetching service bookings:", e);
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            if (vendorData?.id) {
                fetchServiceBookings(vendorData.id);
            } else {
                fetchServiceBookings("");
            }
        }, [vendorData])
    );

    const handleOpenServicesModal = async (bookingsId: number) => {
        setLoading(true);
        setServicesModal(true);

        try {
            const response = await apiClient.get(`api/public/serviceBooking/getOne/${bookingsId}`);
            setSelectedbookings(response.data);
        } catch (error) {
            console.log("Error fetching service booking details:", error);
        } finally {
            setLoading(false);
        }
    }


    const handleCloseServicesModal = () => {
        setSelectedbookings(null);
        setServicesModal(false);
    };


    return (
        <View className="flex-1">

            <GradientHeader
                title={selectedType === "Product" ? "Orders" : "Service Bookings"}
                onBack={() => navigation.goBack()}
            />
            <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
                {/* Header */}

                <View style={{ backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e6edf0" }}>
                    <View style={{ flexDirection: "row" }}>
                        {/* PRODUCT BUTTON */}
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedType("Product");
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
                                // setActiveTab("All");
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

                <View className="bg-gray-50 px-4 pt-5 pb-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="mb-4">
                            <Text
                                className={`text-lg font-extrabold ${selectedType === "Service" ? "text-[#0f172a]" : "text-gray-900"
                                    }`}
                            >
                                {selectedType === "Service" ? "Service Bookings" : "Orders"}
                            </Text>

                            <Text
                                className={`mt-1 text-xs ${selectedType === "Service" ? "text-gray-400" : "text-gray-500"
                                    }`}
                            >
                                {selectedType === "Service"
                                    ? "Overview of service appointments"
                                    : "Monitor and manage all customer orders"}
                            </Text>
                        </View>

                        <View className="w-[155px]">
                            <View className="bg-white rounded-xl px-2 h-11 justify-center border border-gray-200 overflow-hidden">
                                <Picker
                                    selectedValue={range}
                                    onValueChange={(v) => setRange(v)}
                                    dropdownIconColor="#16a34a"
                                    style={{ height: 55, width: "100%", color: "#111827" }}
                                    mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                                >
                                    <Picker.Item label="Today" value="today" />
                                    <Picker.Item label="This Week" value="weekly" />
                                    <Picker.Item label="This Month" value="monthly" />
                                    <Picker.Item label="This Year" value="yearly" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-4 pt-5">
                    {/* Total Orders Card */}
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 16,
                            padding: 24,
                            marginBottom: 28,
                        }}
                    >
                        {/* Title */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    color: labelColor,
                                    fontSize: 13,
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                }}
                            >
                                {isProduct
                                    ? "TOTAL ORDERS"
                                    : selectedType === "Service"
                                        ? "TOTAL SERVICE BOOKINGS"
                                        : "TOTAL ORDERS"}
                            </Text>

                            <Text
                                style={{
                                    color: labelColor,
                                    fontSize: 34,
                                    fontWeight: "800",
                                    marginTop: 8,
                                }}
                            >
                                {metrics.total}
                            </Text>
                        </View>

                        {/* Growth section */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        backgroundColor: iconBackground,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 8,
                                    }}
                                >
                                    <Ionicons name={iconName} size={18} color={growthColor} />
                                </View>
                                <Text style={{ color: growthColor, fontSize: 14, fontWeight: "600" }}>
                                    {metrics.growth}
                                </Text>
                            </View>

                            <Text style={{ color: growthColor, fontSize: 12, fontWeight: "500" }}>
                                vs last period
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Order Status */}
                    <View className="mb-10">
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-gray-900 text-lg font-extrabold">
                                {selectedType === "Service" ? "Service Booking Status" : "Order Status"}
                            </Text>

                            <TouchableOpacity>
                                <Text className="text-amber-500 text-xs font-bold">View all</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginHorizontal: 0, paddingVertical: 8 }}
                        >
                            {statusItems.map((status) => (
                                <View
                                    key={status.key}
                                    className="bg-white rounded-xl p-2 mr-3 border border-gray-200 flex-row justify-between items-center"
                                    style={{ minWidth: 180 }}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-13 h-13 rounded-xl justify-center items-center mr-4"
                                            style={{ backgroundColor: `${status.color}20` }}
                                        >
                                            <Ionicons name={status.icon} size={26} color={status.color} />
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">
                                                {status.key}
                                            </Text>
                                            <Text className="text-green-950 text-xl font-extrabold mt-1">
                                                {status.count}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        className="px-3 py-2 rounded-lg"
                                        style={{ backgroundColor: `${status.color}20` }}
                                    >
                                        <Text
                                            className="text-[14px] font-extrabold"
                                            style={{ color: status.color }}
                                        >
                                            {Math.round((status.count / metrics.total) * 100)}%
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>


                    </View>

                    {/* Distribution Chart */}
                    <View className="mb-10">
                        <Text className="text-gray-900 text-lg font-extrabold mb-5">Order Summary</Text>
                        <View className="bg-white rounded-2xl p-6 border border-gray-200 items-center">
                            <View style={{ position: 'relative' }}>
                                <TouchableWithoutFeedback onPress={() => setSelectedSlice(null)}>
                                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                        <PieChart
                                            data={(statusData.length > 0 ? statusData : EMPTY_STATUS_DATA).map((item: any, idx: number) => ({
                                                ...item,
                                                value: item.value,
                                                color: item.color,
                                                text: `${item.value}%`,
                                                focused: selectedSlice === idx,
                                                shadowColor: selectedSlice === idx ? item.color : 'transparent',
                                                shadowRadius: selectedSlice === idx ? 12 : 0,
                                                onPress: () => handleSlicePress(idx, item),
                                            }))}
                                            donut
                                            radius={90}
                                            innerRadius={65}
                                            focusOnPress
                                            showText={false}
                                            showTextBackground={false}
                                            textColor="#111827"
                                            textSize={13}
                                        />

                                    </Animated.View>
                                </TouchableWithoutFeedback>

                                {selectedSlice !== null && (() => {
                                    const item = (statusData.length > 0 ? statusData : EMPTY_STATUS_DATA)[selectedSlice];

                                    const sliceCounts = [
                                        metrics.completed,
                                        metrics.confirmed,
                                        metrics.pending,
                                        metrics.cancelled,
                                        metrics.rejected,
                                    ];

                                    return (
                                        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: '#fff', padding: 8, borderRadius: 999, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '800', color: item.color }}>
                                                    {sliceCounts[selectedSlice]}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                                                    {item.text}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })()}

                            </View>

                            <View className="mt-7 w-full space-y-3">
                                {statusData.map((item: any, idx: any) => (
                                    <View key={idx} className="flex-row justify-between items-center px-1">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-2.5 h-2.5 rounded-sm mr-3" style={{ backgroundColor: item.color }} />
                                            <Text className="text-gray-500 text-[14px] font-semibold">{item.text}</Text>
                                        </View>
                                        <Text className="text-gray-900 text-[14px] font-extrabold">{item.value}%</Text>
                                    </View>
                                ))}

                            </View>
                        </View>
                    </View>

                    {/* Recent Orders */}
                    <View className="mb-6">

                        <Modal visible={modalVisible} animationType="fade" transparent={true}>
                            <TouchableWithoutFeedback onPress={handleCloseModal}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: 16,
                                    }}
                                >
                                    <TouchableWithoutFeedback>
                                        <View
                                            style={{
                                                width: "100%",
                                                maxWidth: 380,
                                                maxHeight: "80%",
                                                backgroundColor: "#fff",
                                                borderRadius: 16,
                                                padding: 16,
                                            }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="large" color="#40916c" style={{ marginTop: 40 }} />
                                            ) : selectedOrder ? (
                                                <ScrollView showsVerticalScrollIndicator={false}>
                                                    <View className="flex-row justify-between items-center mb-3">
                                                        {/* Order ID */}
                                                        <View>
                                                            <Text className="text-[13px] text-gray-500 font-medium mb-1">Order ID</Text>
                                                            <Text className="text-base font-bold text-gray-900">
                                                                #{selectedOrder.productOrderId}
                                                            </Text>
                                                        </View>


                                                        {/* Order Status */}
                                                        <View
                                                            className={`px-4 py-2 rounded-full items-center justify-center ${getStatusColor(selectedOrder?.orderStatus || "").bg}`}
                                                        >
                                                            <Text
                                                                className={`text-[12px] font-bold ${getStatusColor(selectedOrder?.orderStatus || "").text}`}
                                                            >
                                                                {selectedOrder?.orderStatus || "N/A"}
                                                            </Text>
                                                        </View>


                                                        {/* Cancel Icon */}
                                                        {/* <TouchableOpacity onPress={handleCloseModal} style={{ marginLeft: 8 }}>
                                                        <Ionicons name="close" size={24} color="#333" />
                                                    </TouchableOpacity> */}
                                                    </View>


                                                    {/* Divider */}
                                                    <View className="h-[1px] bg-gray-100 mb-3" />

                                                    {/* Customer Info */}
                                                    <View className="mb-3">
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                navigation.navigate("Chat", {
                                                                    userName: selectedOrder.userName,
                                                                    userPhone: selectedOrder.userPhone,
                                                                })
                                                            }
                                                            style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", padding: 10, borderRadius: 10, }}
                                                        >
                                                            <LinearGradient colors={["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 44, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
                                                                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                                                                    {selectedOrder.userName ? selectedOrder.userName.split(" ")[0][0] : "U"}
                                                                    {selectedOrder.userName?.split(" ")[1]?.[0] || ""}
                                                                </Text>
                                                            </LinearGradient>

                                                            <View style={{ flex: 1, marginLeft: 10 }}>
                                                                <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{selectedOrder.userName}</Text>
                                                                <Text style={{ fontSize: 12, color: "#6b7280" }}>📍 {addresses[Number(selectedOrder.addressId)] || "Loading address..."}</Text>
                                                            </View>

                                                            <TouchableOpacity onPress={() => {
                                                                if (!selectedOrder.userPhone) return;
                                                                // call logic
                                                                if (Platform.OS === "android") {
                                                                    ToastAndroid.show(`Call: ${selectedOrder.userPhone}`, ToastAndroid.SHORT);
                                                                } else {
                                                                    Toast.show({ type: "info", text1: `Call: ${selectedOrder.userPhone}` });
                                                                }
                                                            }}>
                                                                <Ionicons name="call-outline" size={22} color="#40916c" />
                                                            </TouchableOpacity>
                                                        </TouchableOpacity>
                                                    </View>


                                                    {/* Amounts */}
                                                    <View
                                                        style={{
                                                            marginTop: 12,
                                                            borderTopWidth: 1,
                                                            borderTopColor: "#eef2f7",
                                                            paddingTop: 8,
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                                                            <Text style={{ color: "#6b7280" }}>SubTotal</Text>
                                                            <Text style={{ fontWeight: "600", color: "#111827" }}>
                                                                ₹{selectedOrder.orderDto?.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                                                            <Text style={{ color: "#6b7280" }}>Delivery Charge</Text>
                                                            <Text style={{ fontWeight: "600", color: "#111827" }}>
                                                                ₹{selectedOrder.orderDto?.[0]?.deliveryCharge || 0}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
                                                            <Text style={{ color: "#6b7280" }}>GST</Text>
                                                            <Text style={{ fontWeight: "600", color: "#111827" }}>₹{selectedOrder.gst || 0}</Text>
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
                                                                ₹{selectedOrder.totalAmount}
                                                            </Text>
                                                        </View>
                                                    </View>


                                                </ScrollView>
                                            ) : (
                                                <Text style={{ textAlign: "center", marginTop: 40 }}>No details available</Text>
                                            )}
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>


                    </View>
                </View>

                {/* Recent Orders / Bookings */}
                <View className="mb-6 px-4">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-gray-900 text-lg font-extrabold">
                            {selectedType === "Service" ? "Recent Bookings" : "Recent Orders"}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("MainTabs", {
                                    screen: "MainTabs",
                                    params: { screen: "Orders", params: { type: selectedType } },
                                })
                            }
                        >
                            <Text className="text-amber-500 text-xs font-bold">See all</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedType === "Service"
                        ? bookings.length === 0
                            ? (
                                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 40, marginBottom: 8 }}>📅</Text>
                                    <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: '700' }}>No bookings found</Text>
                                    <Text style={{ color: '#6b7280', fontSize: 12 }}>No service bookings yet</Text>
                                </View>
                            )
                            : bookings.map((b, idx) => {
                                // const s = getStatusColor(b.bookingStatus);
                                const colors = getStatusColor(b.bookingStatus);

                                return (

                                    <TouchableOpacity key={b.id} onPress={() => handleOpenServicesModal(b.id)} >
                                        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200 flex-row justify-between items-center">
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-10 h-10 rounded-lg bg-gray-100 justify-center items-center mr-3">
                                                    <Text className="text-amber-500 text-[16px] font-bold">{idx + 1}</Text>
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-gray-900 text-[15px] font-bold">{b.userName}</Text>
                                                    <Text className="text-gray-500 text-[12px] mt-1">₹{b.totalAmount}</Text>
                                                </View>
                                            </View>
                                            <View className={`px-3 py-2 rounded-lg ${colors.bg}`}>
                                                <Text className={`text-[12px] font-bold ${colors.text}`}>{b.bookingStatus}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        : recentOrders.map((order, idx) => {
                            const colors = getStatusColor(order.status);
                            return (
                                <TouchableOpacity key={order.id} onPress={() => handleOpenModal(order.id)}>
                                    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200 flex-row justify-between items-center">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-10 h-10 rounded-lg bg-gray-100 justify-center items-center mr-3">
                                                <Text className="text-amber-500 text-[16px] font-bold">{idx + 1}</Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-gray-900 text-[15px] font-bold">{order.customer}</Text>
                                                <Text className="text-gray-500 text-[12px] mt-1">₹{order.amount}</Text>
                                            </View>
                                        </View>
                                        <View className={`px-3 py-2 rounded-lg ${colors.bg}`}>
                                            <Text className={`text-[12px] font-bold ${colors.text}`}>{order.status}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>

                <Modal visible={servicesModal} animationType="fade" transparent={true}>
                    <TouchableWithoutFeedback onPress={handleCloseServicesModal}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 16,
                            }}
                        >
                            <TouchableWithoutFeedback>
                                <View
                                    style={{
                                        width: "100%",
                                        maxWidth: 380,
                                        maxHeight: "80%",
                                        backgroundColor: "#fff",
                                        borderRadius: 16,
                                        padding: 16,
                                    }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="large" color="#40916c" style={{ marginTop: 40 }} />
                                    ) : selectedServicesbookings ? (
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View className="flex-row justify-between items-center mb-3">
                                                {/* Order ID */}
                                                <View>
                                                    <Text className="text-[13px] text-gray-500 font-medium mb-1">Services ID</Text>
                                                    <Text className="text-base font-bold text-gray-900">
                                                        #{selectedServicesbookings.serviceBookingId}
                                                    </Text>
                                                </View>

                                                {/* Order Status */}

                                                {/* Order Status */}
                                                <View
                                                    className={`px-4 py-2 rounded-full items-center justify-center ${getStatusColor(selectedServicesbookings?.orderStatus || "").bg}`}
                                                >
                                                    <Text
                                                        className={`text-[12px] font-bold ${getStatusColor(selectedServicesbookings?.orderStatus || "").text}`}
                                                    >
                                                        {selectedServicesbookings?.orderStatus || "N/A"}
                                                    </Text>
                                                </View>



                                                {/* Cancel Icon */}
                                                {/* <TouchableOpacity onPress={handleCloseModal} style={{ marginLeft: 8 }}>
                                                        <Ionicons name="close" size={24} color="#333" />
                                                    </TouchableOpacity> */}
                                            </View>


                                            {/* Divider */}
                                            <View className="h-[1px] bg-gray-100 mb-3" />

                                            {/* Customer Info */}
                                            <View className="mb-3">
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        navigation.navigate("Chat", {
                                                            userName: selectedServicesbookings.userName,
                                                            userPhone: selectedServicesbookings.userPhone,
                                                        })
                                                    }
                                                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", padding: 10, borderRadius: 10, }}
                                                >
                                                    <LinearGradient colors={["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 44, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                                                            {selectedServicesbookings.userName ? selectedServicesbookings.userName.split(" ")[0][0] : "U"}
                                                            {selectedServicesbookings.userName?.split(" ")[1]?.[0] || ""}
                                                        </Text>
                                                    </LinearGradient>

                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#0f172a" }}>{selectedServicesbookings.userName}</Text>
                                                        <Text style={{ fontSize: 12, color: "#6b7280" }}>📍 {selectedServicesbookings.addressName1 || "Loading address..."}</Text>
                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        if (!selectedServicesbookings.userPhone) return;
                                                        // call logic
                                                        if (Platform.OS === "android") {
                                                            ToastAndroid.show(`Call: ${selectedServicesbookings.userPhone}`, ToastAndroid.SHORT);
                                                        } else {
                                                            Toast.show({ type: "info", text1: `Call: ${selectedServicesbookings.userPhone}` });
                                                        }
                                                    }}>
                                                        <Ionicons name="call-outline" size={22} color="#40916c" />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            </View>


                                            {/* Amounts */}
                                            <View
                                                style={{
                                                    marginTop: 12,
                                                    borderTopWidth: 1,
                                                    borderTopColor: "#eef2f7",
                                                    paddingTop: 8,
                                                }}
                                            >

                                                <Text className="text-[16px] font-bold text-gray-900 tracking-wide">
                                                    {selectedServicesbookings?.serviceName}
                                                </Text>

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
                                                        ₹{selectedServicesbookings.totalAmount}
                                                    </Text>
                                                </View>
                                            </View>


                                        </ScrollView>
                                    ) : (
                                        <Text style={{ textAlign: "center", marginTop: 40 }}>No details available</Text>
                                    )}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>
        </View>
    );
};

export default Orders;
