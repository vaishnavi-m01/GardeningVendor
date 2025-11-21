// AddProductScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  StatusBar,
  Alert,
  Image,
  Platform,
  Keyboard,
  ToastAndroid,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import apiClient from "../api/apiBaseUrl";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import GradientHeader from "../utils/GradientHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServicesDropdown from "../components/ServicesDropDown";
import { convertToRGBA } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


interface MediaFile {
  localUri: string;
  fileName: string;
}
type AddProductFormRouteParams = {
  productId?: string;
  serviceId?: string;
  isService?: boolean;
};
interface PotColorType {
  id: number;
  potColour: string;
  activeStatus: boolean;
}

interface potMaterial {
  id: number;
  potMaterial: string;
  activeStatus: boolean;
}

const AddProductScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // States
  // const [isService, setIsService] = useState(false);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  console.log("ServicesImage", mediaList)
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [serviceComparePrice, servicesComparePrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("");
  const [trackInventory, setTrackInventory] = useState(true);
  const [continueWhenOOS, setContinueWhenOOS] = useState(false);



  const [potColor, setPotColor] = useState("");
  console.log("potColor", potColor)
  const [potColorId, setPotColorId] = useState<number | null>(null);
  console.log("potColorId", potColorId);

  const [potSize, setPotSize] = useState("");
  const [potMaterial, setPotMaterial] = useState("");
  const [potMaterialId, setPotMaterialId] = useState<number | null>(null);
  console.log("potMaterialId", potMaterialId)

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [diameter, setDiameter] = useState("");

  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [potColors, setPotColors] = useState<PotColorType[]>([]);
  console.log("potColors", potColors)

  const [potMaterials, setPotMaterials] = useState<potMaterial[]>([]);
  const [potMaterialModalVisible, setPotMaterialModalVisible] = useState(false);


  const [deliveryTime, setDeliveryTime] = useState("");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("");

  const [publish, setPublish] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [allowReviews, setAllowReviews] = useState(true);


  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  console.log("categories", categories)
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [category, setCategory] = useState("");
  console.log("Category", category)
  const [subcategory, setSubcategory] = useState("");
  console.log("subcategory", subcategory)
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  const initialTags = ["Air Purifying", "Low Maintenance", "Indoor"];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  console.log("inputtt", input)
  console.log("selectedTags", selectedTags)

  const inputRef = useRef<TextInput>(null);

  // Service-specific state
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [pricingType, setPricingType] = useState("Fixed");
  const [requiresSiteVisit, setRequiresSiteVisit] = useState(false);

  const initialServiceTags = ["Garden", "Maintenance", "Outdoor", "Cleanup"];
  const [selectedServiceTags, setSelectedServiceTags] = useState<string[]>([]);
  console.log("selectedServicesTags", selectedServiceTags)
  const [serviceTagInput, setServiceTagInput] = useState("");
  console.log("servicesTag", serviceTagInput)
  const serviceTag = useRef<TextInput>(null);

  const route = useRoute<RouteProp<Record<string, AddProductFormRouteParams>, string>>();
  const { productId, serviceId, isService: initialService } = route.params || {};
  const [isService, setIsService] = useState<boolean>(!!initialService);
  console.log("servicesId", serviceId)

  const [serviceSubCategoryId, setServiceSubCategoryId] = useState<number>(0);
  console.log("servicesSubcategoryId", serviceSubCategoryId)

  const [benefit, setBenefit] = useState("");
  const [benefitsList, setBenefitsList] = useState<string[]>([]);
  console.log("benefitsList", benefitsList)


  const [servicesBenefit, setServicesBenefit] = useState("");
  const [servicesBenefitList, setServicesBenefitList] = useState<string[]>([]);
  const servicesInputRef = useRef<TextInput>(null);


  const handleAddBenefit = () => {
    if (servicesBenefit.trim() && !servicesBenefitList.includes(servicesBenefit.trim())) {
      setServicesBenefitList([...servicesBenefitList, servicesBenefit.trim()]);
      setServicesBenefit("");
    }
  };

  // Remove benefit by index
  const handleServicesRemoveBenefit = (index: number) => {
    const updated = servicesBenefitList.filter((_, i) => i !== index);
    setServicesBenefitList(updated);
  };

  const handleProductAddBenefit = () => {
    if (benefit.trim() && !benefitsList.includes(benefit.trim())) {
      setBenefitsList([...benefitsList, benefit.trim()]);
      setBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    const updated = benefitsList.filter((_, i) => i !== index);
    setBenefitsList(updated);
  };


  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
      fetchPotDetails(productId)
    }
  }, [productId]);

  const [vendorData, setVendorData] = useState<any>(null);
  const [vendorId, setVendorId] = useState<string>("0");
  const selectedCategory = categories.find(c => c.id.toString() === category)?.name;




  useEffect(() => {
    const loadData = async () => {
      try {
        const storedVendor = await AsyncStorage.getItem("vendorData");

        if (storedVendor) {
          const parsedVendor = JSON.parse(storedVendor);
          console.log(" Loaded Vendor:", parsedVendor);
          setVendorData(parsedVendor);

          setVendorId(parsedVendor.id?.toString() ?? "0");
        } else {
          console.warn(" No vendor data found in AsyncStorage");
          setVendorId("0");
        }
      } catch (error) {
        console.error(" Error loading vendor data:", error);
        setVendorId("0");
      }
    };

    loadData();
  }, []);



  const fetchProductDetails = async (id: any) => {
    try {
      const res = await apiClient.get(`api/public/product/getOne/${id}`);
      const data = res.data;
      console.log("Fetched product details:", data);

      setProductName(data.productName || "");
      setDescription(data.description || "");
      setBenefitsList(data.benefits || "")
      setPrice(data.price?.toString() || "");
      setComparePrice(data.basePrice?.toString() || "");
      setStock(data.stockQuantity?.toString() || "");
      setSku(data.sku || "");
      setLowStockAlert(data.lowStockAlert?.toString() || "");
      setCategory(data.categoryId?.toString() || "");
      setSubcategory(data.subCategoryId?.toString() || "");

      setSelectedTags(data.tag || []);
      setFreeDelivery(data.isFreeDelivery || false);
      setDeliveryCharge(data.deliveryCharge?.toString() || "");
      setWeight(data.weight?.toString() || "");
      setDeliveryTime(data.deliveryTime || "");
      setPublish(data.publishProduct || false);
      setFeatured(data.featuredProduct || false);
      setAllowReviews(data.allowedReviews || false);
      setMediaList(
        data.imageUrl
          ? [{ localUri: data.imageUrl, fileName: data.imageUrl.split("/").pop() }]
          : []
      );
    } catch (err) {
      console.error(" Fetch product details failed:", err);
    }
  };


  const fetchPotDetails = async (id: any) => {
    try {
      const response = await apiClient.get(`api/public/pot/getAll?productId=${id}`);
      const data = response.data;

      console.log("POTDetails", data);

      if (Array.isArray(data) && data.length > 0) {
        const pot = data[0];

        setPotSize(pot.potSize || "");
        setPotColorId(pot.potColourId || null);
        setPotMaterialId(pot.potMaterialId || null);
        setHeight(pot.height?.toString() || "");
        setWidth(pot.width?.toString() || "");
        setDiameter(pot.diameter?.toString() || "");
        setWeight(pot.weight?.toString() || "");

        console.log("POT DETAILS LOADED SUCCESSFULLY");
      } else {
        console.log("No pot details found");
      }

    } catch (err) {
      console.error("Fetch pot details failed:", err);
    }
  };



  useEffect(() => {
    if (potColorId && potColors.length > 0) {
      const selected = potColors.find(c => c.id === potColorId);
      if (selected) {
        setPotColor(selected.potColour.charAt(0).toUpperCase() + selected.potColour.slice(1).toLowerCase());
      }
    }
  }, [potColorId, potColors]);

  useEffect(() => {
    if (potMaterialId && potMaterials.length > 0) {
      const selected = potMaterials.find(m => m.id === potMaterialId);
      if (selected) {
        setPotMaterial(selected.potMaterial.charAt(0).toUpperCase() + selected.potMaterial.slice(1).toLowerCase());
      }
    }
  }, [potMaterialId, potMaterials]);





  //  Image picker logic (fixed)
  const pickImages = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 0,
        quality: 0.9,
      });

      if (res.didCancel || !res.assets) return;

      const newFiles: MediaFile[] = res.assets.map((a) => ({
        localUri: a.uri ?? "",
        fileName: a.fileName ?? (a.uri ? a.uri.split("/").pop() ?? "image.jpg" : "image.jpg"),
      }));

      setMediaList((prev) => [...prev, ...newFiles]);
    } catch (err) {
      console.log("pickImages error:", err);
    }
  };

  //  Video picker logic (unchanged, but type safe)
  const pickVideo = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: "video",
        selectionLimit: 1,
      });

      if (res.didCancel || !res.assets?.length) return;

      const asset = res.assets[0];
      const fileName = asset.fileName ?? asset.uri?.split("/").pop() ?? "video.mp4";
      const localUri = asset.uri ?? "";

      setMediaList((prev) => [...prev, { localUri, fileName }]);
    } catch (err) {
      console.log("pickVideo error:", err);
    }
  };

  //  Remove media
  const removeMedia = (file: MediaFile) => {
    Alert.alert("Remove", "Do you want to remove this file?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setMediaList((p) => p.filter((x) => x.localUri !== file.localUri)),
      },
    ]);
  };


  const renderImageUri = (file: MediaFile) => {
    if (file.localUri) return file.localUri;

    if ((file as any).uri) return (file as any).uri;

    return "";
  };


  // create product
  const handlePublish = async () => {
    const allTags = [...selectedTags, ...(input.trim() ? [input.trim()] : [])];
    console.log("allTags", allTags);

    if (!productName.trim()) return Alert.alert("Validation", "Please enter product name");
    if (!category.trim()) return Alert.alert("Validation", "Please select a category");
    if (!subcategory.trim()) return Alert.alert("Validation", "Please select a subcategory");
    if (!description.trim()) return Alert.alert("Validation", "Please enter a description");
    if (!price.trim()) return Alert.alert("Validation", "Please enter product price");
    if (!stock.trim()) return Alert.alert("Validation", "Please enter product stock quantity");

    setLoading(true);
    try {
      const productPayload = {
        id: productId || 0,
        vendorId: parseInt(vendorId) || 0,

        categoryId: parseInt(category),
        subCategoryId: parseInt(subcategory),
        sku,
        productName,
        description,
        benefits: benefitsList,
        basePrice: comparePrice ? parseFloat(comparePrice) : 0,
        price: parseFloat(price),
        stockQuantity: parseInt(stock),
        lowStockAlert: lowStockAlert ? parseInt(lowStockAlert) : 0,
        activeStatus: publish,
        isFreeDelivery: freeDelivery,
        deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : 0,
        weight: weight ? parseFloat(weight) : 0,
        deliveryTime,
        publishProduct: publish,
        featuredProduct: featured,
        allowedReviews: allowReviews,
        tag: allTags,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        imageUrl: "",
      };

      console.log("Submitting product:", productPayload);

      const apiUrl = productId
        ? `api/public/product/update/${productId}`
        : `api/public/product/add`;

      const res = productId
        ? await apiClient.put(apiUrl, productPayload)
        : await apiClient.post(apiUrl, productPayload);

      if (res.status === 200 || res.status === 201) {
        const currentProductId = productId || res.data?.id;
        console.log("Product saved:", currentProductId);

        //   POT API CALL — ONLY IF SUBCATEGORY IS POT
        if (parseInt(category) === 3) {

          try {
            const potPayload = {
              id: 0,
              productId: currentProductId,
              potSize: potSize || "",
              potColourId: potColorId || 0,
              potMaterialId: potMaterialId || 0,
              height: height ? parseFloat(height) : 0,
              width: width ? parseFloat(width) : 0,
              diameter: diameter ? parseFloat(diameter) : 0,
              weight: weight ? parseFloat(weight) : 0,
              createdDate: new Date().toISOString(),
              modifiedDate: new Date().toISOString(),
            };

            console.log(" Pot Payload:", potPayload);

            const potRes = await apiClient.post("api/public/pot/add", potPayload);

            if (potRes.status === 200 || potRes.status === 201) {
              console.log(" Pot saved successfully");
            } else {
              console.log(" Pot API failed");
            }
          } catch (potErr) {
            console.log("❌ Pot API Error:", potErr);
          }
        }
        if (mediaList.length > 0 && currentProductId) {
          const image = mediaList[0];
          const formData = new FormData();
          formData.append("file", {
            uri: image.localUri,
            type: "image/jpeg",
            name: image.fileName || "upload.jpg",
          });

          const uploadUrl = `api/public/product/imageUpload?productId=${currentProductId}`;
          console.log("Uploading image to:", uploadUrl);

          const imgRes = await apiClient.post(uploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (imgRes.status === 200 || imgRes.status === 201) {
            console.log("Image uploaded successfully:", imgRes.data);
            ToastAndroid.show(
              productId
                ? "Product updated successfully!"
                : "Product created successfully!",
              ToastAndroid.SHORT
            );
          } else {
            ToastAndroid.show(
              "Product saved, but image upload failed.",
              ToastAndroid.SHORT
            );
          }
        } else {
          ToastAndroid.show(
            productId
              ? "Product updated without new image."
              : "Product created without image.",
            ToastAndroid.SHORT
          );
        }

        navigation.navigate("MainTabs", {
          screen: "MainTabs",
          params: {
            screen: "Products",
          },
        });

        setMediaList([]);
      } else {
        Alert.alert("Error", "Failed to save product. Please try again.");
      }
    } catch (err) {
      console.error("❌ Publish Error:", err);
      Alert.alert("Error", "Something went wrong while saving the product.");
    } finally {
      setLoading(false);
    }
  };



  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };




  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Enter" && input.trim()) {
      const newTag = input.trim();

      //  Check if tag already exists
      if (!selectedTags.includes(newTag)) {
        const allTags = [...selectedTags, newTag];
        console.log(" tag:", allTags);
        setSelectedTags(allTags);
      }

      setInput("");
    }
  };



  //  Fetch all categories
  const fetchCategories = async () => {
    try {
      setCatLoading(true);
      const res = await apiClient.get("api/public/category/getAll");
      if (Array.isArray(res.data)) {
        const formatted = res.data.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        setCategories(formatted);
      }
    } catch (err) {
      console.error("Category Fetch Error:", err);
      Alert.alert("Error", "Unable to load categories");
    } finally {
      setCatLoading(false);
    }
  };

  //  Fetch subcategories based on category id
  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) return;
    try {
      setSubLoading(true);
      const res = await apiClient.get(
        `api/public/subCategory/getByCategoryId/${categoryId}`
      );
      console.log("Subcategory Response:", res.data);

      if (Array.isArray(res.data)) {
        const formatted = res.data.map((s) => ({
          id: s.id,
          name: s.name,
        }));
        setSubcategories(formatted);
      } else {
        setSubcategories([]);
      }
    } catch (err) {
      console.error("Subcategory Fetch Error:", err);
      Alert.alert("Error", "Unable to load subcategories");
      setSubcategories([]);
    } finally {
      setSubLoading(false);
    }
  };

  // Load categories once
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      fetchSubcategories(category);
    } else {
      setSubcategories([]);
      setSubcategory("");
    }
  }, [category]);


  const fetchPotColor = async () => {
    try {
      const response = await apiClient.get("api/public/potColour/getAll");
      setPotColors(response.data);

    } catch (error) {
      console.log("Error loading colors", error);
    };
  }

  useEffect(() => {
    fetchPotColor();
  }, []);

  const fetchMaterial = async () => {
    try {
      const response = await apiClient.get("api/public/potMaterial/getAll")
      setPotMaterials(response.data);
    } catch (error) {
      console.log("Error loading colors", error);

    }
  }

  useEffect(() => {
    fetchMaterial();
  }, []);




  const handleCreateService = async () => {
    const allTags = [
      ...selectedServiceTags,
      ...(serviceTagInput.trim() ? [serviceTagInput.trim()] : []),
    ];

    // Validations
    if (!serviceName.trim()) return Alert.alert("Validation", "Please enter service name");
    if (!serviceDescription.trim()) return Alert.alert("Validation", "Please enter description");
    if (!servicePrice.trim()) return Alert.alert("Validation", "Please enter price");
    if (!serviceDuration.trim()) return Alert.alert("Validation", "Please enter duration");

    setLoading(true);

    try {
      const servicePayload = {
        id: serviceId || 0,
        name: serviceName,
        vendorId: parseInt(vendorId || "0"),
        serviceSubCategoryId: serviceSubCategoryId || "0",
        tag: allTags,
        description: serviceDescription,
        benefits: servicesBenefitList,
        basePrice: serviceComparePrice ? parseFloat(serviceComparePrice) : 0,
        price: parseFloat(servicePrice) || 0,
        pricingType: (pricingType || "FIXED").toUpperCase(),
        duration: serviceDuration,
        coverageArea: serviceLocation || "5 km",
        activeStatus: true,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),

        // backend requires this field even if empty
        imageUrl: "",
      };

      console.log("Service Payload:", servicePayload);

      const apiUrl = serviceId
        ? `api/public/services/update/${serviceId}`
        : `api/public/services/add`;

      const res = serviceId
        ? await apiClient.put(apiUrl, servicePayload)
        : await apiClient.post(apiUrl, servicePayload);

      if (res.status === 200 || res.status === 201) {
        const currentServiceId = serviceId || res.data?.id;

      

        if (mediaList.length > 0 && currentServiceId) {
          const image = mediaList[0];

          const formData = new FormData();
          formData.append("file", {
            uri: image.localUri,
            type: "image/jpeg",
            name: image.fileName || "service.jpg",
          });

          const uploadUrl = `api/public/services/serviceImageUpload?serviceId=${currentServiceId}`;
          console.log("Uploading service image to:", uploadUrl);

          const imgRes = await apiClient.post(uploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (imgRes.status === 200 || imgRes.status === 201) {
            console.log("Service image uploaded successfully:", imgRes.data);
          } else {
            console.warn("Service saved, but image upload failed.");
          }
        } else {
          console.log("No new image selected → skipping upload.");
        }


        ToastAndroid.show(
          serviceId ? "Service updated successfully!" : "Service created successfully!",
          ToastAndroid.SHORT
        );

        navigation.navigate("MainTabs", {
          screen: "MainTabs",
          params: { screen: "Products",params:{type:"Service"} },
        });

        setMediaList([]);
      } else {
        Alert.alert("Error", "Failed to save service. Please try again.");
      }
    } catch (err) {
      console.error("Service Creation Error:", err);
      Alert.alert("Error", "Something went wrong while saving the service.");
    } finally {
      setLoading(false);
    }
  };





  const toggleServiceTag = (tag: string) => {
    setSelectedServiceTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle new tag input
  const handleServiceKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Enter" || e.nativeEvent.key === ",") {
      if (serviceTagInput.trim() && !selectedServiceTags.includes(serviceTagInput.trim())) {
        setSelectedServiceTags([...selectedServiceTags, serviceTagInput.trim()]);
      }
      setServiceTagInput("");
    }
  };

  const removeServiceTag = (tag: string) => {
    setSelectedServiceTags(selectedServiceTags.filter((t) => t !== tag));
  };


  const removeProductTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  }

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails(serviceId);
    }
  }, [serviceId]);

  //  API Fetch function
  const fetchServiceDetails = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`api/public/services/getOne/${id}`);

      const service = response.data;
      console.log(" Service Details:", service);

      //  Map API fields to state
      setServiceName(service.name || "");
      setServiceDescription(service.description || "");
      setServiceSubCategoryId(service.serviceSubCategoryId || "");
      setServicePrice(service.price ? String(service.price) : "");
      servicesComparePrice(service.basePrice ? String(service.price) : "");
      setServiceDuration(service.duration || "");
      setServicesBenefitList(service.benefits || "");
      setServiceLocation(service.coverageArea || "");
      setPricingType(service.pricingType || "Fixed");
      setSelectedServiceTags(service.tag?.filter((t: string) => t) || []);
      setMediaList(
        service.imageUrl
          ? [{ localUri: service.imageUrl, fileName: service.imageUrl.split("/").pop() }]
          : []
      );

    } catch (error: any) {
      console.error(" Failed to fetch service:", error);
      Alert.alert("Error", "Unable to load service details");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <GradientHeader
        title={productId ? "Edit Product" : "Add Product"}
        onBack={() => navigation.goBack()}
        rightText={productId ? "Update" : "Save"}
        onRightPress={isService ? handleCreateService : handlePublish}
      />


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 105 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Product Type */}
          <View className="bg-white m-3 rounded-2xl p-4 shadow">
            <Text className="text-base font-semibold mb-3">📦 Product Type</Text>
            <View className="flex-row">
              <TouchableOpacity onPress={() => setIsService(false)} className={`flex-1 mr-2 rounded-xl p-3 border-2 ${!isService ? "border-green-700 bg-green-50" : "border-gray-300"}`}>
                <Text className={`text-center font-medium ${!isService ? "text-green-700" : "text-gray-700"}`}>🌿 Product</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsService(true)} className={`flex-1 ml-2 rounded-xl p-3 border-2 ${isService ? "border-green-700 bg-green-50" : "border-gray-300"}`}>
                <Text className={`text-center font-medium ${isService ? "text-green-700" : "text-gray-700"}`}>🛠️ Service</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Media */}
          <View className="bg-white m-3 rounded-2xl p-4 shadow">
            <Text className="text-base font-semibold mb-3">📸 Photos & Videos</Text>
            {mediaList.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                <View className="flex-row items-center px-1">
                  {mediaList.map((file, idx) => (
                    <View
                      key={idx}
                      className="w-[90px] h-[90px] mr-3 relative rounded-xl overflow-hidden bg-green-100"
                    >
                      <Image
                        source={{ uri: renderImageUri(file) }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      {idx === 0 && (
                        <Text className="absolute bottom-1 left-1 text-[10px] bg-green-700 text-white px-2 py-[1px] rounded-full">
                          Primary
                        </Text>
                      )}
                      <TouchableOpacity
                        onPress={() => removeMedia(file)}
                        className="absolute top-1 right-1 bg-black/60 w-5 h-5 rounded-full justify-center items-center"
                      >
                        <Text className="text-white text-xs">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center bg-gray-50">
                <Text className="text-4xl mb-2">📤</Text>
                <Text className="text-gray-600 text-sm">Upload product images or videos</Text>
                <Text className="text-gray-400 text-xs mb-3">First image will be the cover photo</Text>
                <View className="flex-row space-x-3 gap-4">
                  <TouchableOpacity onPress={pickImages} className="bg-green-700 px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold text-sm">📷 Add Photos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickVideo} className="border border-green-700 px-4 py-2 rounded-lg">
                    <Text className="text-green-700 font-semibold text-sm">🎥 Add Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Basic Info */}
          {!isService && (

            <View className="bg-white m-3 rounded-2xl p-4 shadow">
              <Text className="text-base font-semibold mb-3">📝 Basic Information</Text>

              <Text className="text-sm font-semibold text-gray-700">
                Product Name <Text className="text-red-500">*</Text>
              </Text>

              <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                <TextInput
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="e.g., Snake Plant (Sansevieria)"
                  className="text-sm text-gray-800 py-3 px-4"
                  placeholderTextColor="#999"
                />
              </View>



              {/* Subcategory Dropdown */}
              <Text className="text-sm font-semibold text-gray-700">
                Category <Text className="text-red-500">*</Text>
              </Text>
              <View className="border border-gray-300 rounded-lg overflow-hidden mt-2 mb-3 px-1">
                {catLoading ? (
                  <View className="py-3 items-center">
                    <Text className="text-gray-500 text-sm">Loading categories...</Text>
                  </View>
                ) : (
                  <Picker
                    selectedValue={category}
                    onValueChange={(v) => setCategory(v)}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {categories.map((item) => (
                      <Picker.Item key={item.id} label={item.name} value={item.id.toString()} />
                    ))}
                  </Picker>

                )}
              </View>

              {/* Subcategory Dropdown */}
              <Text className="text-sm font-semibold text-gray-700">
                Subcategory <Text className="text-red-500">*</Text>
              </Text>

              <View
                className={`rounded-lg overflow-hidden mt-2 mb-3 border px-3 ${category ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-100"
                  }`}
              >
                {subLoading ? (
                  <View className="py-3 items-center">
                    <Text className="text-gray-500 text-sm">Loading subcategories...</Text>
                  </View>
                ) : (
                  <Picker
                    enabled={!!category}
                    selectedValue={subcategory}
                    onValueChange={(v) => setSubcategory(v)}
                    style={{
                      height: 55,
                      color: category ? "#000" : "#999",
                      textAlign: "center",
                    }}
                  >
                    <Picker.Item label="Select Subcategory" value="" color="#888" />

                    {subcategories.length > 0 ? (
                      subcategories.map((item) => (
                        <Picker.Item
                          key={item.id}
                          label={item.name}
                          value={item.id.toString()}
                        />
                      ))
                    ) : (
                      <Picker.Item label="No subcategories found" value="" />
                    )}
                  </Picker>

                )}
              </View>



              {/*  Tags Section */}
              {/* <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Tags</Text>

                <View
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-row flex-wrap items-center"
                  style={{
                    minHeight: 100,
                    maxHeight: 130,
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                  }}
                >
              
                  {initialTags.map(tag => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        className={`rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center ${selected ? "bg-green-500" : "bg-green-100"
                          }`}
                      >
                        <Text className={`text-sm ${selected ? "text-white" : "text-gray-800"}`}>
                          {tag}
                        </Text>
                       


                      </TouchableOpacity>
                    );
                  })}

                  {selectedTags.length > 0 && (
                    <Text className="text-gray-700 text-sm">
                      {selectedTags.join(", ")}
                    </Text>
                  )}

                 
                  <TextInput
                    ref={inputRef}
                    value={input}
                    onChangeText={setInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags..."
                    multiline
                    blurOnSubmit={false}
                    returnKeyType="done"
                    className="text-sm text-gray-700 py-1"
                  />
                </View>
              </View> */}

              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Tags</Text>

                {/* Tag Container */}
                <View
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-row flex-wrap items-center"
                  style={{
                    minHeight: 100,
                    maxHeight: 130,
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                  }}
                >
                  {/* Selected Tags as Chips */}
                  {selectedTags.map((tag, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-green-100 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-sm text-gray-800">{tag}</Text>
                      <TouchableOpacity onPress={() => removeProductTag(tag)}>
                        <Text className="ml-1 text-red-500 font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Input box for typing new tags */}
                  <TextInput
                    ref={inputRef}
                    value={input}
                    onChangeText={setInput}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tags..."
                    multiline
                    blurOnSubmit={false}
                    returnKeyType="done"
                    className="text-sm text-gray-700 py-1 flex-1 min-w-[60px]"
                  />
                </View>

                {/* Predefined Service Tags */}
                <View className="flex-row flex-wrap mt-3">
                  {initialTags.map((tag) => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        className={`rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center ${selected ? "bg-green-500" : "bg-green-100"
                          }`}
                      >
                        <Text
                          className={`text-sm ${selected ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>



              <Text className="text-sm font-semibold text-gray-700 mt-3">
                Description <Text className="text-red-500">*</Text>
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

              <View className="p-4 bg-white rounded-2xl shadow">
                <Text className="text-base font-semibold mb-2">Benefits</Text>

                {/* Input + Add button */}
                <View className="flex-row items-center mb-3">
                  <TextInput
                    value={benefit}
                    onChangeText={setBenefit}
                    placeholder="Enter benefit"
                    className="flex-1 border border-gray-300 rounded-lg pl-3 py-2 mr-2 bg-white"
                  />

                  <TouchableOpacity
                    onPress={handleProductAddBenefit}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Add</Text>
                  </TouchableOpacity>
                </View>


                {/* Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {benefitsList.map((b, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-green-100 px-3 py-1 rounded-full mr-2"
                    >
                      <Text className="text-gray-800">{b}</Text>
                      <TouchableOpacity onPress={() => handleRemoveBenefit(index)} className="ml-2">
                        <Text className="text-red-500 font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>


            </View>
          )}


          {/* Pricing & Inventory */}
          {!isService && (

            <View className="bg-white m-3 rounded-2xl p-4 shadow">
              <Text className="text-base font-semibold mb-3">💰 Pricing & Inventory</Text>

              {/* Price & Compare Price */}
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Price <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                      placeholder="₹0"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">Compare At Price</Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={comparePrice}
                      onChangeText={setComparePrice}
                      keyboardType="numeric"
                      placeholder="₹0"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Stock & SKU */}
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Stock <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={stock}
                      onChangeText={setStock}
                      keyboardType="numeric"
                      placeholder="0"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">SKU</Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={sku}
                      onChangeText={setSku}
                      placeholder="PLANT001"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Low Stock Alert */}
              <View className="mt-3 ">
                <Text className="text-sm font-semibold text-gray-700">Low Stock Alert</Text>
                <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                  <TextInput
                    value={lowStockAlert}
                    onChangeText={setLowStockAlert}
                    keyboardType="numeric"
                    placeholder="Enter quantity to trigger low stock alert (e.g., 10)"
                    className="text-sm text-gray-800 py-3"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Switches */}
              <View className="mt-4 space-y-3 gap-4">
                <View className="flex-row justify-between items-center bg-gray-100 rounded-xl px-4 py-3">
                  <Text className="text-gray-700 text-sm font-medium">Track Inventory</Text>
                  <Switch value={trackInventory} onValueChange={setTrackInventory} />
                </View>

                <View className="flex-row justify-between items-center bg-gray-100 rounded-xl px-4 py-3">
                  <Text className="text-gray-700 text-sm font-medium">
                    Continue Selling When Out of Stock
                  </Text>
                  <Switch value={continueWhenOOS} onValueChange={setContinueWhenOOS} />
                </View>
              </View>
            </View>
          )}



          {/* {!isService && ( */}
          {!isService && ( // only show for Product
            selectedCategory === "Plant" ? (
              <View className="bg-white m-3 rounded-2xl p-4 shadow">
                <Text className="text-base font-semibold mb-3">⚙️ Specifications</Text>
                {/* Plant size picker */}
                <Text className="text-sm font-semibold text-gray-700">Plant Size</Text>
                <View className="border border-gray-300 rounded-lg overflow-hidden mb-3 mt-2">
                  <Picker
                    selectedValue={potSize}
                    onValueChange={(v) => setPotSize(v)}
                    style={{ color: "#333" }}
                  >
                    <Picker.Item label="Select Size" value="" color="#888" />
                    <Picker.Item label="Small (6-12 inches)" value="Small" />
                    <Picker.Item label="Medium (12-24 inches)" value="Medium" />
                    <Picker.Item label="Large (24-36 inches)" value="Large" />
                    <Picker.Item label="Extra Large (36+ inches)" value="Extra Large" />
                  </Picker>
                </View>
              </View>
            ) : selectedCategory === "Pots" ? (
              <View className="bg-white m-3 rounded-2xl p-4 shadow">
                <Text className="text-base font-semibold mb-3">⚙️ Specifications</Text>
                {/* Pot specs here */}

                <Text className="text-sm font-semibold text-gray-700">Pot Color</Text>

                <TouchableOpacity
                  onPress={() => setColorModalVisible(true)}
                  className="border border-gray-300 rounded-xl px-3 py-3 mt-2 bg-white flex-row justify-between items-center mb-2"
                >
                  <Text className="text-gray-800">
                    {potColor ? potColor : "Select Color"}
                  </Text>

                  {/* <Ionicons name="chevron-down" size={20} color="#555" /> */}
                  <MaterialIcons name="arrow-drop-down" color="#555" size={24} />

                </TouchableOpacity>


                {/* Modal */}
                <Modal
                  visible={colorModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setColorModalVisible(false)}
                >
                  {/* Touchable background */}
                  <TouchableWithoutFeedback onPress={() => setColorModalVisible(false)}>
                    <View className="flex-1 bg-black/40 justify-center items-center">

                      {/* Stop touch propagation so inside content won’t close modal */}
                      <TouchableWithoutFeedback>
                        <View className="bg-white w-80 rounded-2xl p-4">
                          <Text className="text-base font-semibold mb-3 text-gray-800">
                            Select Pot Color
                          </Text>

                          <ScrollView style={{ maxHeight: 250 }}>
                            {potColors.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                className="py-3 border-b border-gray-200"
                                onPress={() => {
                                  const formatted =
                                    item.potColour.charAt(0).toUpperCase() +
                                    item.potColour.slice(1).toLowerCase();
                                  setPotColor(formatted);
                                  setPotColorId(item.id);
                                  setColorModalVisible(false);
                                }}
                              >
                                <Text className="text-md">
                                  {item.potColour.charAt(0).toUpperCase() +
                                    item.potColour.slice(1).toLowerCase()}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>

                    </View>
                  </TouchableWithoutFeedback>
                </Modal>




                {/* 📏 Pot Size */}
                <Text className="text-sm font-semibold text-gray-700">Pot Size</Text>
                <View className="border border-gray-300 rounded-lg overflow-hidden mb-3 mt-2">
                  <Picker
                    selectedValue={potSize}
                    onValueChange={(v) => setPotSize(v.toUpperCase())}
                    style={{ color: "#333" }}
                  >
                    <Picker.Item label="Select Size" value="" color="#888" />
                    <Picker.Item label="Small" value="SMALL" />
                    <Picker.Item label="Medium" value="MEDIUM" />
                    <Picker.Item label="Large" value="LARGE" />
                    <Picker.Item label="Extra Large" value="EXTRA_LARGE" />
                  </Picker>

                </View>

                {/* 🧱 Pot Material */}
                <Text className="text-sm font-semibold text-gray-700">Pot Material</Text>

                <TouchableOpacity
                  onPress={() => setPotMaterialModalVisible(true)}
                  className="border border-gray-300 rounded-xl px-3 py-3 mt-2 bg-white flex-row justify-between items-center mb-2"
                >
                  <Text className="text-gray-800">
                    {potMaterial ? potMaterial : "Select Material"}
                  </Text>

                  {/* <Ionicons name="chevron-down" size={20} color="#555" /> */}
                  <MaterialIcons name="arrow-drop-down" color="#555" size={24} />

                </TouchableOpacity>


                {/* Modal */}
                <Modal
                  visible={potMaterialModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setPotMaterialModalVisible(false)}
                >
                  {/* Touchable background */}
                  <TouchableWithoutFeedback onPress={() => setPotMaterialModalVisible(false)}>
                    <View className="flex-1 bg-black/40 justify-center items-center">

                      {/* Stop touch propagation so inside content won’t close modal */}
                      <TouchableWithoutFeedback>
                        <View className="bg-white w-80 rounded-2xl p-4">
                          <Text className="text-base font-semibold mb-3 text-gray-800">
                            Select Material
                          </Text>

                          <ScrollView style={{ maxHeight: 250 }}>
                            {potMaterials.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                className="py-3 border-b border-gray-200"
                                onPress={() => {
                                  const formatted =
                                    item.potMaterial.charAt(0).toUpperCase() +
                                    item.potMaterial.slice(1).toLowerCase();
                                  setPotMaterial(formatted);
                                  setPotMaterialId(item.id)
                                  setPotMaterialModalVisible(false);
                                }}
                              >
                                <Text className="text-md">
                                  {item.potMaterial.charAt(0).toUpperCase() +
                                    item.potMaterial.slice(1).toLowerCase()}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>

                    </View>
                  </TouchableWithoutFeedback>
                </Modal>





                <View className="flex-row justify-between gap-3 mb-3">

                  {/* Weight */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                      Weight (kg)
                    </Text>
                    <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                      <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        // keyboardType="numeric"
                        placeholder="e.g., 2.5"
                        className="text-sm text-gray-800 py-3"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Diameter */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                      Diameter (cm)
                    </Text>
                    <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                      <TextInput
                        value={diameter}
                        onChangeText={setDiameter}
                        keyboardType="numeric"
                        placeholder="e.g., 15"
                        className="text-sm text-gray-800 py-3"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                </View>


                {/* 🔹 Row 2: Height + Width */}
                <View className="flex-row justify-between gap-3 mb-3">

                  {/* Height */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                      Height (cm)
                    </Text>
                    <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                      <TextInput
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                        placeholder="e.g., 25"
                        className="text-sm text-gray-800 py-3"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Width */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700">
                      Width (cm)
                    </Text>
                    <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                      <TextInput
                        value={width}
                        onChangeText={setWidth}
                        keyboardType="numeric"
                        placeholder="e.g., 18"
                        className="text-sm text-gray-800 py-3"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                </View>


              </View>

            ) : null
          )}


          {/* 🧰 Service Details */}
          {isService && (
            <View className="bg-white m-3 rounded-2xl p-4 shadow">
              <Text className="text-base font-semibold mb-3">🧰 Service Details</Text>

              {/* Service Name */}
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Service Name <Text className="text-red-500">*</Text>
              </Text>
              <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                <TextInput
                  value={serviceName}
                  onChangeText={setServiceName}
                  placeholder="Enter service name"
                  className="text-sm text-gray-800 py-3 px-4"
                  placeholderTextColor="#999"
                />
              </View>

              <ServicesDropdown
                selectedId={serviceSubCategoryId}
                onSelect={(id) => setServiceSubCategoryId(id)}
              />



              {/* Service Description */}
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Service Description <Text className="text-red-500">*</Text>
              </Text>
              <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                <TextInput
                  value={serviceDescription}
                  onChangeText={setServiceDescription}
                  placeholder="Describe the service"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="text-sm text-gray-800 py-3 h-[120px]"
                  placeholderTextColor="#999"
                />
              </View>



              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Price <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={servicePrice}
                      onChangeText={setServicePrice}
                      keyboardType="numeric"
                      placeholder="₹0"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">Compare At Price</Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={serviceComparePrice}
                      onChangeText={servicesComparePrice}
                      keyboardType="numeric"
                      placeholder="₹0"
                      className="text-sm text-gray-800 py-3"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Service Duration */}
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Service Duration (Hours)
              </Text>
              <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                <TextInput
                  value={serviceDuration}
                  onChangeText={setServiceDuration}
                  // keyboardType="string"
                  placeholder="e.g., 2 days/hours"
                  className="text-sm text-gray-800 py-3 px-4"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Coverage Area */}
              <Text className="text-sm font-semibold text-gray-700 mb-1">Coverage Area</Text>
              <View className="border border-gray-300 rounded-xl mt-2 mb-3 bg-white px-3">
                <TextInput
                  value={serviceLocation}
                  onChangeText={setServiceLocation}
                  placeholder="e.g., Indoor / Outdoor / Citywide"
                  className="text-sm text-gray-800 py-3 px-4"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Pricing Type */}
              <Text className="text-sm font-semibold text-gray-700 mb-1">Pricing Type</Text>
              <View className="border border-gray-300 rounded-xl overflow-hidden mt-2 mb-3 bg-white">
                <Picker
                  selectedValue={pricingType}
                  onValueChange={(v) => setPricingType(v)}
                  style={{ height: 55, color: "#333" }}
                >
                  <Picker.Item label="Fixed" value="Fixed" />
                  <Picker.Item label="Hourly" value="Hourly" />
                  <Picker.Item label="Custom" value="Custom" />
                </Picker>
              </View>

              <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Tags</Text>

                {/* Tag Container */}
                <View
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-row flex-wrap items-center"
                  style={{
                    minHeight: 100,
                    maxHeight: 130,
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                  }}
                >
                  {/* Selected Tags as Chips */}
                  {selectedServiceTags.map((tag, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-green-100 rounded-full px-3 py-1 mr-2 mb-2"
                    >
                      <Text className="text-sm text-gray-800">{tag}</Text>
                      <TouchableOpacity onPress={() => removeServiceTag(tag)}>
                        <Text className="ml-1 text-red-500 font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Input box for typing new tags */}
                  <TextInput
                    ref={serviceTag}
                    value={serviceTagInput}
                    onChangeText={setServiceTagInput}
                    onKeyPress={handleServiceKeyPress}
                    placeholder="Add tags..."
                    multiline
                    blurOnSubmit={false}
                    returnKeyType="done"
                    className="text-sm text-gray-700 py-1 flex-1 min-w-[60px]"
                  />
                </View>

                {/* Predefined Service Tags */}
                <View className="flex-row flex-wrap mt-3">
                  {initialServiceTags.map((tag) => {
                    const selected = selectedServiceTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleServiceTag(tag)}
                        className={`rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center ${selected ? "bg-green-500" : "bg-green-100"
                          }`}
                      >
                        <Text
                          className={`text-sm ${selected ? "text-white" : "text-gray-800"
                            }`}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>


              {/* <View className="mt-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Services Benefits</Text>

                <View
                  className="border border-gray-300 rounded-lg px-3 py-2 flex-row flex-wrap items-center"
                  style={{
                    minHeight: 100,
                    maxHeight: 150,
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                  }}
                >
                  {servicesBenefitList.map((benefit, index) => (
                    <View
                      key={index}
                      className="bg-green-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                    >
                      <Text className="text-sm text-gray-800">{benefit}</Text>
                      <TouchableOpacity onPress={() => handleServicesRemoveBenefit(index)}>
                        <Text className="text-sm text-gray-600 ml-1">✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TextInput
                    ref={inputRef}
                    value={servicesBenefit}
                    onChangeText={setServicesBenefit}
                    placeholder="Add benefit..."
                    className="text-sm text-gray-700 py-1 flex-1"
                    onSubmitEditing={handleAddBenefit}
                  />

                  <TouchableOpacity
                    onPress={handleAddBenefit}
                    className="bg-green-500 px-3 py-1 rounded-full ml-2"
                  >
                    <Text className="text-white text-sm">Add</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              <View className="p-4 bg-white rounded-2xl shadow mt-4">
                <Text className="text-base font-semibold mb-2">Services Benefits</Text>

                {/* Input + Add button */}
                <View className="flex-row items-center mb-3">
                  <TextInput
                    value={servicesBenefit}
                    onChangeText={setServicesBenefit}
                    placeholder="Enter benefit"
                    className="flex-1 border border-gray-300 rounded-lg pl-3 py-2 mr-2 bg-white"
                  />

                  <TouchableOpacity
                    onPress={handleAddBenefit}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Add</Text>
                  </TouchableOpacity>
                </View>


                {/* Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {servicesBenefitList.map((b, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-green-100 px-3 py-1 rounded-full mr-2"
                    >
                      <Text className="text-gray-800">{b}</Text>
                      <TouchableOpacity onPress={() => handleServicesRemoveBenefit(index)} className="ml-2">
                        <Text className="text-red-500 font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Requires Site Visit */}
              <View className="flex-row justify-between items-center bg-gray-100 rounded-xl px-4 py-3 mt-2">
                <Text className="text-gray-700 text-sm font-medium">Requires Site Visit</Text>
                <Switch
                  value={requiresSiteVisit}
                  onValueChange={setRequiresSiteVisit}
                  trackColor={{ false: "#d1d5db", true: "#15803d" }}
                  thumbColor={"#fff"}
                />
              </View>
            </View>
          )}


          {/* Shipping */}
          {!isService && (

            <View className="bg-white m-3 rounded-2xl p-4 shadow">
              <Text className="text-base font-semibold mb-3">🚚 Shipping & Delivery</Text>


              <View className="flex-row gap-3 mb-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">
                    Weight (kg)
                  </Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="0.0"
                      // keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-700">Delivery Time</Text>
                  <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                    <TextInput
                      value={deliveryTime}
                      onChangeText={setDeliveryTime}
                      placeholder="1-2 Days"
                      placeholderTextColor="#999"

                    />
                  </View>
                </View>
              </View>

              {/* Free Delivery Option */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center bg-gray-100 rounded-xl px-4 py-2">
                  <Text className="text-gray-700 text-sm font-medium">Offer Free Delivery</Text>
                  <Switch value={freeDelivery} onValueChange={setFreeDelivery} />
                </View>

                {!freeDelivery && (
                  <View className="mt-2">
                    <Text className="text-sm font-semibold text-gray-700">Delivery Charge</Text>

                    <View className="border border-gray-300 rounded-xl mt-2 bg-white px-3">
                      <TextInput
                        value={deliveryCharge}
                        onChangeText={setDeliveryCharge}
                        keyboardType="numeric"
                        placeholder="₹0"
                        placeholderTextColor="#999"

                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}



          {/* Visibility */}
          {!isService && (

            <View className="bg-white m-3 rounded-2xl p-4 shadow mb-2 ">
              <Text className="text-base font-semibold mb-3">👁️ Visibility & Status</Text>
              <TouchableOpacity className="flex-row justify-between items-center bg-gray-100 rounded-lg px-4 py-2 mb-2">
                <Text className="text-gray-700 text-sm font-medium">Publish Product</Text>
                <Switch value={publish} onValueChange={setPublish} />
              </TouchableOpacity>
              <View className="flex-row justify-between items-center bg-gray-100 rounded-lg px-4 py-2 mb-2">
                <Text className="text-gray-700 text-sm font-medium">Featured Product</Text>
                <Switch value={featured} onValueChange={setFeatured} />
              </View>
              <View className="flex-row justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                <Text className="text-gray-700 text-sm font-medium">Allow Reviews</Text>
                <Switch value={allowReviews} onValueChange={setAllowReviews} />
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
      {/* </TouchableWithoutFeedback> */}


      <View
        style={{
          position: "absolute",
          bottom: insets.bottom || 10,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderColor: "#ddd",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
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

        <TouchableOpacity
          onPress={isService ? handleCreateService : handlePublish}
          disabled={loading}
          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: loading ? "#9CA3AF" : "#2d6a4f",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            opacity: loading ? 0.8 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {loading ? "Processing..." : "Publish"}
          </Text>
        </TouchableOpacity>


      </View>
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

export default AddProductScreen;
