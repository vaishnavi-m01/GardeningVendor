import React from "react";
import { View } from "react-native";
import CardDetails from "../component/dashboard/CardDetails";
import { useRoute } from "@react-navigation/native";

const SalesDetails = () => {
  const route = useRoute<any>();
  const { id, unique, date, name, amount, title } = route.params;

  return (
    <View className="flex-1 mt-4 px-2 bg-[#f5f5f5]">
      <CardDetails
        id={id}
        unique={unique}
        date={date}
        name={name}
        amount={amount}
        title={title}
      />
    </View>
  );
};

export default SalesDetails;
