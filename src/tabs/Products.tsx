// Products.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import apiClient from "../api/apiBaseUrl";
import AppHeader from "../utils/AppHeader";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckboxItem from "../utils/CheckboxItem";
import Entypo from "react-native-vector-icons/Entypo";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

type ProductsRouteParams = {
  type?: "Product" | "Service";
};

const Products = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  // default 'products' represents showing all products
  const [selectedCategory, setSelectedCategory] = useState<string>("products");
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>({ id: "all", name: "All" });

  // items holds both products and services (type field)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  const [selectedStockFilters, setSelectedStockFilters] = useState<string[]>([]);
  const [selectedProductStatus, setSelectedProductStatus] = useState<string[]>([]);

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const refRBSheet = useRef<RBSheetRef>(null);

  const [vendorData, setVendorData] = useState<any>(null);
  const [activeFilterSection, setActiveFilterSection] = useState<"Category" | "Stock Status" | "Product Status">("Category");
  const route = useRoute<RouteProp<Record<string, ProductsRouteParams>, string>>();

  const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");

  const openFilterSheet = () => refRBSheet.current?.open();
  const closeFilterSheet = () => refRBSheet.current?.close();


  useEffect(() => {
    if (route.params && route.params.type) {
      setSelectedType(route.params.type);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.type) {
      setSelectedType(route.params.type);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const vendorId = vendorData?.id || "";

      if (selectedType === "Service") {

        fetchServicesOnly(vendorId);
      } else {
        fetchProductsOnly(vendorId);
        fetchCategories(vendorId);
      }
    }, [selectedType])
  );



  useEffect(() => {
    const loadData = async () => {
      try {
        const storedVendor = await AsyncStorage.getItem("vendorData");
        const vendorId = storedVendor ? JSON.parse(storedVendor).id : "";
        if (storedVendor) setVendorData(JSON.parse(storedVendor));

        await fetchCategories(vendorId);

        if (route.params?.type === "Service") {

          setSelectedType("Service");
          await fetchServicesOnly(vendorId);

          setSelectedCategory("products");
          setSubcategories([]);
          setSelectedSubcategory({ id: "all", name: "All" });
        } else {

          setSelectedType("Product");
          setSelectedCategory("products");
          await fetchProductsOnly(vendorId);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);




  // fetch categories 
  const fetchCategories = async (vendorId: string) => {
    if (!vendorId) return;
    try {
      const response = await apiClient.get(`api/public/category/getAll?vendorId=${vendorId}`);
      const formatted: Category[] = Array.isArray(response.data)
        ? response.data.map((item: any) => ({ id: item.id, name: item.name }))
        : [];

      setCategories([{ id: "products", name: selectedType === "Service" ? "Services" : "Products" }, ...formatted]);
    } catch (error: any) {
      console.error("Category Fetch Error:", error.message);
      setCategories([{ id: "products", name: "Products" }]);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (categoryId === "products") {
      setSubcategories([]);
      setSelectedSubcategory({ id: "all", name: "All" });
      return;
    }
    try {
      setSubLoading(true);
      const vendorId = vendorData?.id || "";
      const response = await apiClient.get(`api/public/subCategory/getByCategoryId/${categoryId}?vendorId=${vendorId}`);
      if (Array.isArray(response.data)) {
        setSubcategories([{ id: "all", name: "All" }, ...response.data.map((s: any) => ({ id: s.id, name: s.name }))]);
        setSelectedSubcategory({ id: "all", name: "All" });
      } else {
        setSubcategories([]);
        setSelectedSubcategory({ id: "all", name: "All" });
      }
    } catch (error: any) {
      console.error("Subcategory Fetch Error:", error.message);
      setSubcategories([]);
    } finally {
      setSubLoading(false);
    }
  };


  const handleCategoryPress = async (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory({ id: "all", name: "All" });
    setSubcategories([]);

    const vendorId = vendorData?.id || "";

    // setSelectedType("Product");

    if (catId === "products") {
      await fetchProductsOnly(vendorId);
      return;
    }

    // Category-specific products
    await fetchProductsByCategory(catId, vendorId);
    fetchSubcategories(catId);
  };

  const fetchProductsOnly = async (vendorId: string) => {
    if (!vendorId) return;
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/product/getAll?vendorId=${vendorId}`);
      const data = Array.isArray(response.data)
        ? response.data.map((p: any) => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          imageUrl: p.imageUrl,
          stockQuantity: p.stockQuantity,
          subCategoryName: p.subCategoryName,
          activeStatus: p.activeStatus,
          type: "product",
        }))
        : [];
      setProducts(data);
    } catch (error: any) {
      console.error("Fetch Products Error:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesOnly = async (vendorId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/services/getAll?vendorId=${vendorId}`);
      const data = Array.isArray(response.data)
        ? response.data.map((s: any) => ({
          id: s.id,
          name: s.name || s.serviceName || s.service_name || s.serviceTitle,
          price: s.price,
          imageUrl: s.imageUrl,
          duration: s.duration,
          activeStatus: s.activeStatus,
          type: "service",
        }))
        : [];
      setProducts(data);
    } catch (error: any) {
      console.error("Fetch Services Error:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: string, vendorId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/product/getAll?categoryId=${categoryId}&vendorId=${vendorId}`);
      const data = Array.isArray(response.data)
        ? response.data.map((p: any) => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          imageUrl: p.imageUrl,
          stockQuantity: p.stockQuantity,
          subCategoryName: p.subCategoryName,
          activeStatus: p.activeStatus,
          type: "product",
        }))
        : [];
      setProducts(data);
    } catch (error: any) {
      console.error("Product Fetch Error:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryPress = (sub: Subcategory) => {
    setSelectedSubcategory(sub);
    if (sub.id === "all") handleCategoryPress(selectedCategory);
    else fetchProductsBySubcategory(sub.id);
  };

  const fetchProductsBySubcategory = async (subId: string) => {
    try {
      setLoading(true);
      const vendorId = vendorData?.id || "";
      const response = await apiClient.get(`api/public/product/getAll?subCategoryId=${subId}&vendorId=${vendorId}`);
      const data = Array.isArray(response.data)
        ? response.data.map((p: any) => ({
          id: p.id,
          name: p.productName,
          price: p.price,
          imageUrl: p.imageUrl,
          stockQuantity: p.stockQuantity,
          subCategoryName: p.subCategoryName,
          activeStatus: p.activeStatus,
          type: "product",
        }))
        : [];
      setProducts(data);
    } catch (error: any) {
      console.error("Subcategory Product Fetch Error:", error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Filters ---
  const filteredProducts = products.filter((item) => {
    if (selectedStockFilters.length) {
      if (selectedStockFilters.includes("In Stock") && item.stockQuantity <= 10) return false;
      if (selectedStockFilters.includes("Low Stock") && (item.stockQuantity <= 0 || item.stockQuantity > 10)) return false;
      if (selectedStockFilters.includes("Out of Stock") && item.stockQuantity !== 0) return false;
    }
    if (selectedProductStatus.length) {
      if (selectedProductStatus.includes("Active") && !item.activeStatus) return false;
      if (selectedProductStatus.includes("Inactive") && item.activeStatus) return false;
    }
    // Services mode → show only services
    if (selectedType === "Service") return item.type === "service";
    // Product mode → show only products
    return item.type === "product";
  });

  const toggleStockFilter = (filter: string) =>
    setSelectedStockFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));

  const toggleProductStatus = (status: string) =>
    setSelectedProductStatus((prev) => (prev.includes(status) ? prev.filter((f) => f !== status) : [...prev, status]));

  const totalCount = products.length;
  const inStockCount = products.filter((p) => p.stockQuantity > 10).length;
  const lowStockCount = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
  const outStockCount = products.filter((p) => p.stockQuantity === 0).length;

  const styles = StyleSheet.create({
    toggleContainer: { flexDirection: "row", padding: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
    toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
    toggleText: { fontWeight: "600", fontSize: 15 },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fb" }}>
      <AppHeader
        title="My Products & Services"
        showBack
        rightIcon="filter"
        onRightPress={openFilterSheet}
        showSearch
        searchPlaceholder="Search items..."
        showStats
        statsData={[
          { label: "Total", value: `${totalCount}` },
          { label: "In Stock", value: `${inStockCount}` },
          { label: "Low Stock", value: `${lowStockCount}` },
          { label: "Out of Stock", value: `${outStockCount}` },
        ]}
      />

      {/* ------------------ Product / Service Toggle (green style) ------------------ */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={async () => {
            setSelectedType("Product");
            setSelectedCategory("products");
            const vendorId = vendorData?.id || "";
            await fetchProductsOnly(vendorId);
            // reset subcategory
            setSubcategories([]);
            setSelectedSubcategory({ id: "all", name: "All" });
          }}
          style={[
            styles.toggleBtn,
            {
              marginRight: 8,
              borderWidth: 2,
              borderColor: selectedType === "Product" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Product" ? "#ecfdf3" : "#fff",
            },
          ]}
        >
          <Text style={[styles.toggleText, { color: selectedType === "Product" ? "#15803d" : "#334155" }]}>🌿 Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setSelectedType("Service");
            const vendorId = vendorData?.id || "";
            await fetchServicesOnly(vendorId);
            setSubcategories([]);
            setSelectedSubcategory({ id: "all", name: "All" });

            setSelectedCategory("products");

          }}
          style={[
            styles.toggleBtn,
            {
              marginLeft: 8,
              borderWidth: 2,
              borderColor: selectedType === "Service" ? "#15803d" : "#d1d5db",
              backgroundColor: selectedType === "Service" ? "#ecfdf3" : "#fff",
            },
          ]}
        >
          <Text style={[styles.toggleText, { color: selectedType === "Service" ? "#15803d" : "#334155" }]}>🛠️ Service</Text>
        </TouchableOpacity>
      </View>

      {selectedType === "Product" && (
        <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", paddingHorizontal: 6, paddingVertical: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderBottomWidth: selectedCategory === cat.id ? 3 : 0,
                  borderBottomColor: selectedCategory === cat.id ? "#0c6b4bff" : "transparent",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 14, color: selectedCategory === cat.id ? "#0c6b4bff" : "#64748b", fontWeight: selectedCategory === cat.id ? "600" : "400" }}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedType === "Product" && (subLoading ? (
        <View style={{ paddingVertical: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <ActivityIndicator color="#3b82f6" size="small" />
        </View>
      ) : subcategories.length > 0 ? (
        <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", paddingHorizontal: 8, paddingVertical: 8 }}>
            {subcategories.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                onPress={() => handleSubcategoryPress(sub)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedSubcategory.id === sub.id ? "#40916c" : "#ddd",
                  backgroundColor: selectedSubcategory.id === sub.id ? "#d8f3dc" : "#f0f0f0",
                }}
              >
                <Text style={{ fontSize: 14, color: selectedSubcategory.id === sub.id ? "#40916c" : "#666", fontWeight: selectedSubcategory.id === sub.id ? "600" : "400" }}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null)}

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 }}>
          <ActivityIndicator color="#358362" size="large" />
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#94a3b8", fontSize: 16 }}>
            {selectedType === "Service" ? "No services found." : `No products found${selectedSubcategory?.id !== "all" ? ` in ${selectedSubcategory.name}` : ""}.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 12, paddingBottom: 80 + insets.bottom }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.type === "service" || selectedType === "Service") {
                  navigation.navigate("ServicesSeparateDetails", { id: item.id });
                } else {
                  navigation.navigate("PlantsSeparateDetails", { id: item.id });
                }
              }}
              style={{
                width: "48%",
                marginBottom: 16,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              {/* Image */}
              <View style={{ position: "relative", width: "100%", height: 120 }}>
                <Image source={{ uri: item.imageUrl }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
                {item.stockQuantity !== undefined && (
                  <View style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: item.stockQuantity > 10 ? "#d4edda" : item.stockQuantity > 0 ? "rgba(245, 158, 11, 0.9)" : "rgba(239, 68, 68, 0.9)",
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: "700", color: "#155724" }}>
                      {item.stockQuantity > 10 ? "In Stock" : item.stockQuantity > 0 ? "Low Stock" : "Out of Stock"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Details */}
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#0f172a", marginBottom: 2 }} numberOfLines={2}>
                  {item.name || item.productName}
                </Text>

                {item.subCategoryName && (
                  <Text style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{item.subCategoryName}</Text>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  {item.price && <Text style={{ fontSize: 15, fontWeight: "800", color: "#358362" }}>₹{item.price}</Text>}
                  {item.stockQuantity !== undefined && <Text style={{ fontSize: 11, fontWeight: "600", color: item.stockQuantity > 10 ? "#16a34a" : item.stockQuantity > 0 ? "#f59e0b" : "#ef4444" }}>Stock: {item.stockQuantity}</Text>}
                </View>

                {/* Product only details */}
                {item.type !== "service" && selectedType !== "Service" && (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Entypo name="star" color="#fbbf24" size={14} />
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#475569", marginLeft: 4 }}>{item.rating || "4.8"}</Text>
                    </View>

                    <Text style={{ fontSize: 11, color: "#94a3b8" }}>{item.soldCount ? `${item.soldCount} Sold` : "95 Sold"}</Text>
                  </View>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.type === "service" || selectedType === "Service") {
                        navigation.navigate("AddProductForm", { serviceId: item.id, isService: true });
                      } else {
                        navigation.navigate("AddProductForm", { productId: item.id });
                      }
                    }}
                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#e2e8f0", borderRadius: 6, paddingVertical: 4, paddingHorizontal: 18 }}
                  >
                    <Text style={{ fontSize: 12, color: "#0f172a", marginLeft: 4 }}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ backgroundColor: item.activeStatus ? "#16a34a" : "#ef4444", borderRadius: 12, paddingVertical: 4, paddingHorizontal: 18 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>{item.activeStatus ? "Active" : "Inactive"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: insets.bottom + 20,
          width: 56,
          height: 56,
          backgroundColor: "#358362",
          borderRadius: 28,
          justifyContent: "center",
          alignItems: "center",
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          zIndex: 9999,
        }}
        onPress={() => navigation.navigate("AddProductForm")}
      >
        <Text style={{ color: "#fff", fontSize: 32, fontWeight: "300" }}>+</Text>
      </TouchableOpacity>

      {/* Filter RBSheet */}
      <RBSheet
        ref={refRBSheet}
        height={500}
        openDuration={250}
        draggable
        closeOnPressMask
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          container: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 20, overflow: "visible" },
          draggableIcon: { backgroundColor: "#cbd5e1" },
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#0f172a" }}>Filters</Text>
          <TouchableOpacity onPress={closeFilterSheet}>
            <Entypo name="cross" color="#64748b" size={28} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flex: 1 }}>
          {/* Left Menu */}
          <View style={{ width: "40%", backgroundColor: "#f8f9fb", borderRightWidth: 1, borderRightColor: "#e2e8f0" }}>
            {["Category", "Stock Status", "Product Status"].map((section) => (
              <TouchableOpacity
                key={section}
                onPress={() => setActiveFilterSection(section as any)}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                  backgroundColor: activeFilterSection === section ? "#eff6ff" : "transparent",
                  borderLeftWidth: activeFilterSection === section ? 3 : 0,
                  borderLeftColor: activeFilterSection === section ? "#358362" : "transparent",
                }}
              >
                <Text style={{ color: activeFilterSection === section ? "#358362" : "#64748b", fontWeight: activeFilterSection === section ? "700" : "400", fontSize: 15 }}>
                  {section}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Content */}
          <View style={{ flex: 1, padding: 16 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category / Subcategory */}
              {activeFilterSection === "Category" && (
                <>
                  <Text style={{ fontWeight: "600", fontSize: 15, color: "#358362", marginBottom: 12 }}>Select Category</Text>
                  {categories.map((cat) => (
                    <CheckboxItem
                      key={cat.id}
                      label={cat.name}
                      selected={selectedCategory === cat.id}
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory({ id: "all", name: "All" });
                        handleCategoryPress(cat.id);
                      }}
                    />
                  ))}
                  {subcategories.length > 0 && (
                    <>
                      <Text style={{ fontWeight: "600", fontSize: 15, color: "#358362", marginTop: 16, marginBottom: 12 }}>Subcategories</Text>
                      {subcategories.map((sub) => (
                        <CheckboxItem key={sub.id} label={sub.name} selected={selectedSubcategory.id === sub.id} onPress={() => handleSubcategoryPress(sub)} />
                      ))}
                    </>
                  )}
                </>
              )}

              {/* Stock Status */}
              {activeFilterSection === "Stock Status" && (
                <>
                  <Text style={{ fontWeight: "600", fontSize: 15, color: "#358362", marginBottom: 12 }}>Stock Filters</Text>
                  {["In Stock", "Low Stock", "Out of Stock"].map((filter) => (
                    <CheckboxItem key={filter} label={filter} selected={selectedStockFilters.includes(filter)} onPress={() => toggleStockFilter(filter)} />
                  ))}
                </>
              )}

              {/* Product Status */}
              {activeFilterSection === "Product Status" && (
                <>
                  <Text style={{ fontWeight: "600", fontSize: 15, color: "#358362", marginBottom: 12 }}>Product Filters</Text>
                  {["Active", "Inactive"].map((status) => (
                    <CheckboxItem key={status} label={status} selected={selectedProductStatus.includes(status)} onPress={() => toggleProductStatus(status)} />
                  ))}
                </>
              )}
            </ScrollView>

            {/* Footer Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  // Reset to products view and default category
                  setSelectedType("Product");
                  setSelectedCategory("products");
                  setSelectedSubcategory({ id: "all", name: "All" });
                  setSelectedStockFilters([]);
                  setSelectedProductStatus([]);
                  fetchProductsOnly(vendorData?.id || "");
                }}
                style={{ flex: 1, backgroundColor: "#e2e8f0", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ color: "#0f172a", fontWeight: "600", fontSize: 14 }}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeFilterSheet} style={{ flex: 1, backgroundColor: "#358362", borderRadius: 8, paddingVertical: 12, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Products;
