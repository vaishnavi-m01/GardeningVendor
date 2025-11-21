import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import PlantsCard from "../component/Products/PlantsCard";

const plantsData = [
    { id: "1", name: "Plants by Types", image: require("../assets/images/Plants1.png") },
    { id: "2", name: "Plants by Season", image: require("../assets/images/Plants2.jpg") },
    { id: "3", name: "Plants by Location", image: require("../assets/images/Plants3.png") },
    { id: "4", name: "Foliage Plants", image: require("../assets/images/Plants4.png") },
    { id: "5", name: "Flowering Plants", image: require("../assets/images/Plants5.jpg") },
    { id: "6", name: "Plants by Features..", image: require("../assets/images/Plants6.jpg") },
    { id: "7", name: "Plants by Color", image: require("../assets/images/Plants7.jpg") },
];

const Plants = () => {
    const navigation = useNavigation();

    const handlePress = (item: { id: string; name: string }) => {
        if (item.name === "Plants by Types") {
            navigation.navigate("PlantsType" as never);
        } else {
            console.log(`${item.name} clicked`);
        }
    };

    return (
        <View className="flex-1 bg-gray-100 mx-2">
            <FlatList
                data={plantsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PlantsCard
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        onPress={() => handlePress(item)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Plants;
