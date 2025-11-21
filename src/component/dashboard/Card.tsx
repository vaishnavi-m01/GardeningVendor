import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

type Data = {
    id: string;
    unique?: string;
    date?: string;
    name: string;
    amount: number;
    title: string;
};

const Card = ({ id, unique, date, name, amount, title }: Data) => {
    const navigation = useNavigation<any>();
    const words = title.split(" ");
    const shortTitle = words.length > 8 ? words.slice(0, 8).join(" ") + "..." : title;

    return (
        <TouchableOpacity className="flex-row items-center justify-between border border-[#00000040] rounded-[10px] w-[330px] h-[55px] overflow-hidden bg-white mb-3"
            onPress={() =>
                navigation.navigate("SalesDetails", {
                    id,
                    unique,
                    date,
                    name,
                    amount,
                    title,
                })
            }>

            <View className="flex-row items-center px-3 flex-1">
                <Text
                    className="text-[#242224] font-[Jost] font-medium text-[15px]"
                    numberOfLines={1}
                >
                    {name} | {shortTitle} |
                </Text>
                <Text className="text-[#242224] font-[Jost] font-bold text-[15px] ml-1">
                    ₹ {amount.toLocaleString("en-IN")}
                </Text>
            </View>


            <AntDesign
                name="right"
                color="#003602"
                size={20}
                style={{ marginRight: 10 }}
            />


            <View className="bg-[#003602] w-[10px] h-full rounded-tr-[10px] rounded-br-[10px]" />
        </TouchableOpacity>
    );
};

export default Card;
