import React from "react";
import { View, Text } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

type Data = {
    id: string;
    unique?: string;
    date?: string;
    name: string;
    amount: number;
    title: string;
};

const CardDetails = ({ id, unique, date, name, amount, title }: Data) => {
    const initial = name?.charAt(0)?.toUpperCase() || "?";

    return (
        <View className="bg-white border border-[#DADADA] rounded-[12px] w-[345px] overflow-hidden shadow-md">
            {/* Header Row */}
            <View className="flex-row items-center justify-between p-4 pb-2">
                <View className="flex-row items-center gap-3">
                    <View className="bg-[#359907] w-[45px] h-[45px] rounded-full justify-center items-center">
                        <Text className="text-white text-[20px] font-semibold">{initial}</Text>
                    </View>
                    <Text className="text-[17px] font-semibold text-[#000000]">{name}</Text>
                </View>
                <Entypo name="dots-three-vertical" color="#000" size={20} />
            </View>

            {/* Details Section */}
            <View className="px-4 pb-4">
                <View className="flex-row">
                    <Text className="text-[15px] font-semibold text-[#000000] w-[120px]">Date</Text>
                    <Text className="text-[15px] text-[#000000]">{date}</Text>
                </View>

                <View className="flex-row mt-1">
                    <Text className="text-[15px] font-semibold text-[#000000] w-[120px]">Id</Text>
                    <Text className="text-[15px] text-[#000000]">{unique}</Text>
                </View>

                <View className="flex-row mt-1">
                    <Text className="text-[15px] font-semibold text-[#000000] w-[120px]">Description</Text>
                    <Text
                        className="text-[15px] text-[#000000] flex-1"
                        numberOfLines={1}
                    >
                        Lorem ipsum dolor sit amet,
                    </Text>
                </View>

                <View className="flex-row mt-1">
                    <Text className="text-[15px] font-semibold text-[#000000] w-[120px]">Amount</Text>
                    <Text className="text-[15px] text-[#000000]">
                        ₹{amount.toLocaleString("en-IN")}
                    </Text>
                </View>
            </View>

            {/* Bottom Green Bar */}
            <View className="bg-[#003602] h-[16px]" />
        </View>
    );
};

export default CardDetails;
