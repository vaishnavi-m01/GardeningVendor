import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


const BookingsDetails = ({ id, name, image, price, contact, isProcessing, showLabel, onAccept }: any) => {
    return (
        <View className="flex-1 mx-1 mt-2">
            <View className="bg-[#E1FFDE] rounded-lg p-3 mx-1 shadow-sm">
                <View className="flex-row items-start">
                    <Image
                        source={typeof image === "string" ? { uri: image } : image}
                        className="h-[100px] w-[85px] rounded-[10px]"
                    />

                    <View className="flex-1 ml-3">
                        <View className="flex-row justify-between items-center mb-1">
                            <Text className="font-LeagueSpartan font-bold text-[#003602] text-[14px] flex-shrink">
                                {name}
                            </Text>
                            <Text className="font-LeagueSpartan font-semibold text-[15px] text-[#003602]">
                                ₹{price}
                            </Text>
                        </View>

                        <Text className="text-[#2A2A2A] text-[13px] font-LeagueSpartan leading-4 mb-2">
                            Vestibulum eu quam nec neque efficitur id eget nisl. Proin porta.
                        </Text>

                        {/* Location and Contact */}
                        <View className="flex-row justify-between mb-2 gap-2">
                            <Text className="text-[11px] text-[#2A2A2A] font-LeagueSpartan font-semibold">
                                Location: Madurai
                            </Text>
                            <Text className="text-[11px] text-[#2A2A2A] font-LeagueSpartan font-semibold">
                                Contact: {contact}
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View className="h-[40px] mt-1 justify-center">
                            {isProcessing ? (
                                <View className="flex-row items-center justify-center bg-[#E1FFDE] rounded-[5px] px-6 py-1.5 w-full">
                                    <ActivityIndicator size="small" color="#003602" />
                                    <Text className="ml-2 font-LeagueSpartan font-semibold text-[12px] text-[#003602]">
                                        Processing...
                                    </Text>
                                </View>
                            ) : showLabel ? (
                                <View className="bg-[#E1FFDE] rounded-[5px] w-full flex-row gap-2 items-center px-3 py-1.5">
                                    <Ionicons name="timer-outline" color="#000" size={20} />
                                    <Text className="font-LeagueSpartan font-semibold text-[14px] text-[#003602]">
                                        Processing
                                    </Text>
                                </View>
                            ) : (
                                <View className="flex-row gap-3 justify-between">
                                    <TouchableOpacity
                                        className="bg-[#003602] rounded-[5px] px-6 py-1.5 flex-1 mr-2"
                                        onPress={() => onAccept(id)}
                                    >
                                        <Text className="font-LeagueSpartan font-semibold text-[12px] text-white text-center">
                                            Accept
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity className="bg-[#D30000] rounded-[5px] px-6 py-1.5 flex-1">
                                        <Text className="font-LeagueSpartan font-semibold text-[12px] text-white text-center">
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                    </View>
                </View>
            </View>
        </View>
    );
};

export default BookingsDetails