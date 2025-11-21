import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import apiClient from "../api/apiBaseUrl";
import { useVendor } from "../context/VendorContext";
import { useNavigation } from "@react-navigation/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const AddOfferForm = () => {
    const insets = useSafeAreaInsets();

    const [selectedProduct, setSelectedProduct] = useState("");
    const [offerType, setOfferType] = useState("percent");
    const [discountValue, setDiscountValue] = useState("");
    const [productPrice,SetProductPrice] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [minPurchaseEnabled, setMinPurchaseEnabled] = useState(false);
    const [minPurchaseValue, setMinPurchaseValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const { vendorData } = useVendor();
    const navigation = useNavigation<any>();
    const [description, setDescription] = useState("");


    const offerTypes = [
        { label: "% Discount", value: "percent" },
        { label: "Fixed Amount", value: "fixed" },
        { label: "BOGO", value: "bogo" },
    ];

    const handleSave = () => {
        if (!selectedProduct || !discountValue) {
            Alert.alert("Please fill all required fields");
            return;
        }
        console.log({
            product: selectedProduct,
            offerType,
            discountValue,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
            minPurchaseRequired: minPurchaseEnabled,
            minPurchaseValue: minPurchaseEnabled ? minPurchaseValue : "N/A",
        });
        Alert.alert("Offer saved!");
    };

    const fetchProductsOnly = async (vendorId: string) => {
        try {
            setLoading(true);
            const response = await apiClient.get(
                `api/public/product/getAll?vendorId=${vendorId}`
            );
            const data = Array.isArray(response.data)
                ? response.data.map((p: any) => ({
                    id: p.id,
                    label: p.productName,
                    value: p.id.toString(),
                    price: p.price,
                    imageUrl: p.imageUrl,
                    stockQuantity: p.stockQuantity,
                    subCategoryName: p.subCategoryName,
                    activeStatus: p.activeStatus,
                    type: "product",
                }))
                : [];

            setProducts(data);
        } catch (error: any) {
            console.error("Fetch Products Error:", error.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsOnly(vendorData?.id!);
    }, [vendorData?.id]);

    return (
        <View
            style={{ flex: 1, backgroundColor: "#fff" }}
        >

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    {/* Product Selection */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">1. Select Product</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={selectedProduct}
                                onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                            >
                                <Picker.Item label="Choose a product..." value="" />
                                {products.map((p) => (
                                    <Picker.Item key={p.value} label={p.label} value={p.value} />
                                ))}
                            </Picker>
                        </View>

                        <Text className="text-sm font-medium mb-1 mt-4">Product Price</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                            <TextInput
                                className="flex-1 h-12 text-lg "
                                keyboardType="numeric"
                                 placeholder=""
                                value={productPrice}
                                onChangeText={SetProductPrice}
                            />
                          
                        </View>

                    </View>

                    {/* Offer Type */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">2. Define Discount Type</Text>
                        <View className="flex-row bg-gray-200 rounded-xl">
                            {offerTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    className={`flex-1 py-3 items-center ${offerType === type.value ? "bg-green-600 rounded-xl" : ""
                                        }`}
                                    onPress={() => setOfferType(type.value)}
                                >
                                    <Text
                                        className={`font-semibold ${offerType === type.value ? "text-white" : "text-gray-700"
                                            }`}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Discount Value */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium mb-1">Discount Value</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                            <TextInput
                                className="flex-1 h-12 text-lg"
                                keyboardType="numeric"
                                placeholder={
                                    offerType === "percent" ? "20" : offerType === "fixed" ? "5.00" : "1"
                                }
                                value={discountValue}
                                onChangeText={setDiscountValue}
                            />
                            <Text className="ml-2 font-semibold">
                                {offerType === "percent" ? "%" : offerType === "fixed" ? "$" : "Qty"}
                            </Text>
                        </View>
                    </View>

                    {/* Validity Period */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">3. Set Validity Period</Text>
                        <View className="flex-row space-x-3 gap-2">
                            <View className="flex-1">
                                <Text className="text-sm font-medium mb-1">Start Date</Text>
                                <TouchableOpacity
                                    className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                    onPress={() => setShowStartPicker(true)}
                                >
                                    <Text>{startDate.toISOString().split("T")[0]}</Text>
                                </TouchableOpacity>
                                {showStartPicker && (
                                    <DateTimePicker
                                        value={startDate}
                                        mode="date"
                                        display="default"
                                        onChange={(e, date) => {
                                            setShowStartPicker(false);
                                            if (date) setStartDate(date);
                                        }}
                                    />
                                )}
                            </View>

                            <View className="flex-1">
                                <Text className="text-sm font-medium mb-1">End Date</Text>
                                <TouchableOpacity
                                    className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                    onPress={() => setShowEndPicker(true)}
                                >
                                    <Text>{endDate.toISOString().split("T")[0]}</Text>
                                </TouchableOpacity>
                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endDate}
                                        mode="date"
                                        display="default"
                                        onChange={(e, date) => {
                                            setShowEndPicker(false);
                                            if (date) setEndDate(date);
                                        }}
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Optional Conditions */}
                    <View className="mb-6">
                        <Text className="text-lg font-semibold mb-2">4. Optional Conditions</Text>

                        <Text className="text-sm font-medium text-gray-700 mt-3">
                            Description
                        </Text>

                        <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                placeholder="Describe your product or service in detail..."
                                className="text-sm text-gray-800 py-3 h-[120px]"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-sm font-medium">Minimum Purchase Required?</Text>
                            <Switch
                                value={minPurchaseEnabled}
                                onValueChange={setMinPurchaseEnabled}
                                thumbColor={minPurchaseEnabled ? "#4CAF50" : "#f4f3f4"}
                                trackColor={{ false: "#ccc", true: "#a5d6a7" }}
                            />
                        </View>

                        {minPurchaseEnabled && (
                            <View>
                                <Text className="text-sm font-medium mb-1">Minimum Purchase Amount ($)</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg h-12 px-3 bg-white"
                                    keyboardType="numeric"
                                    value={minPurchaseValue}
                                    onChangeText={setMinPurchaseValue}
                                    placeholder="25.00"
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Save Button at Bottom */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 16,
                        backgroundColor: "white",
                        borderTopWidth: 1,
                        borderTopColor: "#e2e2e2",
                        bottom: insets.bottom || 0,
                    }}
                >
                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginRight: 8,
                            backgroundColor: "#ccc",
                            paddingVertical: 12,
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            backgroundColor: "#358362",
                            paddingVertical: 12,
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                        onPress={handleSave}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                            Save Offer
                        </Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
};

export default AddOfferForm;
