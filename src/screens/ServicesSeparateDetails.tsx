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
    TouchableOpacity,
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
    totalRatingCount?: number;
    averageRating?: number;
    benefits?: string[];
    reviewServiceDto?: {
        userId: number;
        userName: string;
        rating: number;
        reviewText: string;
        createdDate?: string;
    }[];
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
    console.log("servicess", service)
    const [loading, setLoading] = useState(true);

    const [reviewLimit, setReviewLimit] = useState(5);
    const reviews = service?.reviewServiceDto ?? [];


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
                averageRating: s.averageRating || 0,
                totalRatingCount: s.totalRatingCount || 0,
                benefits: s.benefits ?? [],
                reviewServiceDto: s.reviewServiceDto ?? [],
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
                    {service?.averageRating !== undefined && service?.averageRating > 0 && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                            <Ionicons name="star" color="#FFE70C" size={18} />
                            <Text style={{ marginLeft: 4, fontSize: 12, color: "#666" }}>
                                {service?.averageRating ?? 0} ({service?.totalRatingCount ?? 0} Reviews)
                            </Text>
                        </View>
                    )}



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


                        {/* ---------- Review Section ---------- */}
                        {reviews.length > 0 && (
                            <View style={{ marginTop: 22, marginBottom: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#2A2A2A", marginBottom: 10 }}>
                                    Reviews
                                </Text>

                                <View
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        padding: 14,
                                        borderRadius: 10,
                                        marginBottom: 14,
                                        elevation: 1,
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 2,
                                    }}
                                >
                                    {reviews.slice(0, reviewLimit).map((review, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: "#F9F9F9",
                                                padding: 12,
                                                borderRadius: 10,
                                                marginBottom: 12,
                                                borderWidth: 1,
                                                borderColor: "#EFEFEF",
                                            }}
                                        >
                                            {/* User + Verified + Date */}
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#2A2A2A" }}>
                                                        {review.userName}
                                                    </Text>
                                                    <Ionicons name="checkmark-circle" size={16} color="#22C55E" style={{ marginLeft: 6 }} />
                                                    <Text style={{ fontSize: 11, color: "#22C55E", marginLeft: 4 }}>Verified</Text>
                                                </View>

                                                {/* Correct review date formatting */}
                                                {review.createdDate && (
                                                    <Text style={{ fontSize: 11, color: "#999" }}>
                                                        {new Date(review.createdDate).toLocaleString("en-US", {
                                                            month: "short",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </Text>
                                                )}
                                            </View>

                                            {/* Stars */}
                                            <View style={{ flexDirection: "row", marginTop: 6 }}>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Ionicons
                                                        key={i}
                                                        name={i < review.rating ? "star" : "star-outline"}
                                                        size={14}
                                                        color="#FFD60A"
                                                    />
                                                ))}
                                            </View>


                                            {/* Review Text */}
                                            {review.reviewText && (
                                                <Text style={{ marginTop: 6, fontSize: 13, color: "#555", lineHeight: 19, textAlign: "justify" }}>
                                                    {review.reviewText}
                                                </Text>
                                            )}
                                        </View>
                                    ))}

                                    {/* Load More Button */}
                                    {reviews.length > reviewLimit && (
                                        <TouchableOpacity
                                            onPress={() => setReviewLimit(reviewLimit + 5)}
                                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 }}
                                        >
                                            <Text style={{ fontSize: 15, fontWeight: "600", color: "#0A8A2A", marginRight: 6 }}>
                                                Load More Review ({reviews.length - reviewLimit} remaining)
                                            </Text>
                                            <Ionicons name="chevron-down" size={18} color="#0A8A2A" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}




                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ServicesSeparateDetails;
