import { Image, Text, TouchableOpacity, View } from "react-native";

type data = {
    id: string;
    image: string | number;
    name: string;
    onPress?: () => void;

}
const PlantsTypeCard = ({ id, image, name }: data) => {
    return (
        <View className="rounded-2xl shadow-md w-[170px] h-[220px] mb-2 p-3  bg-[#E1FFDE] ">
            <Image
                source={typeof image === "string" ? { uri: image } : image}
                className="w-full h-[110px] rounded-xl"
                resizeMode="cover"
            />

            <Text className="font-LeagueSpartan font-semibold text-[12px] text-[#333333] mt-2 leading-4">
                {name}
            </Text>

            {/* <Text className="text-[#003602] font-LeagueSpartan font-semibold text-[15px] mt-2 text-center">
                ₹299
            </Text> */}

            <TouchableOpacity className="bg-[#003602] rounded-md py-2 mt-4">
                <Text className="text-center text-white font-LeagueSpartan font-semibold text-[14px]">
                    Edit
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PlantsTypeCard;
