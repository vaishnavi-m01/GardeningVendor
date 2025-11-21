import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GradientHeader from "../utils/GradientHeader";
import { RootStackParamList } from "../types/type";
import Splash from "../screens/Splash";
import DrawerNavigator from "./DrawerNavigator";
import AddProductForm from "../screens/AddProductForm";
import AddServicesForm from "../screens/AddServicesForm";
import ServicesSeparateDetails from "../screens/ServicesSeparateDetails";
import Plants from "../screens/Plants";
import AddPlantForm from "../screens/AddPlantForm";
import PlantsType from "../screens/PlantsType";
import AddPlantsByTypesForm from "../screens/AddPlantsByTypesForm";
import PlantsSeparateDetails from "../screens/PlantsSeparateDetails";
import Sales from "../screens/Sales";
import SalesDetails from "../screens/SalesDetails";
import Revenue from "../screens/Revenue";
import Analytics from "../screens/Analytics";
import ServicesBooking from "../screens/ServicesBooking";
import StockSummary from "../screens/StockSummary";
import RevenueDetails from "../screens/RevenueDetails";
import Orders from "../screens/Orders";
import Customers from "../screens/Customers";
import Products from "../screens/Products";
import OutOfStock from "../screens/OutOfStock";
import Chat from "../screens/Chat";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import Offers from "../screens/Offers";
import AddOfferForm from "../screens/AddOfferForm";
import Settings from "../screens/Settings";
import AccountSecurity from "../screens/AccountSecurity";
import HelpSupport from "../screens/HelpSupport";
import ContactSupportDetail from "../screens/ContactSupportDetail";
import HelpCenterDetail from "../screens/HelpCenterDetail";
import TutorialVideosDetail from "../screens/TutorialVideosDetail";
import TermsAndConditionsDetail from "../screens/TermsAndConditionsDetail";
import PrivacyPolicyDetail from "../screens/PrivacyPolicyDetail";
import ChangePasswordPage from "../screens/ChangePasswordPage";
import TwoFactorAuthPage from "../screens/TwoFactorAuthPage";
import PaymentMethodsPage from "../screens/PaymentMethodsPage";
import TaxLegalDocumentsPage from "../screens/TaxLegalDocumentsPage";
import LowStockPage from "../screens/LowStockPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

//  Partial Record fixes TS error
const screenHeaderConfig: Partial<
  Record<keyof RootStackParamList, { rightText?: string; onRightPress?: () => void }>
> = {
  AddProductForm: {
    rightText: "Save Draft",
    onRightPress: () => console.log("Draft saved!"),
  },
};

export default function StackScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={({ navigation, route }) => {
          const config = screenHeaderConfig[route.name];

          return {
            header: ({ options }) => (
              <GradientHeader
                title={options?.title || route.name}
                onBack={() => navigation.goBack()}
                rightText={config?.rightText}
                onRightPress={config?.onRightPress}
              />
            ),
          };
        }}
      >
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddProductForm"
          component={AddProductForm}
          options={{ title: "Add New Product", headerShown: false }}
        />
        <Stack.Screen
          name="AddServicesForm"
          component={AddServicesForm}
          options={{ title: "Add Service" }}
        />
        <Stack.Screen
          name="ServicesSeparateDetails"
          component={ServicesSeparateDetails}
          options={{ title: "Our Services", headerShown: false }}
        />
        <Stack.Screen name="Plants" component={Plants} options={{ title: "Plants" }} />
        <Stack.Screen name="AddPlantForm" component={AddPlantForm} options={{ title: "Add Plant" }} />
        <Stack.Screen name="PlantsType" component={PlantsType} options={{ title: "Plants By Types" }} />
        <Stack.Screen
          name="AddPlantsByTypesForm"
          component={AddPlantsByTypesForm}
          options={{ title: "Add Plant Types" }}
        />
        <Stack.Screen
          name="PlantsSeparateDetails"
          component={PlantsSeparateDetails}
          options={{ title: "Plants Details", headerShown: false }}
        />
        <Stack.Screen name="Sales" component={Sales} options={{ title: "Sales" }} />
        <Stack.Screen name="SalesDetails" component={SalesDetails} options={{ title: "Sales Details" }} />
        <Stack.Screen name="Revenue" component={Revenue} options={{ title: "Revenue" }} />
        <Stack.Screen name="Analytics" component={Analytics} options={{ title: "Analytics" }} />
        <Stack.Screen name="ServicesBooking" component={ServicesBooking} options={{ title: "Services Booking", headerShown: true }} />
        <Stack.Screen name="StockSummary" component={StockSummary} options={{ title: "Inventory" }} />
        <Stack.Screen name="RevenueDetails" component={RevenueDetails} options={{ title: "Revenue Details" }} />
        <Stack.Screen name="Orders" component={Orders} options={{ title: "Orders",headerShown:false }} />
        <Stack.Screen name="Offers" component={Offers} options={{ title: "Offers", headerShown: false }} />
        <Stack.Screen name="Customers" component={Customers} options={{ title: "Customers" }} />
        <Stack.Screen name="Products" component={Products} options={{ title: "Products", headerShown: false }} />
        <Stack.Screen name="OutOfStock" component={OutOfStock} options={{ title: "Out of Stock" }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="AddOfferForm" component={AddOfferForm} options={{ title: "Add Offer" }} />
        <Stack.Screen name="Settings" component={Settings} options={{ title: "Settings" }} />
        <Stack.Screen name="AccountSecurity" component={AccountSecurity} options={{ title: "Account & Security" }} />
        <Stack.Screen name="HelpSupport" component={HelpSupport} options={{ title: "Help & Support" }} />
        <Stack.Screen name="ContactSupportDetail" component={ContactSupportDetail} options={{ title: "Contact Support" }} />
        <Stack.Screen name="HelpCenterDetail" component={HelpCenterDetail} options={{ title: "Help Center" }} />
        <Stack.Screen name="TutorialVideosDetail" component={TutorialVideosDetail} options={{ title: "Tutorial Videos" }} />
        <Stack.Screen name="TermsAndConditionsDetail" component={TermsAndConditionsDetail} options={{ title: "Terms & Conditions" }} />
        <Stack.Screen name="PrivacyPolicyDetail" component={PrivacyPolicyDetail} options={{ title: "Privacy Policy" }} />
        <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage} options={{ title: "Change Password" }} />
        <Stack.Screen name="TwoFactorAuthPage" component={TwoFactorAuthPage} options={{ title: "Two-Factor" }} />
        <Stack.Screen name="PaymentMethodsPage" component={PaymentMethodsPage} options={{ title: "Payment Methods" }} />
        <Stack.Screen name="TaxLegalDocumentsPage" component={TaxLegalDocumentsPage} options={{ title: "Tax & Legal" }} />
        <Stack.Screen name="LowStockPage" component={LowStockPage} options={{ title: "Low Stock" }} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
