import { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, Text, TextBase, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OfferCard from "../components/OffersCard";
import GradientHeader from "../utils/GradientHeader";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/core";
import apiClient from "../api/apiBaseUrl";
import AppHeader from "../utils/AppHeader";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useVendor } from "../context/VendorContext";

const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "scheduled", label: "Scheduled" },
    { id: "archived", label: "Archived" },
];

type Offer = {
    id: number;
    offerName: string;
    description: string;
    type: "Product" | "Service";
    imageUrl?: string;
    status: "ACTIVE" | "SCHEDULED" | "ARCHIVED";
    validTo: string;
    product: string;
};

type OrdersScreenParams = {
    type?: "Product" | "Service";
};


const Offers = () => {
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const navigation = useNavigation<any>();
    // Fixed
    const route = useRoute<RouteProp<Record<string, OrdersScreenParams>, string>>();
    const [selectedType, setSelectedType] = useState<"Product" | "Service">(
        route?.params?.type ?? "Product"
    );

    console.log("selectedType", selectedType)
    const { vendorData } = useVendor();
    const [searchQuery, setSearchQuery] = useState("");
    const [showRecent, setShowRecent] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const insets = useSafeAreaInsets();


    useEffect(() => {
        if (route?.params?.type) {
            setSelectedType(route.params.type);
        }
    }, [route]);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const key = `recentSearches:${vendorData?.id ?? 'global'}`;
                const raw = await AsyncStorage.getItem(key);
                if (raw) setRecentSearches(JSON.parse(raw));
                else setRecentSearches([]);
            } catch (e) { setRecentSearches([]); }
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
        } catch (e) { }
    };

    const clearRecent = async () => {
        try {
            const key = `recentSearches:${vendorData?.id ?? 'global'}`;
            await AsyncStorage.removeItem(key);
            setRecentSearches([]);
        } catch (e) { }
    };

    const handleSearchChange = (text: string) => setSearchQuery(text);
    const handleSearchFocus = () => setShowRecent(true);
    const handleSearchBlur = () => setTimeout(() => setShowRecent(false), 150);
    const handleSearchSubmit = () => { saveRecent(searchQuery); setShowRecent(false); };



    let filteredOffers = offers.filter((item) => {
        if (selectedFilter.id === "all") return true;
        if (selectedFilter.id === "active") return item.status === "ACTIVE";
        if (selectedFilter.id === "scheduled") return item.status === "SCHEDULED";
        if (selectedFilter.id === "archived") return item.status === "ARCHIVED";
        return true;
    });
    if (searchQuery?.trim()) {
        const q = searchQuery.toLowerCase();
        filteredOffers = filteredOffers.filter((item) => (
            item.offerName?.toLowerCase().includes(q) ||
            item.product?.toLowerCase().includes(q)
        ));
    }

    const handleEdit = (id: string) => {
        console.log("Edit Offer:", id);
    };

    const handleDelete = () => {
        fetchOffers();
    };


    const fetchOffers = async () => {
        if (!vendorData?.id) return;

        try {
            let response;
            if (selectedType === "Product") {
                // Fetch Product Offers
                response = await apiClient.get(`api/public/offers/getAll?vendorId=${vendorData.id}`);
            } else {
                // Fetch Service Offers
                response = await apiClient.get(`api/public/serviceOffers/getAll?vendorId=${vendorData.id}`);
            }

            const today = new Date().toISOString().split("T")[0];

            // Sort response descending by ID (latest first)
            const sortedResponse = response.data.sort((a: any, b: any) => b.id - a.id);

            const formattedData: Offer[] = sortedResponse.map((item: any) => {
                const today = new Date();
                const startDate = new Date(item.validFrom);
                const endDate = new Date(item.validTo);
                // let status: "ACTIVE" | "SCHEDULED" | "ARCHIVED";

                let status: "ACTIVE" | "SCHEDULED" | "ARCHIVED";

                if (today < startDate) {
                    status = "SCHEDULED";
                } else if (today > endDate) {
                    status = "ARCHIVED";
                } else if (item.activeStatus === true) {
                    status = "ACTIVE";
                } else {
                    status = "ARCHIVED";
                }

                return {
                    id: Number(item.id),
                    offerName: item.offerName,
                    product: item.productName || item.serviceName || "",
                    description: item.description,
                    type: selectedType,
                    imageUrl: selectedType === "Product" ? item.productImageUrl : item.serviceImageUrl,
                    status: status,
                    validTo: item.validTo,
                };
            });

            setOffers(formattedData);
        } catch (error) {
            console.error("Error fetch offers", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setOffers([]);
            fetchOffers();
        }, [selectedType])
    );

    const filterCounts: Record<string, number> = {
        all: offers.filter(o => o.type === selectedType).length,
        active: offers.filter(o => o.type === selectedType && o.status === "ACTIVE").length,
        scheduled: offers.filter(o => o.type === selectedType && o.status === "SCHEDULED").length,
        archived: offers.filter(o => o.type === selectedType && o.status === "ARCHIVED").length,
    };


    return (
        <View className="flex-1">
            <AppHeader
                title="Offers"
                showBack={false}
                leftIcon="arrow-back"
                rightIcon="add-outline"
                showSearch
                searchPlaceholder="Search offers..."
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchFocus={handleSearchFocus}
                onSearchBlur={handleSearchBlur}
                onSearchSubmit={handleSearchSubmit}
                onRightPress={() => navigation.navigate("AddOfferForm", { type: selectedType })}
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
                                            } catch (e) { }
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

            <View
                style={{
                    flexDirection: "row",
                    padding: 12,
                    gap: 10,
                    backgroundColor: "#F9FAFB",
                    // elevation: 1
                }}
            >

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

            <View className=" p-2 bg-white border-b border-gray-100 sticky">

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3 flex-row pb-1"
                >
                    {filters.map((filter) => {
                        const isSelected = selectedFilter.id === filter.id;
                        const count = filterCounts[filter.id] || 0;

                        return (
                            <Pressable
                                key={filter.id}
                                onPress={() => setSelectedFilter(filter)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    marginRight: 10,
                                    borderBottomWidth: isSelected ? 3 : 0,
                                    borderBottomColor: isSelected ? "#0A7A44" : "transparent", // dark green underline
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? "#0A7A44" : "#374151",
                                        fontWeight: isSelected ? "700" : "500",
                                        fontSize: 14,
                                        marginRight: 6,
                                    }}
                                >
                                    {filter.label}
                                </Text>

                                {/* Count Badge */}
                                <View
                                    style={{
                                        minWidth: 22,
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        borderRadius: 12,
                                        backgroundColor: isSelected ? "#0A7A44" : "#9ca3af",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </ScrollView>

            </View>

            <ScrollView
                className="p-4"
                contentContainerStyle={{
                    paddingBottom: 60,
                    flexGrow: 1,
                    justifyContent: filteredOffers.length === 0 ? "center" : "flex-start",
                    alignItems: filteredOffers.length === 0 ? "center" : "flex-start",
                }}
                showsVerticalScrollIndicator={false}
            >
                {filteredOffers.length === 0 ? (
                    <Text style={{ fontSize: 16, color: "#6B7280", fontWeight: "500" }}>
                        No offers found
                    </Text>
                ) : (
                    filteredOffers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </ScrollView>


        </View>
    )
}

export default Offers;