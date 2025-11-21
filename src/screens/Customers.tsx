import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import LinearGradient from "react-native-linear-gradient";
import { useVendor } from "../context/VendorContext";

const Customers = () => {
    const navigation = useNavigation<any>();
    const { vendorData } = useVendor();
    const [range, setRange] = useState("today");
    const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");


    const metrics = {
        totalCustomers: 812,
        newCustomers: 45,
        repeatRate: "68%",
        growth: "+12%",
    };

    const acquisitionData = [
        { value: 312, color: "#3b82f6", text: "Organic" },
        { value: 245, color: "#8b5cf6", text: "Referral" },
        { value: 198, color: "#ec4899", text: "Paid" },
        { value: 57, color: "#f59e0b", text: "Other" },
    ];

    const topCustomers = [
        { id: "1", name: "Vaishnavi Singh", spent: 24500, trend: "+8%" },
        { id: "2", name: "Karthik Sharma", spent: 18900, trend: "+5%" },
        { id: "3", name: "Ananya Verma", spent: 15600, trend: "+12%" },
    ];

    const isProduct = selectedType === "Product";
    const gradientColors = isProduct ? ["#10b981", "#059669"]
        : ["#fde68a", "#fbbf24"];
    const labelColor = isProduct ? "#ffffff" : "#78350f";
    const growthColor = isProduct ? "#ffffff" : "#92400e";
    const iconBackground = isProduct ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)";
    const iconName = isProduct ? "calendar" : "trending-up";

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}

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
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="mb-4">
                            <Text className="text-gray-900 text-lg font-extrabold">Customers</Text>
                            <Text className="text-gray-500 text-xs mt-1">Track your customers</Text>
                        </View>

                        <View className="w-[155px]">
                            <View className="bg-white border border-gray-200 rounded-xl h-11 px-2 justify-center">
                                <Picker
                                    selectedValue={range}
                                    onValueChange={(v) => setRange(v)}
                                    dropdownIconColor="#2563eb"
                                    style={{ height: 55, width: "100%", color: "#111827" }}
                                    mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                                >
                                    <Picker.Item label="Today" value="today" color="#111827" />
                                    <Picker.Item label="This Week" value="weekly" color="#111827" />
                                    <Picker.Item label="This Month" value="monthly" color="#111827" />
                                    <Picker.Item label="This Year" value="yearly" color="#111827" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Total Customers Card */}
                <View className="px-4 pt-5">

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
                        <View className="mb-4">
                            <Text className="text-[13px] font-semibold" style={{ color: labelColor }}>
                                {isProduct ? "TOTAL PRODUCTS" : "TOTAL SERVICES"}
                            </Text>
                            <Text className="text-[40px] font-extrabold mt-2" style={{ color: labelColor }}>
                                {isProduct ? metrics.totalProducts : metrics.totalServices}
                            </Text>
                        </View>

                        <View className="flex-row justify-between items-center">
                            <View className="flex-row items-center">
                                <View style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    backgroundColor: iconBackground,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 10
                                }}>
                                    <Ionicons name={iconName} size={16} color={labelColor} />
                                </View>
                                <Text style={{ color: growthColor, fontSize: 14, fontWeight: "600" }}>
                                    {metrics.growth} vs last period
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>





                    {/* Key Metrics Grid */}
                    <View className="mb-8">
                        <Text className="text-gray-900 text-base font-bold mb-4">
                            Key Metrics
                        </Text>
                        <View className="flex-row justify-between space-x-3 gap-2">
                            {/* New Customers */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Customers")}
                                className="flex-1 bg-white rounded-xl p-4 border border-gray-200"
                            >
                                <View className="flex-row items-center mb-3">
                                    <View className="w-11 h-11 rounded-xl bg-emerald-50 justify-center items-center mr-3">
                                        <Ionicons name="sparkles" size={20} color="#10b981" />
                                    </View>
                                </View>
                                <Text className="text-gray-500 text-[12px] font-semibold">
                                    New Customers
                                </Text>
                                <Text className="text-gray-900 text-2xl font-bold mt-2">
                                    {metrics.newCustomers}
                                </Text>
                            </TouchableOpacity>

                            {/* Repeat Rate */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Customers")}
                                className="flex-1 bg-white rounded-xl p-4 border border-gray-200"
                            >
                                <View className="flex-row items-center mb-3">
                                    <View className="w-11 h-11 rounded-xl bg-emerald-50 justify-center items-center mr-3">
                                        <Ionicons name="repeat" size={20} color="#10b981" />
                                    </View>
                                </View>
                                <Text className="text-gray-500 text-[12px] font-semibold">
                                    Repeat Rate
                                </Text>
                                <Text className="text-gray-900 text-2xl font-bold mt-2">
                                    {metrics.repeatRate}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Customer Acquisition Chart */}
                    <View className="mb-8">
                        <Text className="text-gray-900 text-base font-bold mb-5">
                            Customer Acquisition
                        </Text>
                        <View className="bg-white rounded-2xl p-5 border border-gray-200 items-center">
                            <PieChart
                                data={acquisitionData}
                                donut
                                radius={80}
                                innerRadius={60}
                                showTextBackground={false}
                                textColor="#111827"
                                textSize={12}
                            />
                            <View className="mt-5 w-full space-y-3">
                                {acquisitionData.map((item, idx) => (
                                    <View
                                        key={idx}
                                        className="flex-row items-center justify-between"
                                    >
                                        <View className="flex-row items-center">
                                            <View
                                                className="w-3 h-3 rounded bg-gray-300 mr-2.5"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <Text className="text-gray-500 text-[13px]">
                                                {item.text}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-900 text-[13px] font-semibold">
                                            {item.value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Top Customers */}
                    <View className="mb-8">
                        <Text className="text-gray-900 text-base font-bold mb-4">
                            Top Customers
                        </Text>
                        {topCustomers.map((customer) => (
                            <View
                                key={customer.id}
                                className="bg-white rounded-xl p-4 mb-3 border border-gray-200 flex-row justify-between items-center"
                            >
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 rounded-lg bg-violet-500 justify-center items-center mr-3">
                                        <Text className="text-white text-[14px] font-bold">
                                            {customer.name[0]}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-900 text-[14px] font-semibold">
                                            {customer.name}
                                        </Text>
                                        <Text className="text-gray-500 text-[12px] mt-1">
                                            ₹{(customer.spent / 1000).toFixed(1)}K spent
                                        </Text>
                                    </View>
                                </View>
                                <View className="bg-emerald-100 px-2.5 py-1.5 rounded-lg">
                                    <Text className="text-emerald-600 text-[12px] font-semibold">
                                        {customer.trend}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Customers;
