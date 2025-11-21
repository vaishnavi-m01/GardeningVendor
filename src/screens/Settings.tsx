import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

const Settings = () => {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [smsEnabled, setSmsEnabled] = useState(false);

    const navigation = useNavigation<any>();

    return (
        <ScrollView
            className="flex pt-4 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
        >

            {/* My Business */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow">

                <View className="flex-row items-center mb-3">
                    <Text className="text-[16px] font-semibold">💼</Text>
                    <Text className="text-[16px] font-semibold ml-3">My Business</Text>
                </View>

                {/* Item */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>💰</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Revenue")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Earnings & Payouts</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">View your earnings</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>📊</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Analytics")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Sales Analytics</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Insights & reports</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>⭐</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Reviews & Ratings</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">234 reviews (4.8 rating)</Text>
                    </View>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>🎯</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Offers")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Promotions</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Create offers & discounts</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                <Pressable className="flex-row items-center py-3">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>🏆</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Achievements & Badges</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">View your achievements</Text>
                    </View>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>
            </View>


            {/* Settings */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow">

                <View className="flex-row items-center mb-3">
                    <Text className="text-[16px] font-semibold">⚙️</Text>
                    <Text className="text-[16px] font-semibold ml-3">Settings & Preferences</Text>
                </View>

                {/* Toggle */}
                <View className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                        <Text>🔔</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Push Notifications</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Order updates & messages</Text>
                    </View>

                    <Switch value={pushEnabled} onValueChange={setPushEnabled} />
                </View>

                <View className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                        <Text>📧</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Email Notifications</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Sales reports & updates</Text>
                    </View>

                    <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
                </View>

                <View className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                        <Text>📲</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">SMS Notifications</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Order alerts via SMS</Text>
                    </View>

                    <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
                </View>

                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                        <Text>🌐</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Language</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">English</Text>
                    </View>

                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                <View className="flex-row items-center py-3">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                        <Text>🌙</Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-[15px] font-semibold text-gray-800">Dark Mode</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Use dark theme</Text>
                    </View>

                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </View>

            </View>


            {/* Account & Security */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow">

                {/* Main Title */}
                <Pressable
                    className="flex-row items-center"
                    // onPress={() => navigation.navigate("AccountSecurity")}
                >
                    <Text className="text-[16px] font-semibold">🔒</Text>
                    <Text className="text-[16px] font-semibold ml-3 flex-1">
                        Account & Security
                    </Text>
                    <Text className="text-[18px] text-gray-400">›</Text>
                </Pressable>

                {[
                    {
                        icon: "🔑",
                        title: "Change Password",
                        sub: "Update your password",
                        screen: "ChangePasswordPage"
                    },
                    {
                        icon: "🛡️",
                        title: "Two-Factor Authentication",
                        sub: "Not enabled",
                        screen: "TwoFactorAuthPage"
                    },
                    {
                        icon: "💳",
                        title: "Payment Methods",
                        sub: "Bank account & UPI",
                        screen: "PaymentMethodsPage"
                    },
                    {
                        icon: "📋",
                        title: "Tax & Legal Documents",
                        sub: "GST, PAN details",
                        screen: "TaxLegalDocumentsPage"
                    },
                ].map((item, index) => (
                    <Pressable
                        key={index}
                        className="flex-row items-center py-3 border-b border-gray-200"
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center mr-3">
                            <Text>{item.icon}</Text>
                        </View>

                        <View className="flex-1">
                            <Text className="text-[15px] font-semibold text-gray-800">
                                {item.title}
                            </Text>
                            <Text className="text-[12px] text-gray-500 mt-1">
                                {item.sub}
                            </Text>
                        </View>

                        <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                    </Pressable>
                ))}

            </View>



            {/* Help & Support */}
            <View className="bg-white rounded-xl p-4 shadow">

                <Pressable
                    className="flex-row items-center mb-3"
                    onPress={() => navigation.navigate("HelpSupport")}
                >
                    <Text className="text-[16px] font-semibold">❓</Text>
                    <Text className="text-[16px] font-semibold ml-3 flex-1">Help & Support</Text>
                    <Text className="text-[18px] text-gray-400">›</Text>
                </Pressable>

                {[
                    { icon: "💬", title: "Contact Support", sub: "Chat with our team", route: "ContactSupportDetail" },
                    { icon: "📖", title: "Help Center", sub: "FAQs & guides", route: "HelpCenterDetail" },
                    { icon: "📱", title: "Tutorial Videos", sub: "Learn to use the app", route: "TutorialVideosDetail" },
                    { icon: "📝", title: "Terms & Conditions", sub: "Vendor policies", route: "TermsAndConditionsDetail" },
                    { icon: "🔒", title: "Privacy Policy", sub: "Data protection", route: "PrivacyPolicyDetail" },
                ].map((item, index) => (
                    <Pressable
                        key={index}
                        className="flex-row items-center py-3 border-b border-gray-200"
                        onPress={() => navigation.navigate(item.route as any)}
                    >
                        <View className="w-10 h-10 rounded-xl bg-red-100 items-center justify-center mr-3">
                            <Text>{item.icon}</Text>
                        </View>

                        <View className="flex-1">
                            <Text className="text-[15px] font-semibold text-gray-800">{item.title}</Text>
                            <Text className="text-[12px] text-gray-500 mt-1">{item.sub}</Text>
                        </View>

                        <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                    </Pressable>
                ))}

            </View>

        </ScrollView>
    );
};

export default Settings;
