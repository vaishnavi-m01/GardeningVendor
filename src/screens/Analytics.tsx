import React, { useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Animated, TouchableWithoutFeedback } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import { useVendor } from "../context/VendorContext";
import LinearGradient from "react-native-linear-gradient";
import apiClient from "../api/apiBaseUrl";
import { getMonthRange, getTodayRange, getWeekRange, getYearRange } from "../utils/DateRange";

const Analytics = () => {
  const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");

  const navigation = useNavigation<any>();
  const { vendorData } = useVendor();
  const [range, setRange] = useState("today");
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const cardStyle = "flex-1 bg-white rounded-xl p-4 border border-gray-300";
  const iconBox = "w-12 h-12 rounded-xl justify-center items-center mr-3";



  const [keyMetrics, setKeyMetrics] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalServices: 0,
    totalProducts: 0,
    totalProductCustomers: 0,
    totalProductRevenue: 0,
    totalServiceCustomers: 0,
    totalServiceRevenue: 0,
  });


  const metrics = {
    revenue: 85230,
    orders: keyMetrics.totalOrders,
    servicesBooking: keyMetrics.totalBookings,
    customers: keyMetrics.totalOrders,
    products: keyMetrics.totalProducts,
    outOfStock: 12,
    growth: "+18%",
  };

  const pieData = [
    { value: 51000, color: "#3b82f6", text: "Services" },
    { value: 25600, color: "#8b5cf6", text: "Products" },
    { value: 8630, color: "#06b6d4", text: "Other" },
  ].map((item, index) => ({
    ...item,
    focused: selectedSlice === index,

    shadowColor: selectedSlice === index ? item.color : "transparent",
    shadowRadius: selectedSlice === index ? 12 : 0,

    onPress: () => handleSlicePress(index),
  }));




  const formatDate = (date: any) => {
    return date.toISOString().split("T")[0];
  };





  const handleRangeChange = (value: any) => {
    setRange(value);

    let rangeValues = { startDate: "", endDate: "" };

    if (value === "today") rangeValues = getTodayRange();
    if (value === "weekly") rangeValues = getWeekRange();
    if (value === "monthly") rangeValues = getMonthRange();
    if (value === "yearly") rangeValues = getYearRange();

    setStartDate(rangeValues.startDate);
    setEndDate(rangeValues.endDate);

    fetchDashboardCounts(rangeValues.startDate, rangeValues.endDate);
  };



  const fetchDashboardCounts = async (start: any, end: any) => {
    try {
      const response = await apiClient.get(
        `/api/public/dashboard/totalCounts?vendorId=${vendorData?.id}&startDate=${start}&endDate=${end}`
      );

      console.log("Dashboard response:", response.data);

      const serviceCounts = response.data.counts[0];
      const orderCounts = response.data.counts[1];

      setKeyMetrics({
        totalOrders: orderCounts.totalOrders ?? 0,
        totalProducts: orderCounts.totalProducts ?? 0,
        totalProductCustomers: orderCounts.totalProductCustomers ?? 0,
        totalProductRevenue: orderCounts.totalProductRevenue ?? 0,
        totalServices: serviceCounts.totalServices ?? 0,
        totalBookings: serviceCounts.totalBookings ?? 0,
        totalServiceCustomers: serviceCounts.totalServiceCustomers ?? 0,
        totalServiceRevenue: serviceCounts.totalServiceRevenue ?? 0,
      });

    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };



  React.useEffect(() => {
    const { startDate, endDate } = getTodayRange();
    setStartDate(startDate);
    setEndDate(endDate);
    fetchDashboardCounts(startDate, endDate);
  }, [selectedType]);


  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSlicePress = (index: number) => {
    setSelectedSlice(prev => (prev === index ? null : index));
    animatePress();
    // Navigate to Orders and pre-select Product/Service based on slice
    try {
      const mapping = index === 0 ? "Service" : index === 1 ? "Product" : "Product";
      // navigation.navigate("Orders", { initialType: mapping });
    } catch (e) {
      console.warn("Navigation to Orders failed", e);
    }
  };

  const dynamicLabels = {
    mainTitle: selectedType === "Product" ? "Products" : "Services",
    mainCount: selectedType === "Product" ? keyMetrics.totalProducts : keyMetrics.totalServices,

    secondTitle: selectedType === "Product" ? "Orders" : "Bookings",
    secondCount: selectedType === "Product" ? keyMetrics.totalOrders : keyMetrics.totalBookings,
  };



  return (
    <ScrollView
      className="flex-1 bg-[#f5f7fa]"
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
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

      <View className="bg-white px-4 pt-6 pb-7 border-b border-gray-300">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-gray-900 text-[17px] font-extrabold">Sales Analytics</Text>
            <Text className="text-gray-500 text-xs mt-1">Track your business performance</Text>
          </View>
          <View className="w-[155px]">
            <View className="bg-white rounded-xl px-2 h-11 border border-gray-300 justify-center">
              <Picker
                selectedValue={range}
                onValueChange={(v) => handleRangeChange(v)}
                dropdownIconColor="#667eea"
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

      {/* Content Wrapper */}
      <View className="px-4 pt-3">

        {/* Total Revenue */}
        <LinearGradient
          colors={["#34d399", "#059669"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 28,
            marginBottom: 28,
          }}
        >
          <View className="mb-3">
            <Text className="text-white text-[11px] font-bold uppercase tracking-widest">
              TOTAL REVENUE
            </Text>
            <Text className="text-white text-[26px] font-black mt-1 leading-8">
              ₹{(metrics.revenue / 1000).toFixed(1)}K
            </Text>
          </View>

          <View className="flex-row justify-between items-center pt-2 border-t border-white/40">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-lg bg-white/60 justify-center items-center mr-2">
                <Ionicons name="trending-up" size={16} color="#065f46" />
              </View>
              <Text className="text-white text-[13px] font-bold">
                {metrics.growth}
              </Text>
            </View>
            <Text className="text-white text-[12px] font-medium">
              vs last period
            </Text>
          </View>
        </LinearGradient>


        {/* KPI Grid */}
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-extrabold">Key Metrics</Text>
            <TouchableOpacity className="px-2 py-1.5">
              <Text className="text-indigo-500 text-xs font-bold">View All</Text>
            </TouchableOpacity>
          </View>


          {/* Row 1 */}
          <View className="flex-row mb-4">

            {/* Products */}
            <TouchableOpacity
              onPress={() =>
                // navigation.navigate("ServicesBooking")
                navigation.navigate("Products", { type: selectedType })
              }
              //  onPress={() =>
              //             navigation.navigate("MainTabs", {
              //                 screen: "MainTabs",
              //                 params: { screen: "Orders", params: { type: selectedType } },
              //             })
              //         }
              className={`${cardStyle} mr-2`}
            >
              <View className="flex-row items-start mb-3.5">
                <View
                  className={`${iconBox}`}
                  style={{ backgroundColor: selectedType === "Product" ? "#fef3c7" : "#e0f2fe" }}
                >
                  <Ionicons
                    name={selectedType === "Product" ? "basket-outline" : "construct-outline"}
                    size={22}
                    color={selectedType === "Product" ? "#f59e0b" : "#0284c7"}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-bold tracking-wide">
                    {dynamicLabels.mainTitle}
                  </Text>
                  <Text className="text-gray-900 text-[17px] font-extrabold mt-1">
                    {dynamicLabels.mainCount}
                  </Text>
                </View>
              </View>
              <Text className="text-[#3b82f6] text-[11px] font-semibold">View details →</Text>
            </TouchableOpacity>



            {/* Orders */}
            <TouchableOpacity
              onPress={() =>
                // navigation.navigate(selectedType === "Product" ? "Orders" : "Bookings")
                navigation.navigate("Orders", { type: selectedType })
              }
              className={cardStyle}
            >
              <View className="flex-row items-start mb-3.5">
                <View
                  className={`${iconBox}`}
                  style={{ backgroundColor: "#ecf0ff" }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={22}
                    color="#3b82f6"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-bold tracking-wide">
                    {dynamicLabels.secondTitle}
                  </Text>
                  <Text className="text-[#003602] text-[17px] font-extrabold mt-1">
                    {dynamicLabels.secondCount}
                  </Text>
                </View>
              </View>
              <Text className="text-[#3b82f6] text-[11px] font-semibold">View details →</Text>
            </TouchableOpacity>


          </View>


          {/* Row 2 */}
          <View className="flex-row">

            {/* Customers */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Customers")}
              className={`${cardStyle} mr-2`}
            >
              <View className="flex-row items-start mb-3.5">
                <View className={`${iconBox}`} style={{ backgroundColor: "#f0fdf4" }}>
                  <Ionicons name="people-outline" size={22} color="#10b981" />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-bold tracking-wide">Customers</Text>
                  <Text className="text-[#003602] text-[17px] font-extrabold mt-1">
                    <Text className="text-lg font-bold">
                      {selectedType === "Product"
                        ? keyMetrics.totalProductCustomers
                        : keyMetrics.totalServiceCustomers}
                    </Text>
                  </Text>
                </View>
              </View>
              <Text className="text-[#10b981] text-[11px] font-semibold">View details →</Text>
            </TouchableOpacity>


            {/* Revenue */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Revenue")}
              className={cardStyle}
            >
              <View className="flex-row items-start mb-3.5">
                <View className={`${iconBox}`} style={{ backgroundColor: "#c7d2fe" }}>
                  <Ionicons name="cash-outline" size={22} color="#6366f1" />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 text-[13px] font-bold tracking-wide">Revenue</Text>
                  <Text className="text-lg font-bold">
                    ₹{selectedType === "Product"
                      ? keyMetrics.totalProductRevenue
                      : keyMetrics.totalServiceRevenue}
                  </Text>

                </View>
              </View>
              <Text className="text-[#6366f1] text-[11px] font-semibold">View details →</Text>
            </TouchableOpacity>

          </View>
        </View>


        {/* Revenue Breakdown */}
        <View className="mb-10">
          <Text className="text-gray-900 text-lg font-extrabold mb-4">Revenue Breakdown</Text>

          <View className="bg-white rounded-2xl p-6 border border-gray-300 items-center">

            <TouchableWithoutFeedback onPress={() => setSelectedSlice(null)}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <PieChart
                  data={pieData.map((item, idx) => ({
                    ...item,
                    focused: selectedSlice === idx,
                    onPress: () => handleSlicePress(idx),
                  }))}
                  donut
                  radius={selectedSlice !== null ? 105 : 90}
                  innerRadius={selectedSlice !== null ? 75 : 65}
                  focusOnPress
                  showTextBackground={false}
                  textColor="#111827"
                  textSize={13}
                />
              </Animated.View>
            </TouchableWithoutFeedback>


            <View className="mt-7 w-full space-y-3.5">
              {pieData.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSlicePress(idx)}
                  className="flex-row items-center justify-between px-1"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-2.5 h-2.5 rounded-sm mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text
                      className="text-[14px] font-semibold"
                      style={{ color: selectedSlice === idx ? "#000" : "#6b7280" }}
                    >
                      {item.text}
                    </Text>
                  </View>

                  <Text
                    className="text-[14px] font-extrabold"
                    style={{ color: selectedSlice === idx ? "#000" : "#111827" }}
                  >
                    ₹{(item.value / 1000).toFixed(1)}K
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>


        {/* Top Products */}
        {/* <View className="mb-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-extrabold">{selectedType ==="Product" ? "Top Product" :"Top Services"}</Text>
            <TouchableOpacity>
              <Text className="text-indigo-500 text-xs font-bold">See all</Text>
            </TouchableOpacity>
          </View>

          {topProducts.map((product, idx) => (
            <View
              key={product.id}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-300 flex-row justify-between items-center"
            >
              <View className="flex-1 flex-row items-center">
                <View className="w-10 h-10 rounded-lg bg-gray-100 justify-center items-center mr-3.5">
                  <Text className="text-indigo-500 text-[16px] font-bold">{idx + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-[15px] font-bold">{product.name}</Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    ₹{(product.revenue / 1000).toFixed(1)}K revenue
                  </Text>
                </View>
              </View>
              <View className="bg-[#d1fae5] px-3 py-2 rounded-lg">
                <Text className="text-[#059669] text-xs font-bold">{product.trend}</Text>
              </View>
            </View>
          ))}
        </View> */}
      </View>
    </ScrollView>
  );
};

export default Analytics;
