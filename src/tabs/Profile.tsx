import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
    Alert,
    ToastAndroid,
    Platform,
    Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AppHeader from "../utils/AppHeader";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVendor } from "../context/VendorContext";
import apiClient from "../api/apiBaseUrl";
import { ActivityIndicator } from "react-native-paper";
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";




const { width } = Dimensions.get("window");

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    emailId: string;
    mobileNumber: string;
    userProfile?: string;
}

const ProfileScreen: React.FC = () => {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigation = useNavigation<any>();

    const { vendorData } = useVendor();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    // Inside your component
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);



    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                let uid = vendorData?.userId;

                // fallback to AsyncStorage if context empty
                if (!uid) {
                    const storedVendor = await AsyncStorage.getItem("vendorData");
                    if (storedVendor) {
                        const parsedVendor = JSON.parse(storedVendor);
                        uid = parsedVendor?.userId;
                    }
                }

                if (!uid) {
                    console.warn("⚠️ User ID not found, cannot fetch profile.");
                    return;
                }

                setUserId(uid); // save it in state

                console.log("Fetching profile for userId:", uid);
                const response = await apiClient.get<UserProfile>(
                    `api/public/user/getOne/${uid}`
                );

                setUserProfile(response.data);
            } catch (error: any) {
                console.error("Error fetching user profile:", error);
                Alert.alert("Error", "Failed to load user profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [vendorData]);


    const openGallery = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8 },
            async (response: any) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert('Error', response.errorMessage);
                    return;
                }

                const asset = response.assets[0];
                setProfileImage(asset.uri);
                await uploadProfileImage(asset, userId);
            }
        );
    };


    const uploadProfileImage = async (image: any, uid: string | null) => {
        if (!uid) {
            console.warn("⚠️ User ID not available, cannot upload image.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("userId", uid);
            formData.append("file", {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `profile_${uid}.jpg`,
            });

            const response = await apiClient.post(
                "api/public/user/userProfile",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("✅ Upload Success:", response.data);
            ToastAndroid.show("Profile image updated successfully!", ToastAndroid.SHORT);
        } catch (error) {
            console.error("❌ Upload Error:", error);
            Alert.alert("Error", "Failed to upload profile image");
        } finally {
            setUploading(false);
        }
    };



    // const handleLogout = async () => {
    //     try {

    //         await AsyncStorage.clear();
    //         console.log("User logged out, AsyncStorage cleared");
    //         navigation.reset({
    //             index: 0,
    //             routes: [{ name: "SignIn" }],
    //         });
    //     } catch (error) {
    //         console.error("Error clearing AsyncStorage:", error);
    //     }
    // };


    const confirmLogout = () => {
        setIsLogoutModalVisible(true);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("vendorData");
        setIsLogoutModalVisible(false);
        if (Platform.OS === "android") {
            ToastAndroid.show("Logout successful", ToastAndroid.SHORT);
              navigation.reset({
                index: 0,
               routes: [{ name: "SignIn" }],
            });
        } else {
            Alert.alert("Logout successful");
        }
    };

    const cancelLogout = () => {
        setIsLogoutModalVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f7fa]">

            <AppHeader
                title="My Profile"
                showBack
                rightIcon="settings-outline"
                onRightPress={() => navigation.navigate("Settings")}
            />


            <ScrollView
                contentContainerStyle={{ paddingBottom: 10 }}
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >

                <View className="px-3">
                    <View
                        className="bg-white rounded-2xl items-center"
                        style={[
                            styles.profileCardShadow,
                            { marginTop: 10, paddingVertical: 20, paddingHorizontal: 16 },
                        ]}
                    >
                        {/* Avatar Section */}
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                            <View style={{ position: "relative" }}>
                                {/* Avatar */}
                                <View
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50,
                                        overflow: "hidden",
                                        borderWidth: 3,
                                        borderColor: "#fff",
                                        elevation: 4,
                                    }}
                                >
                                    {profileImage ? (

                                        <Image
                                            source={{ uri: profileImage }}
                                            style={{ width: "100%", height: "100%" }}
                                            resizeMode="cover"
                                        />
                                    ) : userProfile?.userProfile ? (

                                        <Image
                                            source={{ uri: userProfile.userProfile }}
                                            style={{ width: "100%", height: "100%" }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        // ✅ If no image at all → show green leaf gradient
                                        <LinearGradient
                                            colors={["#2d6a4f", "#40916c"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{
                                                flex: 1,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text style={{ fontSize: 36, color: "#fff" }}>🌿</Text>
                                        </LinearGradient>
                                    )}
                                </View>


                                {/* Camera Icon */}
                                <TouchableOpacity
                                    onPress={openGallery}
                                    activeOpacity={0.8}
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: "#fff",
                                        borderWidth: 2,
                                        borderColor: "#40916c",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        elevation: 3,
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>📷</Text>
                                </TouchableOpacity>
                            </View>

                            {uploading && (
                                <ActivityIndicator
                                    size="small"
                                    color="#40916c"
                                    style={{ marginTop: 8 }}
                                />
                            )}
                        </View>
                        {/* Name & ID */}
                        <Text className="text-[18px] font-bold text-[#222] mt-3">
                            {userProfile ? userProfile.firstName : "Loading..."}
                        </Text>

                        <Text className="text-[13px] text-[#888]">ID: VND-12345</Text>

                        {/* Verified Badge */}
                        <View
                            className="flex-row items-center justify-center mt-2 px-4 py-[4px] rounded-full"
                            style={{ backgroundColor: "#E6F4EA" }}
                        >
                            <Text className="text-[#1B5E20] font-semibold text-[13px]">
                                ✓ Verified Vendor
                            </Text>
                        </View>

                        {/* Divider line */}
                        <View className="w-full h-[1px] bg-[#EAEAEA] mt-4 mb-3" />

                        {/* Stats Row */}
                        <View className="flex-row justify-between w-full px-3">
                            <View className="items-center flex-1">
                                <Text className="text-[#40916c] text-[20px] font-bold">4.8</Text>
                                <Text className="text-[#666] text-[12px] mt-[2px]">Rating</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-[#40916c] text-[20px] font-bold">1,245</Text>
                                <Text className="text-[#666] text-[12px] mt-[2px]">Total Sales</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Text className="text-[#40916c] text-[20px] font-bold">98%</Text>
                                <Text className="text-[#666] text-[12px] mt-[2px]">Response Rate</Text>
                            </View>
                        </View>
                    </View>
                </View>


                {/* Container content */}
                <View className="px-3 mt-4">
                    {/* Performance Card */}
                    <LinearGradient
                        colors={["#2d6a4f", "#40916c"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 16,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-white font-semibold text-base">
                                📊 This Month's Performance
                            </Text>
                            <Text className="text-white text-sm opacity-90">View Details →</Text>
                        </View>

                        <View className="flex-row flex-wrap -mx-2">
                            {/* four stats, two per row */}
                            {[
                                { value: "₹85,450", label: "Revenue", change: "↑ 12% from last month" },
                                { value: "142", label: "Orders Completed", change: "↑ 8% from last month" },
                                { value: "4.9", label: "Avg Rating", change: "↑ 0.1 from last month" },
                                { value: "15 min", label: "Avg Response Time", change: "↓ 5 min improvement" },
                            ].map((item, i) => (
                                <View key={i} className="w-1/2 px-2 mb-3">
                                    <View
                                        style={{
                                            backgroundColor: "rgba(255,255,255,0.15)",
                                            borderRadius: 12,
                                            padding: 12,
                                        }}
                                    >
                                        <Text className="text-white text-[20px] font-bold">{item.value}</Text>
                                        <Text className="text-white text-sm">{item.label}</Text>
                                        <Text className="text-white text-xs mt-1">{item.change}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </LinearGradient>


                    {/* Business Information */}
                    <View className="bg-white rounded-lg p-4 mb-4 shadow" style={styles.sectionShadow}>
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold">🏢</Text>
                            <Text className="text-[16px] font-semibold ml-3">Business Information</Text>
                        </View>

                        {/* menu items - phone */}
                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#e9f8f3" }]}>
                                <Text>📱</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Phone Number</Text>
                                <Text style={styles.menuSublabel}>+91 {userProfile?.mobileNumber}</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#e9f8f3" }]}>
                                <Text>✉️</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Email</Text>
                                <Text style={styles.menuSublabel}>{userProfile?.emailId}</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#e9f8f3" }]}>
                                <Text>📍</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Business Address</Text>
                                <Text style={styles.menuSublabel}>Sector 15, Rohini, New Delhi - 110085</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#e9f8f3" }]}>
                                <Text>🕒</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Business Hours</Text>
                                <Text style={styles.menuSublabel}>Mon-Sat: 9:00 AM - 7:00 PM</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        {/* action buttons */}
                        <View className="flex-row mt-3 space-x-3 gap-4">
                            <TouchableOpacity className="flex-1 rounded-xl py-3 items-center justify-center " style={[styles.primaryButton]}>
                                <Text style={{ color: "#fff", fontWeight: "700" }}>✏️ Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-1 rounded-xl py-3 items-center justify-center" style={[styles.secondaryButton]}>
                                <Text style={{ color: "#40916c", fontWeight: "700" }}>📄 View Storefront</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* My Business */}
                    {/* <View className="bg-white rounded-lg p-4 mb-4 shadow" style={styles.sectionShadow}>
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold">💼</Text>
                            <Text className="text-[16px] font-semibold ml-3">My Business</Text>
                        </View>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f0f9ff" }]}>
                                <Text>💰</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Earnings & Payouts</Text>
                                <Text style={styles.menuSublabel}>View your earnings</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f0f9ff" }]}>
                                <Text>📊</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Sales Analytics</Text>
                                <Text style={styles.menuSublabel}>Insights & reports</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f0f9ff" }]}>
                                <Text>⭐</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Reviews & Ratings</Text>
                                <Text style={styles.menuSublabel}>234 reviews (4.8 rating)</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f0f9ff" }]}>
                                <Text>🎯</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Promotions</Text>
                                <Text style={styles.menuSublabel}>Create offers & discounts</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f0f9ff" }]}>
                                <Text>🏆</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Achievements & Badges</Text>
                                <Text style={styles.menuSublabel}>View your achievements</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>
                    </View> */}

                    {/* Settings & Preferences */}
                    {/* <View className="bg-white rounded-lg p-4 mb-4 shadow" style={styles.sectionShadow}>
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold">⚙️</Text>
                            <Text className="text-[16px] font-semibold ml-3">Settings & Preferences</Text>
                        </View>

                        <View style={styles.menuToggle}>
                            <View style={[styles.menuIcon, { backgroundColor: "#fff3e0" }]}>
                                <Text>🔔</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Push Notifications</Text>
                                <Text style={styles.menuSublabel}>Order updates & messages</Text>
                            </View>
                            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
                        </View>

                        <View style={styles.menuToggle}>
                            <View style={[styles.menuIcon, { backgroundColor: "#fff3e0" }]}>
                                <Text>📧</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Email Notifications</Text>
                                <Text style={styles.menuSublabel}>Sales reports & updates</Text>
                            </View>
                            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
                        </View>

                        <View style={styles.menuToggle}>
                            <View style={[styles.menuIcon, { backgroundColor: "#fff3e0" }]}>
                                <Text>📲</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>SMS Notifications</Text>
                                <Text style={styles.menuSublabel}>Order alerts via SMS</Text>
                            </View>
                            <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
                        </View>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#fff3e0" }]}>
                                <Text>🌐</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Language</Text>
                                <Text style={styles.menuSublabel}>English</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <View style={styles.menuToggle}>
                            <View style={[styles.menuIcon, { backgroundColor: "#fff3e0" }]}>
                                <Text>🌙</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Dark Mode</Text>
                                <Text style={styles.menuSublabel}>Use dark theme</Text>
                            </View>
                            <Switch value={darkMode} onValueChange={setDarkMode} />
                        </View>
                    </View> */}

                    {/* Account & Security */}
                    {/* <View className="bg-white rounded-lg p-4 mb-4 shadow" style={styles.sectionShadow}>
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold">🔒</Text>
                            <Text className="text-[16px] font-semibold ml-3">Account & Security</Text>
                        </View>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f3e5f5" }]}>
                                <Text>🔑</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Change Password</Text>
                                <Text style={styles.menuSublabel}>Update your password</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f3e5f5" }]}>
                                <Text>🛡️</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Two-Factor Authentication</Text>
                                <Text style={styles.menuSublabel}>Not enabled</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f3e5f5" }]}>
                                <Text>💳</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Payment Methods</Text>
                                <Text style={styles.menuSublabel}>Bank account & UPI</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#f3e5f5" }]}>
                                <Text>📋</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Tax & Legal Documents</Text>
                                <Text style={styles.menuSublabel}>GST, PAN details</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>
                    </View> */}

                    {/* Help & Support */}
                    {/* <View className="bg-white rounded-lg p-4 mb-4 shadow" style={styles.sectionShadow}>
                        <View className="flex-row items-center mb-3">
                            <Text className="text-[16px] font-semibold">❓</Text>
                            <Text className="text-[16px] font-semibold ml-3">Help & Support</Text>
                        </View>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#ffebee" }]}>
                                <Text>💬</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Contact Support</Text>
                                <Text style={styles.menuSublabel}>Chat with our team</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#ffebee" }]}>
                                <Text>📖</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Help Center</Text>
                                <Text style={styles.menuSublabel}>FAQs & guides</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#ffebee" }]}>
                                <Text>📱</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Tutorial Videos</Text>
                                <Text style={styles.menuSublabel}>Learn to use the app</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#ffebee" }]}>
                                <Text>📝</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Terms & Conditions</Text>
                                <Text style={styles.menuSublabel}>Vendor policies</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>

                        <Pressable style={styles.menuItem}>
                            <View style={[styles.menuIcon, { backgroundColor: "#ffebee" }]}>
                                <Text>🔒</Text>
                            </View>
                            <View style={styles.menuContent}>
                                <Text style={styles.menuLabel}>Privacy Policy</Text>
                                <Text style={styles.menuSublabel}>Data protection</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </Pressable>
                    </View> */}

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
                        {/* <View style={styles.logoutIcon}>
                            <MaterialCommunityIcons
                                name="logout"
                                size={22}
                                color="#ef4444"
                            />
                        </View> */}
                        <Text style={[styles.logoutText, { flex: 1 }]}>
                            Logout
                        </Text>
                    </TouchableOpacity>


                    {/* App Version */}
                    <View className="items-center mt-4 mb-8">
                        <Text className="text-[12px] text-[#999]">RoofGarden Vendor App v2.5.0</Text>
                    </View>
                </View>

                <Modal
                    visible={isLogoutModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={cancelLogout}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButtonCancel}
                                    onPress={cancelLogout}
                                >
                                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButtonConfirm}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.modalButtonTextConfirm}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>


        </SafeAreaView>
    );
};

export default ProfileScreen;

/* Styles */
const styles = StyleSheet.create({
    profileCardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },

    sectionShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    menuSublabel: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    menuArrow: {
        fontSize: 18,
        color: "#999",
        marginLeft: 8,
    },
    menuToggle: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    primaryButton: {
        backgroundColor: "#40916c",
        borderRadius: 12,
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: "#40916c",
        borderRadius: 12,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    bottomNav: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 12,
        paddingBottom: 16,
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    navItem: {
        alignItems: "center",
    },
    navIcon: {
        fontSize: 22,
        marginBottom: 3,
    },
    navLabel: {
        fontSize: 11,
        color: "#999",
        fontWeight: "600",
    },
    activeNavItem: {
        // any extra styling for active
    },

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
        marginHorizontal: 6,
        marginTop: 20,
        // justifyContent:"center"
    },
    logoutIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#fee2e2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    logoutText: {
        fontSize: 16,
        color: "#ef4444",
        fontWeight: "600",
        textAlign: "center",
        alignSelf: "center",
        alignContent: "center"
    },


    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#111827",
        textAlign: "center",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButtonCancel: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#f9fafb",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    modalButtonTextCancel: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "500",
    },
    modalButtonConfirm: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#fee2e2",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fecaca",
    },
    modalButtonTextConfirm: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "600",
    },
});
