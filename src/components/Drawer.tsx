import React, { useState, useRef, useCallback, useEffect } from "react";
import { DrawerContentScrollView, useDrawerStatus } from "@react-navigation/drawer";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  Platform,
  ToastAndroid,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CustomDrawerContent = (props: any) => {
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const menuItems = [
    // { name: "Home", icon: "home-outline", screenName: "MainTabs" },
    { name: "Analytics", icon: "stats-chart-outline", screenName: "Analytics" },
    { name: "Offers", icon: "pricetags-outline", screenName: "Offers" },
    { name: "Products", icon: "cube-outline", screenName: "Products" },
    { name: "Orders", icon: "swap-horizontal-outline", screenName: "Orders" },
    { name: "Customers", icon: "people-outline", screenName: "Customers" },
    { name: "Revenue", icon: "wallet-outline", screenName: "Revenue" },
    { name: "Messages", icon: "chatbubbles-outline", screenName: "Message" },
    { name: "Settings", icon: "settings-outline", screenName: "Settings" },
  ];

  // const accountSecurityItems = [
  //   { name: "Change Password", icon: "key-outline", screenName: "ChangePasswordPage" },
  //   { name: "Two-Factor Auth", icon: "shield-outline", screenName: "TwoFactorAuthPage" },
  //   { name: "Payment Methods", icon: "card-outline", screenName: "PaymentMethodsPage" },
  //   { name: "Tax & Documents", icon: "document-text-outline", screenName: "TaxLegalDocumentsPage" },
  // ];

  const drawerStatus = useDrawerStatus();

  useEffect(() => {
    if (drawerStatus === 'open') {
      // Reset selection whenever drawer opens
      setSelectedScreen(null);
    }
  }, [drawerStatus]);


  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const handleNavigate = (screen: string) => {
    setSelectedScreen(screen);

    if (screen === "Message") {
      props.navigation.navigate("MainTabs", {
        screen: "Messages",
      });
    } else {
      props.navigation.navigate(screen);
    }

    props.navigation.closeDrawer();
  };



  const confirmLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("vendorData");
    setIsLogoutModalVisible(false);
    if (Platform.OS === "android") {
      ToastAndroid.show("Logout successful", ToastAndroid.SHORT);
    } else {
      Alert.alert("Logout successful");
    }
    props.navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  const cancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <View style={styles.drawerContainer}>
      <LinearGradient
        colors={["#2d6a4f", "#40916c"]}
        style={styles.topHeader}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: 6,
              borderRadius: 12,
            }}
          >
            <Ionicons name="leaf-outline" size={20} color="#fff" />
          </View>

          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                opacity: 0.9,
                fontFamily: "Poppins-Regular",
                paddingTop: 5
              }}
            >
              Welcome Back,
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "600",
                fontFamily: "Poppins-SemiBold",
              }}
            >
              Garden Haven 🌿
            </Text>
          </View>
        </View>
      </LinearGradient>



      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => {
          const isSelected = selectedScreen === item.screenName;
          return (
            <Animated.View
              key={item.screenName}
              style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
            >
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isSelected && styles.menuItemSelected,
                ]}
                onPress={() => handleNavigate(item.screenName)}
              >
                <View
                  style={[
                    styles.menuItemIcon,
                    isSelected && styles.menuItemIconSelected,
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={isSelected ? "#ffffff" : "#2d6a4f"}
                  />
                </View>
                <Text
                  style={[
                    styles.menuItemText,
                    isSelected && styles.menuItemTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={isSelected ? "#ffffff" : "#9ca3af"}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}


        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <View style={styles.logoutIcon}>
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color="#ef4444"
            />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Logout Modal */}
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
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: "#fff", paddingBottom: 20 },

  topHeader: {
    paddingVertical: 40,
    paddingHorizontal: 24,

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  menuContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuItemSelected: {
    backgroundColor: "#2d6a4f",
    borderColor: "#2d6a4f",
  },

  menuItemIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemIconSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  menuItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },

  submenuContainer: {
    backgroundColor: "#f0fdf4",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#bbf7d0",
  },
  submenuItemLast: {
    borderBottomWidth: 0,
  },
  submenuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#ecfdf5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  submenuText: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    marginHorizontal: 16,
    marginTop: 20,
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
