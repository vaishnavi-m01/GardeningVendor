import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the shape of vendor data
export interface VendorData {
  id: string;
  userId: string;
}

// Define the context type
interface VendorContextType {
  vendorData: VendorData | null;
  saveVendorData: (data: VendorData) => Promise<void>;
  clearVendorData: () => Promise<void>;
}

// Create the context
const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Provider component
export const VendorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const stored = await AsyncStorage.getItem("vendorData");
        if (stored) {
          setVendorData(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading vendorData:", error);
      }
    };
    loadVendorData();
  }, []);

  const saveVendorData = async (data: VendorData) => {
    try {
      setVendorData(data);
      await AsyncStorage.setItem("vendorData", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving vendorData:", error);
    }
  };

  const clearVendorData = async () => {
    try {
      setVendorData(null);
      await AsyncStorage.removeItem("vendorData");
    } catch (error) {
      console.error("Error clearing vendorData:", error);
    }
  };

  return (
    <VendorContext.Provider value={{ vendorData, saveVendorData, clearVendorData }}>
      {children}
    </VendorContext.Provider>
  );
};

// Custom hook for easy usage
export const useVendor = (): VendorContextType => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
};
