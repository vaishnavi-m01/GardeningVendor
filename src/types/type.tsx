export type RootStackParamList = {
    Splash: undefined;
    MainTabs: undefined;
    ServicesSeparateDetails: {
        id: string;
        Name: string;
        image: string | number;
        fromMyServices?: boolean;
    };
    AddServicesForm: undefined;
    AddProductForm: undefined;
    Plants: undefined;
    PlantsType: undefined;
    PlantsSeparateDetails: {
        id: string;
        Name: string;
        image: string | number;
        fromMyServices?: boolean;

    },
    AddPlantForm: undefined;
    Sales: undefined;
    SalesDetails: undefined;
    Revenue: undefined;
    Analytics: undefined;
    ServicesBooking: undefined;
    StockSummary: undefined;
    RevenueDetails: undefined;
    Orders: undefined;
    Customers: undefined;
    Products: undefined;
    OutOfStock: undefined;
    AddPlantsByTypesForm: undefined;
    Chat: undefined;
    SignIn: undefined;
    SignUp: undefined;
    Offers:undefined;
    AddOfferForm:undefined;
    Settings: undefined;
    AccountSecurity: undefined;
    HelpSupport: undefined;
    ContactSupportDetail: undefined;
    HelpCenterDetail: undefined;
    TutorialVideosDetail: undefined;
    TermsAndConditionsDetail: undefined;
    PrivacyPolicyDetail: undefined;
    ChangePasswordPage: undefined;
    TwoFactorAuthPage: undefined;
    PaymentMethodsPage: undefined;
    TaxLegalDocumentsPage: undefined;
    LowStockPage: { items?: any[] } | undefined;
};

export type MainTabParamList = {
    Dashboard: undefined;
    Bookings: undefined;
    Services: undefined;
    Profile: undefined;
};
