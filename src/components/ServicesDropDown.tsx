import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../api/apiBaseUrl";

interface ServiceDropdownProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

const ServicesDropdown: React.FC<ServiceDropdownProps> = ({ selectedId, onSelect }) => {
  const [services, setServices] = useState<Array<{ id: number; name: string }>>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient.get("api/public/serviceSubCategory/getAll");
        if (Array.isArray(res.data)) {
          setServices(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  const selectedItem = services.find((s) => s.id === selectedId);

  return (
    <View className="mb-3">
      <Text className="text-sm font-semibold text-gray-700 mb-1">
        Services Category <Text className="text-red-500">*</Text>
      </Text>

      <TouchableOpacity
        className="border border-gray-300 rounded-xl p-3 bg-white flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-800">
          {selectedItem ? selectedItem.name : "Select Category"}
        </Text>
        <Ionicons name={modalVisible ? "chevron-up" : "chevron-down"} size={20} color="#333" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30"
          onPress={() => setModalVisible(false)}
        />

        <View className="absolute top-1/3 left-5 right-5 bg-white rounded-xl max-h-72 shadow-lg p-1">
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`px-4 py-3 border-b border-gray-200 ${
                  selectedId === item.id ? "bg-green-50" : ""
                }`}
                onPress={() => {
                  onSelect(item.id);
                  setModalVisible(false);
                }}
              >
                <Text className="text-gray-800">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ServicesDropdown;
