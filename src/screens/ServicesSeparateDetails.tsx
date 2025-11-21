import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    Image,
    Text,
    View,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types/type";
import React, { useEffect, useState } from "react";
import apiClient from "../api/apiBaseUrl";
import { useNavigation } from "@react-navigation/core";
import GradientHeader from "../utils/GradientHeader";

type Props = NativeStackScreenProps<RootStackParamList, "ServicesSeparateDetails">;

const screenWidth = Dimensions.get("window").width;

interface Service {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    rating?: number;
    reviewCount?: number;
    benefits?: string[];
}

const defaultServiceBenefits = [
    "Remove unwanted weeds",
    "Improve overall garden appearance",
    "Promotes healthy plant growth",
    "Enhance soil health",
    "Eco-friendly and safe for all plants",
];

const ServicesSeparateDetails = ({ route }: Props) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            const response = await apiClient.get(`api/public/services/getOne/${id}`);
            const s = response.data;
            setService({
                id: s.id,
                name: s.name,
                imageUrl: s.imageUrl,
                price: s.price || 0,
                description: s.description || "No description available",
                rating: s.rating || 0,
                reviewCount: s.reviewCount || 0,
                benefits: s.benefits ?? [], // ensure benefits is an array
            });
        } catch (error: any) {
            console.error("Service fetch error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <ActivityIndicator size="large" color="#003602" />
            </View>
        );
    }

    if (!service) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
                <Text style={{ color: "red" }}>Failed to load service details.</Text>
            </View>
        );
    }

    // Combine service benefits or fallback to default
    const benefitsList: string[] = (service.benefits ?? []).length > 0
        ? service.benefits!
        : defaultServiceBenefits;

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <GradientHeader
                title={service.name}
                onBack={() => navigation.goBack()}
                rightIcon="edit"
                onRightPress={() =>
                    navigation.navigate("AddProductForm", {
                        serviceId: id,
                        isService: true,
                    })
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1, marginTop: 10 }}
            >
                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image */}
                    <View style={{ alignItems: "center" }}>
                        <Image
                            source={{
                                uri: service.imageUrl || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
                            }}
                            style={{ width: screenWidth - 22, height: 223, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Name & Price */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>{service.name}</Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#003602" }}>₹{service.price}</Text>
                    </View>

                    {/* Rating */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                        <Ionicons name="star" color="#FFE70C" size={18} />
                        <Text style={{ marginLeft: 4, fontSize: 12, color: "#666" }}>
                            {service.rating} ({service.reviewCount} Reviews)
                        </Text>
                    </View>

                    {/* Description */}
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#2A2A2A", marginTop: 16 }}>Description</Text>
                    <Text style={{ color: "#666666", marginBottom: 8, lineHeight: 20, fontSize: 13, textAlign: "justify" }}>
                        {service.description}
                    </Text>

                    {/* Benefits */}
                    <View style={{ paddingHorizontal: 6, marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#2A2A2A", marginTop: 16, marginBottom: 4 }}>
                            Benefits
                        </Text>

                        <View style={{ marginTop: 10 }}>
                            {benefitsList.map((benefit, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}
                                >
                                    <View
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: "#0c6b4b",
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text style={{ fontSize: 14, color: "#333" }}>{benefit}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ServicesSeparateDetails;
