import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import apiClient from "../api/apiBaseUrl";
import { useVendor } from "../context/VendorContext";

const SignIn = () => {
  const navigation = useNavigation<any>();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { saveVendorData } = useVendor();


  const validateEmail = (text: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) return "Email is required";
    if (!emailRegex.test(text)) return "Invalid email format";
    return "";
  };

  const validatePassword = (text: string): string => {
    if (!text) return "Password is required";
    if (text.length < 6) return "Password must be at least 6 characters";
    return "";
  };




  const handleLogin = async () => {
    const emailError = validateEmail(emailId);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);

    try {
      const payload = { emailId, password };
      console.log("Login payload:", payload);

      const response = await apiClient.post("api/login-api/login", payload);
      console.log("API Response:", response.data);

      if (response.status === 200 && response.data?.emailId) {
        const { userId, vendorId, firstName } = response.data;

        const vendorInfo = { id: vendorId, userId: userId };
        await saveVendorData(vendorInfo);

        console.log(" vendorData stored globally:", vendorInfo);

        if (Platform.OS === "android") {
          ToastAndroid.show("Sign In Successful!", ToastAndroid.SHORT);
        } else {
          Toast.show({
            type: "success",
            text1: "Sign In Successful",
            text2: `Welcome back, ${firstName || "User"}!`,
          });
        }

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }, 1500);

      } else {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error?.response?.data || error.message);

      if (error?.response?.status === 401) {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
    finally {
      setLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: 60 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        // enableOnAndroid={true}
        // extraScrollHeight={Platform.OS === "ios" ? 20 : 40}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/Splash.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.header}>Log In</Text>

          {/* ✅ Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputInside}
                placeholder="Enter your Email"
                value={emailId}
                onChangeText={(text) => {
                  setEmailId(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* ✅ Password Field */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* ✅ Sign In Button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>Processing...</Text>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  scrollContainer: {
    // flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 50,

    // paddingVertical: 40,
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  logo: {
    height: 56,
    width: 138,
    resizeMode: "contain",
  },
  header: {
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 25,
    fontSize: 22,
    color: "#000",
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 2,
    borderColor: "#F2F2F2",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#F2F2F2",
    borderRadius: 30,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#359907",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#000",
    fontSize: 13,
  },
  signupLink: {
    color: "#007CEE",
    fontSize: 13,
    fontWeight: "bold",
  },
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F2F2F2",
    borderRadius: 30,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  inputInside: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#000",
  },

});
