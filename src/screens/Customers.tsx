import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import LinearGradient from "react-native-linear-gradient";
import { useVendor } from "../context/VendorContext";
import apiClient from "../api/apiBaseUrl";

const Customers = () => {
    const navigation = useNavigation<any>();
    const { vendorData } = useVendor();
    const [range, setRange] = useState("today");

    const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");
    const [customerData, setCustomerData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlice, setSelectedSlice] = useState<string | null>(null);
    const [selectedSlices, setSelectedSlices] = useState<number | null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;


    const baseColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#f97316", "#6366f1"];

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const productRes = await apiClient.get(`api/public/dashboard/getOrderCustomers?vendorId=${vendorData?.id}`);
            const serviceRes = await apiClient.get(`api/public/dashboard/getServiceCustomers?vendorId=${vendorData?.id}`);

            const productData = productRes.data[0] || {};
            const serviceData = serviceRes.data[0] || {};

            setCustomerData({ product: productData, service: serviceData });
        } catch (error) {
            console.error("Error fetching customer data:", error);
            setCustomerData({ product: {}, service: {} });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [vendorData?.id]);

    if (!customerData) return null;

    const data = selectedType === "Product" ? customerData.product : customerData.service;
    console.log("CustomerData", data)

    const totalCount = selectedType === "Product" ? data.totalProductCustomers : data.totalServiceCustomers;
    const subCategoryData = selectedType === "Product" ? data.productSubCategories : data.serviceSubCategories;
    const percentages = selectedType === "Product"
        ? data.productPercentages?.[0] ?? {}
        : data.servicePercentages?.[0] ?? {};

    console.log("percentage", percentages)
    const topCustomers =
        selectedType === "Product"
            ? data.top5ProductCustomers ?? []
            : data.top5ServiceCustomers ?? [];
    console.log("topCustomers", topCustomers)


    const acquisitionData = Object.keys(percentages).map((key, idx) => ({
        text: key,
        value: parseFloat(percentages[key].replace("%", "")),
        color: baseColors[idx % baseColors.length],
    }));

    const isProduct = selectedType === "Product";
    const gradientColors = isProduct ? ["#10b981", "#059669"] : ["#fde68a", "#fbbf24"];
    const labelColor = isProduct ? "#ffffff" : "#78350f";
    const growthColor = isProduct ? "#ffffff" : "#92400e";
    const iconBackground = isProduct ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)";
    const iconName = isProduct ? "calendar" : "trending-up";

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.96, duration: 90, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
        ]).start();
    };

    const handleSlicePress = (idx: number, item: any) => {
        const next = selectedSlices === idx ? null : idx;
        setSelectedSlices(next);
        animatePress();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header: Product / Service Toggle */}


                <View style={{ flexDirection: "row", padding: 12 }}>
                    <TouchableOpacity
                        onPress={() => setSelectedType("Product")}
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
                    <TouchableOpacity
                        onPress={() => setSelectedType("Service")}
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

                <View className="bg-gray-50 px-4 pt-5 pb-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="mb-4">
                            <Text
                                className={`text-lg font-extrabold ${selectedType === "Service" ? "text-[#0f172a]" : "text-gray-900"
                                    }`}
                            >
                                {selectedType === "Service" ? "Services" : "Products"}
                            </Text>

                            <Text className={`mt-1 text-xs ${selectedType === "Service" ? "text-gray-400" : "text-gray-500"}`}>
                                {selectedType === "Service" ? "Service customers overview" : "Product customers overview"}
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

                {/* Total Customers Card */}
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 16, padding: 24, marginHorizontal: 16, marginBottom: 28 }}
                >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={{ color: labelColor, fontSize: 13, fontWeight: "600" }}>
                                {isProduct ? "Total Product Customers" : "Total Service Customers"}
                            </Text>
                            <Text style={{ color: labelColor, fontSize: 40, fontWeight: "bold", marginTop: 4 }}>
                                {totalCount ?? 0}
                            </Text>
                        </View>
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: iconBackground,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Ionicons name={iconName} size={16} color={labelColor} />
                        </View>
                    </View>
                </LinearGradient>

                {/* Pie Chart */}
                <View style={{ backgroundColor: "#fff", marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>Customer Acquisition</Text>
                    <View style={{ position: "relative", alignItems: "center" }}>
                        <TouchableWithoutFeedback onPress={() => setSelectedSlices(null)}>
                            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                <PieChart
                                    data={(acquisitionData.length ? acquisitionData : [{ text: "No Data", value: 1, color: "#ccc" }])
                                        .map((item, idx) => ({
                                            ...item,
                                            focused: selectedSlices === idx,
                                            shadowColor: selectedSlices === idx ? item.color : "transparent",
                                            shadowRadius: selectedSlices === idx ? 10 : 0,
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

                        {/* CENTER VALUE AFTER PRESS */}
                        {selectedSlices !== null && (() => {
                            const item = acquisitionData[selectedSlices];
                            const selectedCount = subCategoryData[item.text] ?? 0;

                            return (
                                <View style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <View style={{
                                        backgroundColor: "#fff",
                                        padding: 8,
                                        borderRadius: 999,
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOpacity: 0.08,
                                        elevation: 2,
                                    }}>
                                        <Text style={{ fontSize: 16, fontWeight: "800", color: item.color }}>
                                            {selectedCount}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                            {item.text}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })()}

                    </View>


                    <View style={{ marginTop: 16 }}>
                        {acquisitionData.map((item, idx) => (
                            <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6, opacity: selectedSlice ? (selectedSlice === item.text ? 1 : 0.5) : 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 8 }} />
                                    <Text style={{ fontSize: 13, color: "#4b5563" }}>{item.text}</Text>
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
                                    {percentages[item.text]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Top Customers */}
                <View style={{ marginTop: 24, marginHorizontal: 16 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
                        Top Customers
                    </Text>

                    {topCustomers && topCustomers.length > 0 ? (
                        topCustomers.map((customer:any, idx:any) => (
                            <View
                                key={idx}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: "#e5e7eb",
                                    borderRadius: 12,
                                    marginBottom: 8
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            backgroundColor: "#6366f1",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 8
                                        }}
                                    >
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                            {customer.name[0]}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontWeight: "600", color: "#111827" }}>
                                            {customer.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                            {selectedType === "Product"
                                                ? `${customer.totalProductOrders} Orders`
                                                : `${customer.totalServiceCompleted} Bookings`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 12,
                                fontSize: 14,
                                fontWeight: "500",
                                color: "#9ca3af"
                            }}
                        >
                            No customers found
                        </Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Customers;
