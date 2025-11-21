import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ToastAndroid,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiBaseUrl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const SignUp = () => {
  const navigation = useNavigation<any>();

  // User fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vendor fields
  const [shopName, setShopName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // ---------------- Validation ----------------
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!value.trim()) return "Email is required";
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };
  const validatePhone = (value: string) => {
    if (!value.trim()) return "Phone is required";
    if (!/^\d{10}$/.test(value)) return "Phone must be 10 digits";
    return "";
  };
  const validatePassword = (value: string) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };
  const validateConfirmPassword = (value: string) => {
    if (!value.trim()) return "Confirm Password is required";
    if (value !== password) return "Passwords do not match";
    return "";
  };
  const validateName = (value: string) => (!value.trim() ? "Name is required" : "");
  const validateShopName = (value: string) => (!value.trim() ? "Shop Name is required" : "");

  const handleBlur = (field: string, value: string) => {
    const validators: any = {
      name: validateName,
      email: validateEmail,
      phone: validatePhone,
      password: validatePassword,
      confirmPassword: validateConfirmPassword,
      shopName: validateShopName,
    };
    if (validators[field]) setErrors((prev: any) => ({ ...prev, [field]: validators[field](value) }));
  };

  // ---------------- Signup & Vendor ----------------
  const handleSignUp = async () => {
    const newErrors: any = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
      shopName: validateShopName(shopName),
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error !== "");
    if (hasError) return;

    setLoading(true);
    try {
      // ---- 1. Create User ----
      const userPayload = {
        firstName: name,
        lastName: "",
        emailId: email,
        mobileNumber: phone,
        password,
        confirmPassword,
        activeStatus: true,
        roleId: 1,
      };
      const userResponse = await apiClient.post("api/public/user/add", userPayload);

      if (userResponse.status === 200 && userResponse.data?.id) {
        const userId = userResponse.data.id;

        // ---- 2. Create Vendor ----
        const vendorPayload = {
          userId,
          vendorName: name,
          shopName,
          shopImageUrl: "",
          contactDetails: phone,
          taxId: taxId || "",
          gstNumber: gstNumber || "",
          registrationNumber: registrationNumber || "",
          shopAddress: shopAddress || "",
          postalCode: postalCode || "",
          activeStatus: true,
        };

        const vendorResponse = await apiClient.post("api/public/vendor/add", vendorPayload);

        if (vendorResponse.status === 200 && vendorResponse.data) {
          await AsyncStorage.setItem("vendorData", JSON.stringify(vendorResponse.data));
          ToastAndroid.showWithGravityAndOffset(
            "Signup Successful 🎉",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            120
          );
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setConfirmPassword("");
          setShopName("");
          setTaxId("");
          setGstNumber("");
          setRegistrationNumber("");
          setShopAddress("");
          setPostalCode("");
          setTimeout(() => navigation.navigate("MainTabs"), 1200);
        } else {
          const errorMsg = vendorResponse.data?.message || "Vendor creation failed";
          ToastAndroid.showWithGravityAndOffset(
            `Error ❌: ${errorMsg}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            120
          );
        }
      } else {
        const errorMsg = userResponse.data?.message || "Signup failed";
        ToastAndroid.showWithGravityAndOffset(
          `Error ❌: ${errorMsg}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          0,
          120
        );
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Network error";
      ToastAndroid.showWithGravityAndOffset(
        `Error ⚠️: ${errorMsg}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        120
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/Splash.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.header}>Create Your Vendor Account</Text>

        <View style={styles.form}>
          {/* ---- User Fields ---- */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputInside}
              placeholder="Enter Your Name *"
              value={name}
              onChangeText={setName}
              onBlur={() => handleBlur("name", name)}
            />
          </View>
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputInside}
              placeholder="Enter Your Email *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => handleBlur("email", email)}
            />
          </View>
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputInside}
              placeholder="Enter Your Mobile Number"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, "").slice(0, 10))}
              keyboardType="phone-pad"
              onBlur={() => handleBlur("phone", phone)}
            />
          </View>
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Your Password *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onBlur={() => handleBlur("password", password)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onBlur={() => handleBlur("confirmPassword", confirmPassword)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

          {/* ---- Vendor Fields ---- */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputInside}
              placeholder="Shop Name *"
              value={shopName}
              onChangeText={setShopName}
              onBlur={() => handleBlur("shopName", shopName)}
            />
          </View>
          {errors.shopName && <Text style={styles.error}>{errors.shopName}</Text>}

          {[
            { placeholder: "Tax ID", value: taxId, setter: setTaxId },
            { placeholder: "GST Number", value: gstNumber, setter: setGstNumber },
            { placeholder: "Registration Number", value: registrationNumber, setter: setRegistrationNumber },
            { placeholder: "Shop Address", value: shopAddress, setter: setShopAddress },
            { placeholder: "Postal Code", value: postalCode, setter: setPostalCode, keyboardType: "numeric" },
          ].map((item, index) => (
            <View key={index} style={styles.inputContainer}>
              <TextInput
                style={styles.inputInside}
                placeholder={item.placeholder}
                value={item.value}
                onChangeText={item.setter}
              // keyboardType={item.keyboardType || "default"}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/images/google.png")}
                style={styles.icons}
              />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image
                source={require("../assets/images/facebook.png")}
                style={styles.icons}
              />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.1,
    paddingBottom: 50,
    backgroundColor: "#fff",
  },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 140, height: 60 },
  header: { textAlign: "center", fontSize: 22, fontWeight: "900", color: "#000", marginBottom: 25 },
  form: { width: "100%" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 30,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputInside: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderRadius: 30,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#000" },
  error: { color: "red", marginBottom: 10, fontSize: 12, marginLeft: 6 },
  button: { backgroundColor: "#359907", padding: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signinContainer: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  signinText: { color: "#000", fontSize: 13 },
  signinLink: { color: "#007CEE", fontSize: 13, fontWeight: "bold" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 130,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  icons: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
