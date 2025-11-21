import { Image, Text, TouchableOpacity, View } from "react-native";

type data = {
  id: string;
  image: string | number;
  name: string;
  onPress?: () => void;
};

const PlantsCard = ({ id, name, image, onPress }: data) => {
  return (
    <View className="flex-1 ">
      <View className="flex flex-row gap-2 mt-4 items-center">
       
        <View
          className="w-[92px] h-[92px] rounded-full items-center justify-center"
          style={{
            borderWidth: 6,
            borderColor: "#A1E486",
          }}
        >
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            className="w-[80px] h-[80px] rounded-full"
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          onPress={onPress}
          className="flex flex-row bg-[#003602] w-[240px] h-[50px] rounded-full items-center justify-between px-6 active:opacity-80"
        >
          <Text className="text-[#FFFFFF] text-[16px] font-semibold font-LeagueSpartan">
            {name}
          </Text>
          <Image
            source={require("../../assets/images/leaf.png")}
            className="w-[30px] h-[30px]"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlantsCard;
