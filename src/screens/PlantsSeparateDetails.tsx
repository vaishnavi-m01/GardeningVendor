import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types/type";
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../api/apiBaseUrl";
import { useNavigation } from "@react-navigation/core";
import GradientHeader from "../utils/GradientHeader";
import Feather from "react-native-vector-icons/Feather";


type Props = NativeStackScreenProps<RootStackParamList, "PlantsSeparateDetails">;

const screenWidth = Dimensions.get("window").width;

const PlantsSeparateDetails = ({ route }: Props) => {
  const { id, Name, image } = route.params;
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [reviewLimit, setReviewLimit] = useState(5);
  const remaining =
    product?.reviewProductDto?.length
      ? product.reviewProductDto.length - reviewLimit
      : 0;



  // Resolve image source safely for string uri, local require (number), or product image
  const resolveImageSource = () => {
    const fallback = 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';
    if (product?.imageUrl) return { uri: product.imageUrl };
    if (typeof image === 'string') return { uri: image };
    if (typeof image === 'number') return image;
    return { uri: fallback };
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await apiClient.get(
        `api/public/product/getOne/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return Alert.alert("Error", "No product ID found to delete.");
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              console.log(" Deleting product:", id);

              const res = await apiClient.delete(`/api/public/product/delete/${id}`);

              if (res.status === 200) {
                ToastAndroid.show("Product deleted successfully!", ToastAndroid.SHORT);
                navigation.navigate("MainTabs", {
                  screen: "MainTabs",
                  params: {
                    screen: "Products",
                  },
                });
              } else {
                Alert.alert("Error", "Failed to delete product. Please try again.");
              }
            } catch (err) {
              console.error(" Delete Error:", err);
              Alert.alert("Error", "Something went wrong while deleting the product.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}
      >
        <ActivityIndicator size="large" color="#003602" />
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}
      >
        <Text style={{ color: "red" }}>Failed to load product details.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", }}>

      <GradientHeader
        title={product?.productName ? product.productName : "Plant Details"}
        onBack={() => navigation.goBack()}
        rightIcon="edit"
        onRightPress={() =>
          navigation.navigate("AddProductForm", {
            productId: id
          })
        }

      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, marginTop: 10 }}
      >
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={resolveImageSource() as any}
              style={{
                width: screenWidth - 22,
                height: 223,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>


          {/* Name and Price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {product.productName || Name}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#003602" }}>
              ₹{product.price ?? "—"}
            </Text>
          </View>

          {/* Rating */}
          {product?.averageRating > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
              <Ionicons name="star" color="#FFE70C" size={18} />
              <Text style={{ marginLeft: 4, fontSize: 12, color: "#666" }}>
                {product.averageRating} ({product.totalRatingCount} Reviews)
              </Text>
            </View>
          )}


          {/* Description */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#2A2A2A",
              marginTop: 16,
            }}
          >
            Description
          </Text>
          <Text
            style={{
              color: "#666666",
              marginBottom: 8,
              lineHeight: 20,
              fontSize: 13,
              textAlign: "justify",
            }}
          >
            {product.description || "No description available."}
          </Text>

          <View style={{ paddingHorizontal: 6, marginTop: 10 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#2A2A2A",
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              Benefits
            </Text>

            {(product?.benefits?.length > 0
              ? product.benefits
              : [
                "Improves plant health",
                "Enhances growth performance",
                "Eco-friendly material",
                "Safe for all plant types",
                "Long-lasting and durable",
              ]
            ).map((benefit: any, index: any) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
              >
                <Text style={{ fontSize: 14, marginRight: 8 }}>•</Text>
                <Text style={{ fontSize: 14 }}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* ---------- Review Section ---------- */}
          {product?.reviewProductDto?.length > 0 && (
            <View style={{ marginTop: 22, marginBottom: 10, }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#2A2A2A",
                  marginBottom: 10,
                }}
              >
                Reviews
              </Text>

              <View style={{
                backgroundColor: "#fff",
                padding: 14,
                borderRadius: 10,
                marginBottom: 14,
                elevation: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}>
                {product.reviewProductDto
                  .slice(0, reviewLimit)
                  .map((review: any, index: any) => (
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
                      {/* Username + Verified + Date */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontSize: 14, fontWeight: "600", color: "#2A2A2A" }}>
                            {review.userName}
                          </Text>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#22C55E"
                            style={{ marginLeft: 6 }}
                          />
                          <Text style={{ fontSize: 11, color: "#22C55E", marginLeft: 4 }}>
                            Verified
                          </Text>
                        </View>

                        {/* Date format: Oct 17, 2025 */}
                        {review?.createdDate && (
                          <Text style={{ fontSize: 11, color: "#999" }}>
                            {(() => {
                              const date = new Date(review.createdDate);
                              const months = [
                                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                              ];
                              return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                            })()}
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


                      {/* Review text */}
                      {review.reviewText ? (
                        <Text
                          style={{
                            marginTop: 6,
                            fontSize: 13,
                            color: "#555",
                            lineHeight: 19,
                            textAlign: "justify",
                          }}
                        >
                          {review.reviewText}
                        </Text>
                      ) : null}
                    </View>
                  ))}

                {/* Load More Reviews Button */}

                {product.reviewProductDto.length > reviewLimit && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 12
                    }}
                    onPress={() => {
                      setReviewLimit(prev => prev + 5);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: "#0A8A2A",
                        marginRight: 6,
                      }}
                    >
                      Load More Review ({remaining} remaining)
                    </Text>
                    <Feather name="chevron-down" size={18} color="#0A8A2A" />
                  </TouchableOpacity>
                )}

              </View>



            </View>
          )}



        </ScrollView>

        {/*  Bottom Buttons — show only if from My Product */}
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            paddingTop: 6,
            backgroundColor: "white",
            borderTopWidth: 0.3,
            borderColor: "#ddd",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#003602",
              borderRadius: 30,
              paddingVertical: 12,
              marginRight: 6,
            }}
            onPress={() => navigation.navigate("AddProductForm", { productId: id })}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#003602",
              borderRadius: 30,
              paddingVertical: 12,
              marginLeft: 6,
            }}
            onPress={handleDelete}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View> */}

      </KeyboardAvoidingView>
    </View>
  );
};

export default PlantsSeparateDetails;
