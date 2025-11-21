import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View, Text, ScrollView, Platform, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Card from "../component/dashboard/Card";

const salesData = [
    { label: "Services", value: 50000 },
    { label: "Products", value: 30000 },
    { label: "Others", value: 20000 },
];

const dummyData = [
    { id: "1", unique: "12345", date: "10/10/2025", name: "Vaishnavi", title: "Plant Care", amount: 2599 },
    { id: "2", unique: "12345", date: "10/10/2025", name: "Karthik", title: "Lawn Care", amount: 1899 },
    { id: "3", unique: "12345", date: "10/10/2025", name: "Ananya", title: "Plants", amount: 749 },
    { id: "4", unique: "12345", date: "10/10/2025", name: "Ravi", title: "Pest and Disease Control", amount: 1199 },
];

const chartColors = ["#74D07D", "#9B97FF", "#FFD593"];

const SalesChart = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const totalSales = salesData.reduce((sum, item) => sum + item.value, 0);
    const [selectedValue, setSelectedValue] = useState("today");

    const pieData = salesData.map((item, index) => ({
        value: item.value,
        text: `${item.value}`,
        color: chartColors[index % chartColors.length],
        onPress: () => setSelectedIndex(index),
    }));

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#f5f7fa" }} contentContainerStyle={{ padding: 16 }} className="pt-2">
            <View className="flex-row justify-between items-center mb-2">
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#003602" }}>Sales Analytics</Text>
                <View style={{ borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 8, height: 44, width: 150, overflow: "hidden", backgroundColor: "#fff" }}>
                    <Picker selectedValue={selectedValue} onValueChange={(v) => setSelectedValue(v)} dropdownIconColor="#003602" style={{ height: 44, width: "100%", color: "#003602" }} mode={Platform.OS === "ios" ? "dialog" : "dropdown"}>
                        <Picker.Item label="Today" value="today" />
                        <Picker.Item label="Weekly" value="weekly" />
                        <Picker.Item label="Monthly" value="monthly" />
                        <Picker.Item label="Yearly" value="yearly" />
                    </Picker>
                </View>
            </View>

            <View style={{ marginTop: 12 }}>
                <View className="flex-row justify-between mb-4">
                    <TouchableOpacity className="w-[32%] bg-white rounded-xl p-3" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3 }}>
                        <Text className="text-sm text-gray-500">Total Sales</Text>
                        <Text className="text-lg font-bold text-[#083D26] mt-1">₹{totalSales.toLocaleString('en-IN')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[32%] bg-white rounded-xl p-3" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3 }}>
                        <Text className="text-sm text-gray-500">Top Category</Text>
                        <Text className="text-lg font-bold text-[#083D26] mt-1">{salesData[0].label}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[32%] bg-white rounded-xl p-3" style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3 }}>
                        <Text className="text-sm text-gray-500">Range</Text>
                        <Text className="text-lg font-bold text-[#083D26] mt-1">{selectedValue.charAt(0).toUpperCase()+selectedValue.slice(1)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E0E0E0' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#083D26', marginBottom: 8 }}>Sales Breakdown</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <PieChart data={pieData} radius={70} innerRadius={36} labelsPosition="outward" shadow={false} strokeColor="transparent" />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            {pieData.map((p, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 12, height: 12, backgroundColor: p.color, borderRadius: 6, marginRight: 8 }} />
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>{salesData[i].label}</Text>
                                    </View>
                                    <Text style={{ color: '#6b7280' }}>₹{salesData[i].value.toLocaleString('en-IN')}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <Text className="font-[LeagueSpartan] text-[#003602] font-bold text-[18px] mt-6 mb-4">Today Sales</Text>
                <View>
                    {dummyData.map((item) => (
                        <Card key={item.id} id={item.id} unique={item.unique} date={item.date} name={item.name} title={item.title} amount={item.amount} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default SalesChart;
