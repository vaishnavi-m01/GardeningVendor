import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Card from "../component/dashboard/Card";

const RevenueDetails = () => {
  const navigation = useNavigation<any>();

  // Dummy data list
  const data = [
    {
      id: "1",
      unique: "REV001",
      date: "10/10/2025",
      name: "Vaishnavi M",
      amount: 12000,
      title: "Premium Product Package for Gardening Tools",
    },
    {
      id: "2",
      unique: "REV002",
      date: "09/10/2025",
      name: "John Smith",
      amount: 8500,
      title: "Maintenance Service with Additional Accessories",
    },
  ];

  return (
    <View className="flex-1 items-center justify-center bg-[#F5F5F5]">
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.navigate("RevenueDetails", {
              id: item.id,
              unique: item.unique,
              date: item.date,
              name: item.name,
              amount: item.amount,
              title: item.title,
            })
          }
        >
          <Card {...item} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RevenueDetails;
