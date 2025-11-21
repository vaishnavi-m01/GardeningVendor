import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/type";
import LinearGradient from "react-native-linear-gradient";

type RouteProps = RouteProp<RootStackParamList, "LowStockPage">;

const LowStockPage: React.FC = () => {
    const route = useRoute<RouteProps>();
    const items = route.params?.items || [];
    const [query, setQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const set = new Set<string>();
        (items || []).forEach((it: any) => { if (it.category) set.add(it.category); });
        return Array.from(set);
    }, [items]);

    const filtered = useMemo(() => {
        return (items || []).filter((it: any) => {
            const matchesQuery = query.length === 0 || (it.name || "").toLowerCase().includes(query.toLowerCase());
            const matchesCategory = !filterCategory || it.category === filterCategory;
            return matchesQuery && matchesCategory;
        });
    }, [items, query, filterCategory]);

    const totalLow = (items || []).length;
    const critical = (items || []).filter((it: any) => (it.quantity ?? it.qty ?? 0) <= (it.criticalThreshold ?? 2)).length;

    const handleRestock = (item: any) => {
        Alert.alert("Restock", `Open restock flow for ${item.name || item.productName || 'item'}`);
    };

    const handleQuickOrder = (item: any) => {
        Alert.alert("Quick Order", `Create a quick reorder for ${item.name || item.productName || 'item'}`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
            {/* <View style={{ paddingVertical: 16, paddingHorizontal: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#e5e7eb" }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#0f172a" }}>Low Stock Items</Text>
        <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Items below stock threshold</Text>
      </View> */}

            <View style={{ padding: 16 }}>
                {/* <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#e6f4ea" }}>
            <Text style={{ fontSize: 12, color: "#10b981", fontWeight: "700" }}>Total Low</Text>
            <Text style={{ fontSize: 18, fontWeight: "800", marginTop: 6 }}>{totalLow}</Text>
          </View>
          <View style={{ width: 120, backgroundColor: "#fff", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#fff3f0" }}>
            <Text style={{ fontSize: 12, color: "#ef4444", fontWeight: "700" }}>Critical</Text>
            <Text style={{ fontSize: 18, fontWeight: "800", marginTop: 6, color: "#dc2626" }}>{critical}</Text>
          </View>
        </View> */}

                <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="search" size={18} color="#9ca3af" style={{ marginRight: 8 }} />
                        <TextInput
                            placeholder="Search item name or SKU"
                            placeholderTextColor="#9ca3af"
                            value={query}
                            onChangeText={setQuery}
                            style={{ flex: 1, height: 36, fontSize: 14, color: "#0f172a" }}
                        />
                    </View>
                    {categories.length > 0 && (
                        <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap", gap: 8 }}>
                            <TouchableOpacity onPress={() => setFilterCategory(null)} style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: !filterCategory ? "#10b981" : "#f3f4f6", borderRadius: 8 }}>
                                <Text style={{ color: !filterCategory ? "#fff" : "#0f172a", fontWeight: "700" }}>All</Text>
                            </TouchableOpacity>
                            {categories.map((c) => (
                                <TouchableOpacity key={c} onPress={() => setFilterCategory(c)} style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: filterCategory === c ? "#10b981" : "#f3f4f6", borderRadius: 8, marginRight: 8 }}>
                                    <Text style={{ color: filterCategory === c ? "#fff" : "#0f172a", fontWeight: "700" }}>{c}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={(item: any, index) => `${item.id ?? index}`}
                    ListEmptyComponent={() => (
                        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb" }}>
                            <Ionicons name="checkmark-circle" size={44} color="#10b981" />
                            <Text style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>No low stock items found</Text>
                            <Text style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>You're all stocked up 🎉</Text>
                        </View>
                    )}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "#fff",
                                borderRadius: 12,
                                padding: 12,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: "#e5e7eb",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                <View
                                    style={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: 10,
                                        backgroundColor: "#fff7ed",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: 12,
                                        borderWidth: 1,
                                        borderColor: "#fde68a",
                                        overflow: "hidden", 
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.imageUrl|| "https://via.placeholder.com/54" }}
                                        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                                    />
                                </View>


                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "800", color: "#0f172a" }}>{item.name || item.productName || "Unnamed Item"}</Text>
                                    <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{item.sku ? `SKU: ${item.sku}` : item.subCategoryName || ""}</Text>
                                    <Text style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{item.supplier ? `Supplier: ${item.supplier}` : ""}</Text>
                                </View>
                            </View>

                            <View style={{ alignItems: "flex-end", marginLeft: 12, width: 110 }}>
                                <Text style={{ fontSize: 16, fontWeight: "900", color: (item.quantity ?? item.qty ?? 0) <= (item.criticalThreshold ?? 2) ? "#dc2626" : "#f59e0b" }}>{item.quantity ?? item.qty ?? 0}</Text>
                                <Text style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Remaining</Text>

                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => handleRestock(item)} style={{ backgroundColor: "#10b981", paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, marginRight: 8 }}>
                                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Restock</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={() => handleQuickOrder(item)} style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 }}>
                    <Text style={{ color: "#0f172a", fontWeight: "700", fontSize: 12 }}>Order</Text>
                  </TouchableOpacity> */}
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default LowStockPage;
