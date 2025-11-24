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
    ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import apiClient from "../api/apiBaseUrl";
import { useVendor } from "../context/VendorContext";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const AddOfferForm = () => {
    const insets = useSafeAreaInsets();

    const route = useRoute<any>();
    const id = route?.params?.id ?? null;
    const typeFromRoute = route?.params?.type ?? "Product"; // default to Product
    const [selectedType, setSelectedType] = useState<"Product" | "Service">(typeFromRoute);
    console.log("selectedType", selectedType)

    const [offerName, setOfferName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [offerType, setOfferType] = useState("percent");
    const [discountValue, setDiscountValue] = useState("");
    const [productPrice, SetProductPrice] = useState("")
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
    const [price, setPrice] = useState<number | null>(null);

    // const [selectedType, setSelectedType] = useState<"Product" | "Service">("Product");


    //services states
    const [servicesOfferName, setServicesOfferName] = useState("");
    const [services, setServices] = useState<any[]>([]);
    const [selectedServices, setSelectedServices] = useState("");
    const [servicesPrice, setServicesPrice] = useState<number | null>(null);
    const [servicesDiscountValue, setServicesDiscountValue] = useState("");
    const [serviceStartPicker, setServicesStartPicker] = useState(false);
    const [servicesEndPicker, setServicesEndPicker] = useState(false);
    const [servicesDescription, setServicesDescription] = useState("");
    const [servicesStartDate, setServicesStartDate] = useState(new Date());
    const [servicesEndDate, setServicesEndDate] = useState(new Date());


    const [saving, setSaving] = useState(false);



    useEffect(() => {
        if (route?.params?.type) {
            setSelectedType(route.params.type);
        }
    }, [route]);


    const formatDate = (date: Date) => {
        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        return `${d}-${m}-${y}`;
    };

    const offerTypes = [
        { label: "% Discount", value: "percent" },
        { label: "Fixed Amount", value: "fixed_amount" },
        { label: "BOGO", value: "bogo" },
    ];



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


    useEffect(() => {
        fetchProductPrice();
    }, [selectedProduct]);


    const fetchProductPrice = async () => {
        if (!selectedProduct) return
        try {
            const response = await apiClient.get(`api/public/product/getOne/${selectedProduct}`);
            setPrice(response.data.price);
        } catch (error) {
            console.log("Error fetching product price:", error);
        }
    };


    //fetch services

    const fetchServices = async (vendorId: string) => {
        try {
            const response = await apiClient.get(`api/public/services/getAll?vendorId=${vendorId}`)
            const data = Array.isArray(response.data)
                ? response.data.map((p: any) => ({
                    id: p.id,
                    label: p.name,
                    value: p.id.toString(),
                    price: p.price,

                    type: "services",
                }))
                : [];

            setServices(data);
        } catch (error: any) {
            console.error("Fetch Services Error:", error.message);
            setServices([]);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchServices(vendorData?.id!);
    }, [vendorData?.id]);


    //fetchServicesPrices

    const fetchServicesPrices = async () => {
        if (!selectedServices) return
        try {
            const response = await apiClient.get(`api/public/services/getOne/${selectedServices}`)
            setServicesPrice(response.data.price)
        } catch (error) {
            console.error("Error fetchServicesPrices", error)
        }
    }

    useEffect(() => {
        fetchServicesPrices()
    }, [selectedServices])


    //fetchOffers

    const fetchOffers = async () => {
        if (!id) return;
        try {
            const response = await apiClient.get(`api/public/offers/getOne/${id}`);

            setOfferName(response.data.offerName || "");
            setSelectedProduct(response.data.productId?.toString() || "");

            const discountTypeConvert =
                response.data.discountType === "PERCENTAGE"
                    ? "percent"
                    : response.data.discountType === "FIXED_AMOUNT"
                        ? "fixed_amount"
                        : "bogo";

            setOfferType(discountTypeConvert);
            setDiscountValue(response.data.discountValue?.toString() || "");

            setStartDate(new Date(response.data.validFrom));
            setEndDate(new Date(response.data.validTo));

            setDescription(response.data.description || "");
        } catch (error) {
            console.error("fetchOffers", error);
        }
    };


    useEffect(() => {
        fetchOffers()
    }, [id])



    const fetchServicesOffers = async () => {
        if (!id) return;

        try {
            const response = await apiClient.get(`/api/public/serviceOffers/getOne/${id}`);
            const data = response.data;


            setServicesOfferName(data.offerName || "");
            setSelectedServices(data.serviceId?.toString() || "");
            setServicesPrice(data.servicePrice || 0);
            setServicesDiscountValue(data.discountValue?.toString() || "");
            setServicesDescription(data.description || "");
            setServicesStartDate(new Date(data.validFrom));
            setServicesEndDate(new Date(data.validTo));

        } catch (error) {
            console.error("Error fetching service offer:", error);
        }
    };


    useEffect(() => {
        if (selectedType === "Service" && id) {
            fetchServicesOffers();
        }
    }, [id, selectedType]);



    const handleSave = async () => {
        if (!selectedProduct || !discountValue || !startDate || !endDate) {
            Alert.alert("Please fill all required fields");
            return;
        }

        const productObj = products.find(p => p.value === selectedProduct);
        const productName = productObj?.label || "";

        const discountTypeConverted =
            offerType === "percent"
                ? "PERCENTAGE"
                : offerType === "fixed_amount"
                    ? "FIXED_AMOUNT"
                    : "BOGO";

        const payload = {
            id: id ?? 0,
            productId: Number(selectedProduct),
            productPrice: price,
            offerName: offerName || "",
            description: description,
            discountType: discountTypeConverted,
            discountValue: Number(discountValue),
            validFrom: startDate.toISOString().split("T")[0],
            validTo: endDate.toISOString().split("T")[0],
            activeStatus: true,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString()
        };

        console.log("Payload Sent", payload);

        try {
            setSaving(true);
            if (id) {
                // Update existing offer
                await apiClient.put(`api/public/offers/update/${id}`, payload);
                ToastAndroid.show("Offer Updated Successfully! 🎉", ToastAndroid.SHORT);
            } else {
                // Create new offer
                await apiClient.post("api/public/offers/add", payload);
                ToastAndroid.show("Offer Created Successfully! 🎉", ToastAndroid.SHORT);
            }
            navigation.navigate("Offers", { type: selectedType });
        } catch (error: any) {
            console.log("Error saving offer:", error.response?.data || error.message);
            Alert.alert("Failed to save offer");
        } finally {
            setSaving(false);
        }
    };




    const ServicesHandleSave = async () => {
        if (!selectedServices || !servicesDiscountValue || !servicesStartDate || !servicesEndDate) {
            Alert.alert("Please fill all required fields");
            return;
        }

        const payload = {
            id: id ?? 0,
            serviceId: Number(selectedServices),
            servicePrice: servicesPrice || 0,
            offerName: servicesOfferName || "",
            discountValue: Number(servicesDiscountValue),
            description: servicesDescription || "",
            validFrom: servicesStartDate.toISOString().split("T")[0],
            validTo: servicesEndDate.toISOString().split("T")[0],
            activeStatus: true,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        };

        console.log("Payload Sent", payload);

        try {
            setSaving(true);
            if (id) {

                await apiClient.put(`api/public/serviceOffers/update/${id}`, payload);
                ToastAndroid.show("Service Offer Updated Successfully! 🎉", ToastAndroid.SHORT);
            } else {

                await apiClient.post("api/public/serviceOffers/add", payload);
                ToastAndroid.show("Service Offer Created Successfully! 🎉", ToastAndroid.SHORT);
            }
            navigation.navigate("Offers", { type: selectedType });

        } catch (error: any) {
            console.log(" Api error ", error.response?.data || error.message);
            Alert.alert("Failed to save offer");
        } finally {
            setSaving(false);
        }
    };






    return (
        <View
            style={{ flex: 1, backgroundColor: "#fff" }}
        >
            <View
                style={{
                    flexDirection: "row",
                    padding: 12,
                    gap: 10,
                    backgroundColor: "#F9FAFB",
                    elevation: 1
                }}
            >

                <TouchableOpacity
                    onPress={() => setSelectedType("Product")}
                    style={{
                        flex: 1,
                        marginRight: 8,
                        borderRadius: 12,
                        paddingVertical: 12,
                        borderWidth: 2,
                        borderColor: selectedType === "Product" ? "#15803d" : "#d1d5db",
                        backgroundColor: selectedType === "Product" ? "#ecfdf3" : "#fff",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "600", color: selectedType === "Product" ? "#15803d" : "#334155" }}>🌿 Product</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedType("Service")}
                    style={{
                        flex: 1,
                        marginLeft: 8,
                        borderRadius: 12,
                        paddingVertical: 12,
                        borderWidth: 2,
                        borderColor: selectedType === "Service" ? "#15803d" : "#d1d5db",
                        backgroundColor: selectedType === "Service" ? "#ecfdf3" : "#fff",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontWeight: "600", color: selectedType === "Service" ? "#15803d" : "#334155" }}>🛠️ Service</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                    {/* Product Selection */}

                    {selectedType === "Product" && (
                        <View className="mb-6">
                            <Text className="text-lg font-semibold mb-2">1. Offer Name</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                <TextInput
                                    className="flex-1 h-12 text-sm"
                                    placeholder="ex.Winter Green Sale"
                                    value={offerName}
                                    onChangeText={setOfferName}
                                />

                            </View>

                            <Text className="text-sm font-medium mb-1 mt-4"> Select Product <Text className="text-red-500"> *</Text></Text>
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

                            {/* Show this only if a product is selected */}
                            {selectedProduct ? (
                                <>
                                    <Text className="text-sm font-medium mb-1 mt-4">Product Price</Text>
                                    <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                        <TextInput
                                            className="flex-1 h-12 text-lg"
                                            keyboardType="numeric"
                                            placeholder=""
                                            value={price !== null ? price.toString() : ""}
                                            editable={false}
                                        />
                                    </View>
                                </>
                            ) : null}
                        </View>
                    )}


                    {/* Discount Value */}
                    {selectedType === "Product" && (
                        <View className="mb-6">
                            <Text className="text-lg font-semibold mb-2">2. Define Discount Type <Text className="text-red-500">*</Text></Text>
                            <View className="flex-row bg-gray-200 rounded-xl mb-2">
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
                            <Text className="text-sm font-medium mb-1 mt-2">Discount Value <Text className="text-red-500">*</Text></Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                <TextInput
                                    className="flex-1 h-12 text-lg"
                                    keyboardType="numeric"
                                    placeholder={
                                        offerType === "percent" ? "20" : offerType === "fixed_amount" ? "5.00" : "1"
                                    }
                                    value={discountValue}
                                    onChangeText={setDiscountValue}
                                />
                                <Text className="ml-2 font-semibold">
                                    {offerType === "percent" ? "%" : offerType === "fixed_amount" ? "₹" : "Qty"}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Validity Period */}

                    {selectedType === "Product" && (

                        <View className="mb-6">
                            <Text className="text-lg font-semibold mb-2">3. Set Validity Period</Text>
                            <View className="flex-row space-x-3 gap-2">
                                <View className="flex-1">
                                    <Text className="text-sm font-medium mb-1">Start Date <Text className="text-red-500">*</Text></Text>
                                    <TouchableOpacity
                                        className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                        onPress={() => setShowStartPicker(true)}
                                    >
                                        <Text>{formatDate(startDate)}</Text>

                                    </TouchableOpacity>
                                    {showStartPicker && (
                                        <DateTimePicker
                                            value={startDate}
                                            minimumDate={new Date()}
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
                                    <Text className="text-sm font-medium mb-1">End Date <Text className="text-red-500">*</Text></Text>
                                    <TouchableOpacity
                                        className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                        onPress={() => setShowEndPicker(true)}
                                    >
                                        <Text>{formatDate(endDate)}</Text>

                                    </TouchableOpacity>
                                    {showEndPicker && (
                                        <DateTimePicker
                                            value={endDate}
                                            minimumDate={startDate}
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
                    )}



                    {/* Optional Conditions */}
                    {selectedType === "Product" && (
                        <View>
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
                        </View>
                    )}
                    <View className="mb-6">



                        {selectedType === "Service" && (
                            <View className="mb-6">
                                <Text className="text-lg font-semibold mb-2">1. Offer Name</Text>
                                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                    <TextInput
                                        className="flex-1 h-12 text-sm"
                                        placeholder="ex.Garden Care Offer"
                                        value={servicesOfferName}
                                        onChangeText={setServicesOfferName}
                                    />

                                </View>
                                <Text className="text-lg font-semibold mb-2 mt-4">1. Select Category <Text className="text-red-500">*</Text></Text>
                                <View className="border border-gray-300 rounded-lg bg-white">
                                    <Picker
                                        selectedValue={selectedServices}
                                        onValueChange={(itemValue) => setSelectedServices(itemValue)}
                                    >
                                        <Picker.Item label="Choose a Services..." value="" />
                                        {services.map((p) => (
                                            <Picker.Item key={p.value} label={p.label} value={p.value} />
                                        ))}
                                    </Picker>
                                </View>

                                {/* Show this only if a product is selected */}
                                {selectedServices && (
                                    <>
                                        <Text className="text-sm font-medium mb-1 mt-4">Product Price</Text>
                                        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-white">
                                            <TextInput
                                                className="flex-1 h-12 text-lg"
                                                keyboardType="numeric"
                                                placeholder=""
                                                value={servicesPrice !== null ? servicesPrice.toString() : ""}
                                                editable={false}
                                            />
                                        </View>
                                    </>
                                )}

                                <Text className="text-lg font-semibold mb-2 mt-4">2. Fixed Amount <Text className="text-red-500">*</Text></Text>

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#D1D5DB",
                                    borderRadius: 8,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#fff"
                                }}>
                                    <TextInput
                                        className="flex-1 h-12 text-lg"
                                        keyboardType="numeric"
                                        placeholder="ex.100"
                                        value={servicesDiscountValue}
                                        onChangeText={setServicesDiscountValue}
                                    />
                                    <Text style={{ marginLeft: 6, fontSize: 18, }}>₹</Text>
                                </View>


                                <View className="mb-6 mt-4">
                                    <Text className="text-lg font-semibold mb-2">3. Set Validity Period</Text>
                                    <View className="flex-row space-x-3 gap-2">
                                        <View className="flex-1">
                                            <Text className="text-sm font-medium mb-1">Start Date <Text className="text-red-500">*</Text></Text>
                                            <TouchableOpacity
                                                className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                                onPress={() => setServicesStartPicker(true)}
                                            >
                                                <Text>{formatDate(servicesStartDate)}</Text>
                                            </TouchableOpacity>
                                            {serviceStartPicker && (
                                                <DateTimePicker
                                                    value={servicesStartDate}
                                                    minimumDate={new Date()}
                                                    mode="date"
                                                    display="default"
                                                    onChange={(e, date) => {
                                                        setServicesStartPicker(false);
                                                        if (date) setStartDate(date);
                                                    }}
                                                />
                                            )}
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-sm font-medium mb-1">End Date <Text className="text-red-500">*</Text></Text>
                                            <TouchableOpacity
                                                className="h-12 border border-gray-300 rounded-lg justify-center px-3 bg-white"
                                                onPress={() => setServicesEndPicker(true)}
                                            >
                                                <Text>{formatDate(servicesEndDate)}</Text>

                                            </TouchableOpacity>
                                            {servicesEndPicker && (
                                                <DateTimePicker
                                                    value={servicesEndDate}
                                                    minimumDate={servicesStartDate}
                                                    mode="date"
                                                    display="default"
                                                    onChange={(e, date) => {
                                                        setServicesEndPicker(false);
                                                        if (date) setServicesEndDate(date);
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>


                                <Text className="text-lg font-semibold mb-2">4. Optional Conditions</Text>

                                <Text className="text-sm font-medium text-gray-700 mt-3">
                                    Description
                                </Text>

                                <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                                    <TextInput
                                        value={servicesDescription}
                                        onChangeText={setServicesDescription}
                                        multiline
                                        numberOfLines={6}
                                        textAlignVertical="top"
                                        placeholder="Describe your product or service in detail..."
                                        className="text-sm text-gray-800 py-3 h-[120px]"
                                        placeholderTextColor="#999"
                                    />
                                </View>


                            </View>
                        )}


                    </View>
                </ScrollView>

                {/* Save Button at Bottom */}
                <View
                    style={{
                        flexDirection: "row",
                        padding: 16,
                        backgroundColor: "white",
                        borderTopWidth: 1,
                        borderTopColor: "#e2e2e2",
                    }}
                >
                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginRight: 8,        // spacing ONLY on right
                            backgroundColor: "#ccc",
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: "center",
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Save Offer Button */}
                    <TouchableOpacity
                        disabled={saving}
                        onPress={() =>
                            selectedType === "Product" ? handleSave() : ServicesHandleSave()
                        }
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            backgroundColor: saving ? "#94a3b8" : "#15803d",
                            paddingVertical: 14,
                            borderRadius: 12,
                            alignItems: "center",
                            opacity: saving ? 0.7 : 1,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                            {saving ? "Processing..." : "Save Offer"}
                        </Text>
                    </TouchableOpacity>
                </View>



            </KeyboardAvoidingView>
        </View>
    );
};

export default AddOfferForm;
