import { useNavigation } from "@react-navigation/core";
import React from "react";
import { View, Text, Image, TouchableOpacity, ToastAndroid } from "react-native";
import apiClient from "../api/apiBaseUrl";

type Offer = {
    id: number;
    product: string;
    offerName: string;
    description: string;
    type: "Product" | "Service";
    imageUrl?: string;
    status: "ACTIVE" | "SCHEDULED" | "ARCHIVED" | "ENDED";
    validTo: string;
};

type OfferCardProps = {
    offer: Offer;
    onEdit: (id: string) => void
    onDelete: (id: number) => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete }) => {
    const navigation = useNavigation<any>();

    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        ACTIVE: { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" },
        SCHEDULED: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" },
        ENDED: { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-400" },
        ARCHIVED: { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-400" },
    };

    const colors = statusColors[offer.status];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const deleteOffer = async () => {
        try {
            await apiClient.delete(`api/public/${offer.type === "Product" ? "offers" : "serviceOffers"}/delete/${offer.id}`);
            ToastAndroid.show("Offer deleted successfully", ToastAndroid.SHORT);
            onDelete(offer.id);
        } catch (error) {
            ToastAndroid.show("Failed to delete offer", ToastAndroid.SHORT);
            console.log("Delete Error:", error);
        }
    };

    return (
        <View className={`flex-row bg-white rounded-xl p-4 mb-4 border-l-4 ${colors.border} shadow`}>
            {/* Offer Image */}
            <Image
                source={{
                    uri: offer.imageUrl ? offer.imageUrl : "https://via.placeholder.com/150",
                }}
                className={`w-16 h-16 rounded-lg border border-gray-100 ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "opacity-70" : ""}`}
            />

            {/* Details */}
            <View className="flex-1 ml-4">
                {offer.offerName ? (
                    <Text
                        className={`text-lg font-extrabold ${offer.status === "ENDED" || offer.status === "ARCHIVED"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                            } truncate`}
                    >
                        {offer.offerName}
                    </Text>
                ) : null}

                <Text>{offer.product}</Text>
                {offer.description ? (
                    <Text
                        className={`text-sm mt-1 ${offer.status === "ENDED" || offer.status === "ARCHIVED"
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                            }`}
                            numberOfLines={1}
                    >
                        {offer.description}
                    </Text>
                ) : null}

                <Text className="text-xs text-gray-500 mt-1">
                    Active until: {formatDate(offer.validTo)}
                </Text>
            </View>

            {/* Actions */}
            <View className="flex-shrink-0 items-end space-y-2 ml-2">
                <View className="flex-row space-x-2 gap-2">
                    <TouchableOpacity
                        disabled={offer.status === "ENDED" || offer.status === "ARCHIVED"}
                        onPress={() => navigation.navigate("AddOfferForm", { id: offer.id, type: offer.type })}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Text className={`text-base ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "text-gray-300" : "text-gray-500"}`}>
                            ✏️
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={deleteOffer} className="p-2 rounded-full bg-red-50">
                        <Text className="text-red-600 text-base">🗑️</Text>
                    </TouchableOpacity>
                </View>

                <View className={`px-2 py-1 rounded-full mt-6 ${colors.bg}`}>
                    <Text className={`text-xs font-semibold ${colors.text}`}>{offer.status.replace("_", " ")}</Text>
                </View>
            </View>
        </View>
    );
};

export default OfferCard;
