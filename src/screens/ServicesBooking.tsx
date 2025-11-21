import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { useVendor } from "../context/VendorContext";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-gifted-charts";
import apiClient from "../api/apiBaseUrl";

type ServiceBooking = {
    id: number;
    bookingId: string;
    serviceName: string;
    customerName: string;
    bookingDate: string;
    bookingStatus: string;
    totalAmount: number;
    description: string;
};

type KeyMetricsType = {
    totalBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    rejectedBookings: number;
    pendingBookings?: number;
};

const metricsData = {
    total: 25,
    confirmed: 10,
    pending: 6,
    rejected: 3,
    completed: 4,
    cancelled: 2,
};

type MetricsKey = keyof typeof metricsData;






const ServicesBooking = () => {
    const { vendorData } = useVendor();
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState("today");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const navigation = useNavigation<any>();

    const [keyMetrics, setKeyMetrics] = useState({
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        rejectedBookings: 0,
        completedBookings: 0,
        pendingBookings: 0
    });

    const metricsList: {
        label: string;
        key: keyof typeof keyMetrics;
        icon: string;
        bg: string;
        color: string;
    }[] = [
            { label: "Confirmed", key: "confirmedBookings", icon: "checkmark-done", bg: "#ecfdf5", color: "#10b981" },
            { label: "Pending", key: "pendingBookings", icon: "time-outline", bg: "#fff7ed", color: "#f59e0b" },
            { label: "Completed", key: "completedBookings", icon: "checkmark-circle", bg: "#f0fdf4", color: "#22c55e" },
            { label: "Rejected", key: "rejectedBookings", icon: "close-circle", bg: "#fef2f2", color: "#ef4444" },
            { label: "Cancelled", key: "cancelledBookings", icon: "ban", bg: "#fef2f2", color: "#dc2626" },
        ];

    useFocusEffect(
        useCallback(() => {
            if (vendorData?.id) {
                fetchServiceBookings(vendorData.id);
            } else {
                fetchServiceBookings("");
            }
        }, [vendorData])
    );

    const fetchServiceBookings = async (vendorId: string) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/public/serviceBooking/getAll?vendorId=${vendorId}`);

            const sortedBookings = response.data.sort(
                (a: any, b: any) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
            );

            const latestBookings = sortedBookings.slice(0, 4);


            const formattedBookings: ServiceBooking[] = latestBookings.map((b: any) => ({
                id: b.id,
                bookingId: b.serviceBookingId,
                serviceName: b.serviceName,
                customerName: b.userName,
                bookingDate: b.createdDate,
                bookingStatus: b.orderStatus,
                totalAmount: b.totalAmount,
                description: `${b.addressName1}, ${b.addressName2}`,
            }));

            setBookings(formattedBookings);
        } catch (e) {
            console.error("Error fetching service bookings:", e);
        } finally {
            setLoading(false);
        }
    };


    const metrics = useMemo(() => {
        const totalBookings = bookings.length;
        const confirmed = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
        const pending = bookings.filter(b => b.bookingStatus === 'PENDING').length;
        const revenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
        const growth = totalBookings > 0 ? '+12%' : '+0%';
        return { totalBookings, confirmed, pending, revenue, growth };
    }, [bookings]);

    const pieData = useMemo(() => {
        const grouped: Record<string, number> = {};
        bookings.forEach(b => { grouped[b.serviceName] = (grouped[b.serviceName] || 0) + b.totalAmount; });
        const arr = Object.keys(grouped).map((k, i) => ({ value: grouped[k], color: ['#3b82f6', '#8b5cf6', '#06b6d4'][i % 3], text: k }));
        return arr.length ? arr : [{ value: 1, color: '#d1d5db', text: 'No Data' }];
    }, [bookings]);

    const bookingsByService = useMemo(() => {
        const map: Record<string, { value: number; count: number }> = {};
        bookings.forEach(b => {
            map[b.serviceName] = map[b.serviceName] || { value: 0, count: 0 };
            map[b.serviceName].value += b.totalAmount;
            map[b.serviceName].count += 1;
        });
        return Object.keys(map).map((k, i) => ({ id: String(i + 1), source: k, value: map[k].value, count: map[k].count, trend: '+5%' }));
    }, [bookings]);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED': return { bg: '#ecfdf5', text: '#047857', label: 'Delivered', icon: 'checkmark-circle' }; // ← added Delivered
            case 'CONFIRMED': return { bg: '#ecfdf5', text: '#047857', label: 'Confirmed', icon: 'checkmark-done' };
            case 'PENDING': return { bg: '#fffbeb', text: '#b45309', label: 'Pending', icon: 'time-outline' };
            case 'COMPLETED': return { bg: '#f0fdf4', text: '#15803d', label: 'Completed', icon: 'checkmark-circle' };
            case 'CANCELLED': return { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled', icon: 'close-circle' };
            case 'REJECT': return { bg: '#fef2f2', text: '#dc2626', label: 'Rejected', icon: 'close-circle' }; // ← REJECT added
            default: return { bg: '#f3f4f6', text: '#6b7280', label: status, icon: 'alert-circle' }; // ← default icon fixed
        }
    };


    const filtered = statusFilter === 'ALL' ? bookings : bookings.filter(b => b.bookingStatus === statusFilter);

    const formatDate = (d: string) => new Date(d).toLocaleDateString();


    const fetchDashboardCounts = async () => {
        try {
            const response = await apiClient.get(`/api/public/dashboard/countOrders?vendorId=${vendorData?.id}`)
            console.log("orders count response:", response.data)
            setKeyMetrics({
                totalBookings: response.data.totalBookings,
                confirmedBookings: response.data.confirmedBookings,
                completedBookings: response.data.completedBookings,
                cancelledBookings: response.data.cancelledBookings,
                rejectedBookings: response.data.rejectedBookings,
                pendingBookings: response.data.pendingBookings
            })
        } catch (error) {
            console.log("Error fetching dashboard counts:", error);
        }
    }

    useEffect(() => {
        fetchDashboardCounts();
    }, [])





    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{ backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingTop: 18, paddingBottom: 18, borderBottomWidth: 1, borderColor: '#e6eef5' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: '#0f172a', fontSize: 18, fontWeight: '800' }}>Service Bookings</Text>
                        <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Overview of service appointments</Text>
                    </View>

                    <View className="w-[155px]">
                        <View className="bg-white rounded-xl px-2 h-11 justify-center border border-gray-200 overflow-hidden">
                            <Picker
                                selectedValue={range}
                                onValueChange={(v) => setRange(v)}
                                dropdownIconColor="#16a34a"
                                style={{ height: 55, width: "100%", color: "#111827" }}
                                mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                            >
                                <Picker.Item label="Today" value="today" />
                                <Picker.Item label="This Week" value="weekly" />
                                <Picker.Item label="This Month" value="monthly" />
                                <Picker.Item label="This Year" value="yearly" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ paddingHorizontal: 12, paddingTop: 18 }}>
                {/* Featured card: Total Bookings / Revenue */}
                <View style={{ backgroundColor: '#10b981', borderRadius: 14, padding: 20, marginBottom: 22 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>TOTAL BOOKINGS</Text>
                    <Text style={{ color: '#ffffff', fontSize: 34, fontWeight: '800', marginTop: 8 }}>{keyMetrics.totalBookings} </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <Ionicons name="calendar" size={18} color="#ffffff" />
                        </View>
                        <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>{metrics.growth} vs last period</Text>
                    </View>
                </View>

                {/* KPI Grid */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: '#111827', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Key Metrics</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                        {metricsList.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    width: 160,
                                    backgroundColor: "#fff",
                                    borderRadius: 12,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: "#e5e7eb",
                                    marginRight: 12,
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            backgroundColor: item.bg,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 10,
                                        }}
                                    >
                                        <Ionicons name={item.icon} size={18} color={item.color} />
                                    </View>
                                    <View>
                                        <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700" }}>{item.label}</Text>
                                        <Text style={{ color: "#0f172a", fontSize: 18, fontWeight: "800", marginTop: 6 }}>
                                            {keyMetrics[item.key] ?? 0}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>


                </View>

                {/* Pie / Breakdown */}
                <View style={{ marginBottom: 28 }}>
                    <Text style={{ color: '#111827', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Bookings Breakdown</Text>
                    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}>
                        <PieChart data={pieData} donut radius={80} innerRadius={60} showTextBackground={false} textColor="#111827" textSize={12} />
                        <View style={{ marginTop: 18, width: '100%' }}>
                            {pieData.map((item, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.color, marginRight: 10 }} />
                                        <Text style={{ color: '#6b7280', fontSize: 13 }}>{item.text}</Text>
                                    </View>
                                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '600' }}>₹{(item.value / 1000).toFixed(1)}K</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Bookings list */}
                <View style={{ marginBottom: 20 }}>
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-gray-900 text-lg font-extrabold">Recent Bookings</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("MainTabs", {
                            screen: "MainTabs",
                            params: { screen: "Orders", params: { type: "Service" } },
                        })}>
                            <Text className="text-amber-500 text-xs font-bold">See all</Text>
                        </TouchableOpacity>
                    </View>                    {loading ? (
                        <View style={{ alignItems: 'center', padding: 24 }}>
                            <ActivityIndicator size="large" color="#0284c7" />
                        </View>
                    ) : filtered.length === 0 ? (
                        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}>
                            <Text style={{ fontSize: 40, marginBottom: 8 }}>📅</Text>
                            <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: '700' }}>No bookings found</Text>
                            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>{statusFilter === 'ALL' ? 'No service bookings yet' : `No ${statusFilter.toLowerCase()} bookings`}</Text>
                        </View>
                    ) : (
                        filtered.map((b) => {
                            const s = getStatusColor(b.bookingStatus);
                            return (
                                <View key={b.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                        <View style={{ flex: 1, paddingRight: 8 }}>
                                            <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '700' }}>Service</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 6 }}>{b.serviceName}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: s.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' }}>
                                                <Ionicons name={s.icon as any} size={14} color={s.text} style={{ marginRight: 4 }} />
                                                <Text style={{ color: s.text, fontWeight: '700' }}>{s.label}</Text>
                                            </View>

                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="person-circle-outline" size={18} color="#6b7280" />
                                            <Text style={{ marginLeft: 8, fontWeight: '700', color: '#0f172a' }}>{b.customerName}</Text>
                                        </View>


                                        <Text style={{ color: '#6b7280', fontSize: 11 }}>{formatDate(b.bookingDate)}</Text>
                                    </View>


                                    <Text style={{ color: '#6b7280', marginBottom: 8 }}>{b.description}</Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontFamily: 'monospace', color: '#9ca3af' }}>ID: {b.bookingId}</Text>
                                        <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                                            <Text style={{ color: '#2563eb', fontWeight: '700' }}>₹{b.totalAmount}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default ServicesBooking;
