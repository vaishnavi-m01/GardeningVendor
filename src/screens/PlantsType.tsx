import { TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import PlantsCard from "../component/Products/PlantsCard";
import PlantsTypeCard from "../component/Products/PlantsTypeCard";
import { useNavigation } from "@react-navigation/core";

const plantsData = [
    { id: "1", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType1.jpg") },
    { id: "2", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType2.png") },
    { id: "3", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType3.jpg") },
    { id: "4", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType4.png") },
    { id: "5", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType5.png") },
    { id: "6", name: "Adenium Plant, Desert Rose", image: require("../assets/images/PlantsType6.png") },
];

const PlantsType = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-gray-100 mx-2">
            <FlatList
                key={"plants"}
                data={plantsData}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("PlantsSeparateDetails", {
                                id: item.id,
                                Name: item.name,
                                image: item.image,
                            })
                        }
                    >
                        <PlantsTypeCard id={item.id} name={item.name} image={item.image} />

                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                }}
                contentContainerStyle={{
                    paddingBottom: 60,
                    paddingTop: 4,
                }}
                showsVerticalScrollIndicator={false}


            />
        </View>
    )
}

export default PlantsType