import { useState } from "react";
import { Pressable, ScrollView, Text, TextBase, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import OfferCard from "../components/OffersCard";
import GradientHeader from "../utils/GradientHeader";
import { useNavigation } from "@react-navigation/core";

const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "scheduled", label: "Scheduled" },
    { id: "archived", label: "Archived" },
];

type Offer = {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    status: "ACTIVE" | "SCHEDULED" | "ARCHIVED";
    activeUntil: string;
};

const dummyOffers: Offer[] = [
    {
        id: "OFFER001",
        name: "Heirloom Rose Bushes",
        type: "Buy 1, Get 1 Free (BOGO)",
        imageUrl: require("../assets/images/Plants1.png"),
        status: "ACTIVE",
        activeUntil: "2026-02-28",
    },
    {
        id: "OFFER002",
        name: "Tulip Garden Pack",
        type: "20% Off",
        imageUrl: require("../assets/images/Plants2.jpg"),
        status: "SCHEDULED",
        activeUntil: "2026-03-15",
    },
    {
        id: "OFFER003",
        name: "Orchid Delight",
        type: "Buy 2, Get 1 Free",
        imageUrl: require("../assets/images/Plants3.png"),
        status: "ARCHIVED",
        activeUntil: "2025-12-31",
    },
    {
        id: "OFFER004",
        name: "Garden Fertilizer Pack",
        type: "15% Off",
        imageUrl: require("../assets/images/Plants4.png"),
        status: "ACTIVE",
        activeUntil: "2026-01-30",
    },
    {
        id: "OFFER004",
        name: "Garden Fertilizer Pack",
        type: "15% Off",
        imageUrl: require("../assets/images/Plants4.png"),
        status: "ACTIVE",
        activeUntil: "2026-01-30",
    },
];

const Offers = () => {
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [offers, setOffers] = useState<Offer[]>(dummyOffers);
    const navigation = useNavigation<any>();

    const filteredOffers = offers.filter((item) => {
        if (selectedFilter.id === "all") return true;
        if (selectedFilter.id === "active") return item.status === "ACTIVE";
        if (selectedFilter.id === "scheduled") return item.status === "SCHEDULED";
        if (selectedFilter.id === "archived") return item.status === "ARCHIVED";
        return true;
    });

    const handleEdit = (id: string) => {
        console.log("Edit Offer:", id);
    };

    const handleDelete = (id: string) => {
        console.log("Delete Offer:", id);
    };

    return (
        <View className="flex-1">
            <GradientHeader
                title="Offers"
                onBack={() => navigation.goBack()}
                rightText="New Offer"
                onRightPress={() => navigation.navigate("AddOfferForm")}
            />

            <View className=" p-2 bg-white border-b border-gray-100 sticky">
                {/* //search bar */}
                <TextInput placeholder="Search Offer ID, Product, or Type..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-4 ">
                </TextInput>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-3 flex-row pb-1"

                >
                    {filters.map((filter) => {
                        const isSelected = selectedFilter.id === filter.id;
                        return (
                            <Pressable
                                key={filter.id}
                                onPress={() => setSelectedFilter(filter)}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    marginRight: 8,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: isSelected ? "#40916c" : "#ddd",
                                    backgroundColor: isSelected ? "#d8f3dc" : "#f0f0f0",
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? "#40916c" : "#333",
                                        fontWeight: "500",
                                        fontSize: 14,
                                    }}
                                >
                                    {filter.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}
            >
                {filteredOffers.map((offer) => (
                    <OfferCard
                        key={offer.id}
                        offer={offer}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </ScrollView>

        </View>
    )
}

export default Offers;