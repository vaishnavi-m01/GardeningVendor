import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type Offer = {
    id: string;
    name: string;
    type: string;
    imageUrl: any;
    status: "ACTIVE" | "SCHEDULED" | "ARCHIVED" | "ENDED";
    activeUntil: string;
    extraInfo?: string;
};

type OfferCardProps = {
    offer: Offer;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete }) => {
    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        ACTIVE: { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" },
        SCHEDULED: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-500" },
        ENDED: { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-400" },
        ARCHIVED: { bg: "bg-gray-200", text: "text-gray-600", border: "border-gray-400" },
    };

    const colors = statusColors[offer.status];

    return (
        <View className={`flex-row bg-white rounded-xl p-4 mb-4 border-l-4 ${colors.border} shadow`}>
            {/* Product Image */}
            <Image
                source={offer.imageUrl}
                className={`w-16 h-16 rounded-lg border border-gray-100 ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "opacity-70" : ""
                    }`}
            />

            {/* Details */}
            <View className="flex-1 ml-4">
                <Text
                    className={`text-lg font-extrabold ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "text-gray-500 line-through" : "text-gray-900"
                        } truncate`}
                >
                    {offer.name}
                </Text>
                <Text
                    className={`text-sm font-semibold mt-1 ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "text-gray-400 line-through" : "text-indigo-700"
                        }`}
                >
                    {offer.type}
                </Text>


                {/* Active Until + Status Badge Row */}
                <View className="flex-row items-center mt-2">
                    {/* Left: Active Until */}
                    <Text className="text-xs text-gray-500 flex-1">
                        Active until: {offer.activeUntil}
                    </Text>

                    {/* Right: Status Badge */}

                </View>



                {offer.extraInfo && <Text className="text-xs text-red-600 font-bold mt-1">{offer.extraInfo}</Text>}


                <View className="flex-row justify-between items-center">

                    <Text className="text-xs text-gray-400 mt-1">ID: {offer.id}</Text>

                  
                </View>

            </View>

            {/* Actions */}
            <View className="flex-shrink-0 items-end space-y-2 ml-2">
                <View className="flex-row space-x-2 gap-2">
                    <TouchableOpacity
                        disabled={offer.status === "ENDED" || offer.status === "ARCHIVED"}
                        onPress={() => onEdit(offer.id)}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Text
                            className={`text-base ${offer.status === "ENDED" || offer.status === "ARCHIVED" ? "text-gray-300" : "text-gray-500"
                                }`}
                        >
                            ✏️
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onDelete(offer.id)} className="p-2 rounded-full bg-red-50">
                        <Text className="text-red-600 text-base">🗑️</Text>
                    </TouchableOpacity>
                </View>
                  <View className={` px-2 py-1 rounded-full items-end mt-10  ${colors.bg}`}>
                        <Text className={`text-xs font-semibold ${colors.text}`}>
                            {offer.status.replace("_", " ")}
                        </Text>
                    </View>
            </View>
        </View>
    );
};

export default OfferCard;
