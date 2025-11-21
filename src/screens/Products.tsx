import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient";
import { useVendor } from "../context/VendorContext";
import apiClient from "../api/apiBaseUrl";
import GradientHeader from "../utils/GradientHeader";


interface TopServiceItem {
  bookingCount: number;
  percentage: string;
  serviceId: number;
  serviceName: string;
  serviceSubCategoryId: number;
  serviceSubCategoryName: string;
}


interface ServicesMetricsType {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  trend: string;
  topServices: TopServiceItem[];
}



type OrdersScreenParams = {
  type?: "Product" | "Service";
};

const Products = () => {
  const navigation = useNavigation<any>();
  const [range, setRange] = useState("today");
  const { vendorData } = useVendor();
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");

  const [metrics, setMetrics] = useState<any>({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    lowStockProducts: 0,
    lowStockProductDetails: [],
    trend: "+14%",
    topProducts: []
  });

  console.log("TopProduct", metrics)
  const [servicesMetrics, setServicesMetrics] = useState<ServicesMetricsType>({
    totalServices: 0,
    activeServices: 0,
    inactiveServices: 0,
    trend: "+10%",
    topServices: []
  });

  console.log("Services metrics:", servicesMetrics);
  const serviceOrProductList =
    selectedType === "Service"
      ? servicesMetrics.topServices
      : metrics.topProducts;


  const route = useRoute<RouteProp<Record<string, OrdersScreenParams>, string>>();
  useEffect(() => {
    if (route?.params?.type) {
      setSelectedType(route.params.type);
    }
  }, [route]);

  useEffect(() => {
    fetchProductMetrics();
    fetchServicesMetrics();
  }, [selectedType]);

  const fetchProductMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/dashboard/countProducts?vendorId=${vendorData?.id}`);
      // Assuming API returns an array with one object as in your example
      if (response.data && response.data.length > 0) {
        setMetrics(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch product metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesMetrics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/dashboard/countServices?vendorId=${vendorData?.id}`)
      setServicesMetrics(response.data);

    } catch (error) {
      console.error("Failed to fetch services metrics:", error)
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white">
  //       <ActivityIndicator size="large" color="#3b82f6" />
  //     </View>
  //   );
  // }

  //hero card color
  const isProduct = selectedType === "Product";

  // PRODUCT colors
  const productGradient = ["#dbeafe", "#93c5fd"];
  const productText = "#1e3a8a";

  // SERVICE colors
  const serviceGradient = ["#dcfce7", "#86efac"];
  const serviceText = "#065f46";

  // FINAL COLORS  
  const gradientColors = isProduct ? productGradient : serviceGradient;
  const titleColor = isProduct ? productText : serviceText;
  const numberColor = isProduct ? productText : serviceText;
  const trendIconColor = isProduct ? productText : serviceText;

  return (
    <View className="flex-1">
      <GradientHeader
        title={selectedType === "Product" ? "Product" : "Service"}

        onBack={() => navigation.goBack()}
      />
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 40 }}
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

        <View className="bg-gray-50 px-4 pt-5 pb-5">
          <View className="flex-row justify-between items-center mb-4">
            <View className="mb-4">
              <Text className="text-gray-900 text-lg font-extrabold">
                {selectedType === "Product" ? "Products" : "Services"}
              </Text>

              <Text className="text-gray-500 text-xs mt-1">
                {selectedType === "Product"
                  ? "Manage your inventory"
                  : "Manage your service bookings"}
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

        {/* Main Content */}
        <View className="px-3 pt-4">
          {/* Hero Card */}
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, padding: 28, marginBottom: 28 }}
          >
            <View className="mb-3">
              <Text
                style={{
                  color: titleColor,
                  fontSize: 11,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {isProduct ? "TOTAL PRODUCTS" : "TOTAL SERVICES"}
              </Text>

              <Text
                style={{
                  color: numberColor,
                  fontSize: 26,
                  fontWeight: "900",
                  marginTop: 4,
                  lineHeight: 30,
                }}
              >
                {isProduct ? metrics.totalProducts : servicesMetrics.totalServices}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-white/40">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white/60 justify-center items-center mr-2">
                  <Ionicons name="trending-up" size={16} color={trendIconColor} />
                </View>

                <Text
                  style={{
                    color: titleColor,
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  {metrics.trend}
                </Text>
              </View>

              <Text
                style={{
                  color: titleColor,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                vs last period
              </Text>
            </View>
          </LinearGradient>


          {/* Product Status Grid */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 text-lg font-extrabold">{selectedType === "Product" ? "Product Status" : "Services Status"}</Text>
              {/* <TouchableOpacity>
                <Text className="text-blue-500 text-xs font-bold">View All</Text>
              </TouchableOpacity> */}
            </View>

            {/* Row 1 */}
            <View className="flex-row justify-between mb-3">
              {/* Active Products */}
              <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 mr-2 border border-gray-200">
                <View className="flex-row items-start mb-3">
                  <View className="w-12 h-12 rounded-xl bg-green-50 justify-center items-center mr-3">
                    <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-bold">Active</Text>
                    <Text className="text-gray-900 text-lg font-extrabold mt-1">
                      {selectedType === "Product" ? metrics.activeProducts : servicesMetrics.activeServices}
                    </Text>
                  </View>
                </View>
                <Text className="text-green-600 text-[11px] font-semibold">
                  View details →
                </Text>
              </TouchableOpacity>

              {/* Inactive Products */}
              <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <View className="flex-row items-start mb-3">
                  <View className="w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-3">
                    <Ionicons name="close-circle-outline" size={22} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-bold">Inactive</Text>
                    <Text className="text-gray-900 text-lg font-extrabold mt-1">
                      {selectedType === "Product" ? metrics.inactiveProducts : servicesMetrics.inactiveServices}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-[11px] font-semibold">
                  View details →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            {selectedType === "Product" && (
              <View className="flex-row justify-between">
                {/* Low Stock */}
                <TouchableOpacity
                  className="flex-1 bg-white rounded-xl p-4 mr-2 border border-gray-200"
                  onPress={() => navigation.navigate("LowStockPage", { items: metrics.lowStockProductDetails })}
                >
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 rounded-xl bg-amber-50 justify-center items-center mr-3">
                      <Ionicons name="alert-outline" size={22} color="#f59e0b" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-bold">Low Stock</Text>
                      <Text className="text-gray-900 text-lg font-extrabold mt-1">
                        {metrics.lowStockProducts}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-amber-600 text-[11px] font-semibold">
                    View details →
                  </Text>
                </TouchableOpacity>

                {/* Out Of Stock */}
                <TouchableOpacity
                  onPress={() => navigation.navigate("OutOfStock")}
                  className="flex-1 bg-white rounded-xl p-4 border border-gray-200"
                >
                  <View className="flex-row items-start mb-3">
                    <View className="w-12 h-12 rounded-xl bg-red-50 justify-center items-center mr-3">
                      <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-500 text-sm font-bold">Out Of Stock</Text>
                      <Text className="text-gray-900 text-lg font-extrabold mt-1">
                        {(metrics as any).outOfStock ?? 0}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-red-500 text-[11px] font-semibold">View details →</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

          {/* Categories */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 text-lg font-extrabold">{selectedType === "Product" ? "Top Product" : "Top Services"}</Text>
              <TouchableOpacity onPress={() =>
                navigation.navigate("MainTabs", {
                  screen: "MainTabs",
                  params: { screen: "Products", params: { type: selectedType } },
                })
              }>
                <Text className="text-indigo-500 text-xs font-bold">See all</Text>
              </TouchableOpacity>
            </View>

            {serviceOrProductList.map((item: any, idx: any) => (
              <View
                className="bg-white rounded-xl p-4 mb-3 border border-gray-300 flex-row justify-between items-center"
                key={idx}
              >
                <View className="flex-1 flex-row items-center">
                  <View className="w-10 h-10 rounded-lg bg-gray-100 justify-center items-center mr-3.5">
                    <Text className="text-indigo-500 text-[16px] font-bold">{idx + 1}</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-900 text-[15px] font-bold">
                      {selectedType === "Service" ? item.serviceName : item.productName}
                    </Text>

                    <Text className="text-gray-500 text-xs mt-1">
                      {selectedType === "Service" ? item.serviceSubCategoryName : item.subCategoryName}
                    </Text>

                    <View className="mt-2 flex-row items-center gap-2">
                      <Text className="text-gray-400 text-[11px] font-semibold mr-1.5">
                        {selectedType === "Service" ? "Booking Count:" : "Sales Count:"}
                      </Text>

                      <Text className="text-gray-900 text-[14px] font-bold">
                        {selectedType === "Service" ? item.bookingCount : item.saleCount}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="bg-[#d1fae5] px-3 py-2 rounded-lg">
                  <Text className="text-[#059669] text-xs font-bold">
                    {item.percentage || item.salesPercentage}
                  </Text>
                </View>
              </View>
            ))}


          </View>
        </View>
      </ScrollView>
    </View>

  );
};

export default Products;
