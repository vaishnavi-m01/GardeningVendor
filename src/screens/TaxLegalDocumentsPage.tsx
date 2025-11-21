import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const TaxLegalDocumentsPage = () => {
  const [documents, setDocuments] = useState([
    { id: 1, type: "GST Certificate", name: "GST_27AABCS1234K1Z5", status: "verified", uploadedDate: "15 Nov 2024" },
    { id: 2, type: "PAN Card", name: "PAN_ABCDE1234F", status: "verified", uploadedDate: "10 Nov 2024" },
    { id: 3, type: "Bank Verification", name: "Bank_HDFC_5432", status: "pending", uploadedDate: "18 Nov 2024" },
  ]);

  const requiredDocuments = [
    { id: 1, type: "GST Certificate", description: "Goods & Services Tax registration certificate", isRequired: true },
    { id: 2, type: "PAN Card", description: "Permanent Account Number for tax filing", isRequired: true },
    { id: 3, type: "Bank Verification", description: "Bank account proof (cancelled cheque or statement)", isRequired: true },
    { id: 4, type: "Address Proof", description: "Utility bill or government ID", isRequired: false },
  ];

  const handleUploadDocument = (type: string) => {
    Alert.alert("Upload Document", `Select file for ${type}`, [
      { text: "Cancel", onPress: () => {} },
      { text: "Choose File", onPress: () => Alert.alert("Success", `${type} uploaded successfully`) }
    ]);
  };

  const handleDeleteDocument = (id: number) => {
    Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
      { text: "Cancel", onPress: () => {} },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          setDocuments(documents.filter(doc => doc.id !== id));
          Alert.alert("Deleted", "Document has been removed");
        }
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    if (status === "verified") return { bg: "#ecfdf5", text: "#059669", icon: "checkmark-circle" };
    if (status === "pending") return { bg: "#fef3c7", text: "#b45309", icon: "hourglass" };
    return { bg: "#fecaca", text: "#dc2626", icon: "close-circle" };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafbfc" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Featured Card */}
        <View style={{ backgroundColor: "#fce7f3", borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 2, borderColor: "#fbcfe8", shadowColor: "#ec4899", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#ec4899", justifyContent: "center", alignItems: "center" }}>
              <Ionicons name="document-text" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#0f172a" }}>Tax & Legal Documents</Text>
              <Text style={{ fontSize: 12, color: "#be185d", marginTop: 2, fontWeight: "700" }}>COMPLIANCE</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: "#9f1239", lineHeight: 20 }}>Upload and manage your tax documents for business compliance.</Text>
        </View>

        {/* Uploaded Documents */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Uploaded Documents</Text>
          
          {documents.length === 0 ? (
            <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
              <Ionicons name="document-outline" size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
              <Text style={{ fontSize: 12, color: "#6b7280" }}>No documents uploaded yet</Text>
            </View>
          ) : (
            documents.map((doc) => {
              const statusColor = getStatusColor(doc.status);
              return (
                <View key={doc.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                      <Ionicons name="document" size={20} color="#6b7280" />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>{doc.type}</Text>
                      <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{doc.name}</Text>
                      <Text style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Uploaded: {doc.uploadedDate}</Text>
                    </View>

                    <View style={{ backgroundColor: statusColor.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Ionicons name={statusColor.icon as any} size={14} color={statusColor.text} />
                      <Text style={{ fontSize: 10, fontWeight: "700", color: statusColor.text, textTransform: "capitalize" }}>{doc.status}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: "#eff6ff", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#bfdbfe" }} activeOpacity={0.7} onPress={() => Alert.alert("Download", "Downloading document...")}>
                      <Ionicons name="download" size={14} color="#3b82f6" style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#3b82f6" }}>Download</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flex: 1, backgroundColor: "#fef2f2", borderRadius: 8, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#fecaca" }} activeOpacity={0.7} onPress={() => handleDeleteDocument(doc.id)}>
                      <Ionicons name="trash" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#ef4444" }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Required Documents */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Required Documents</Text>
          
          {requiredDocuments.map((doc, index) => {
            const isUploaded = documents.some(d => d.type === doc.type);
            return (
              <View key={doc.id} style={{ backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#1f2937", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Ionicons name={isUploaded ? "checkmark-circle" : "document-outline"} size={18} color={isUploaded ? "#10b981" : "#6b7280"} style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#0f172a" }}>
                        {doc.type} {doc.isRequired && <Text style={{ color: "#ef4444" }}>*</Text>}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{doc.description}</Text>
                    </View>
                  </View>

                  {!isUploaded && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#dbeafe",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "#bfdbfe",
                      }}
                      activeOpacity={0.7}
                      onPress={() => handleUploadDocument(doc.type)}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "700", color: "#0284c7" }}>Upload</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={{ backgroundColor: "#fce7f3", borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: "#ec4899" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons name="information-circle" size={18} color="#be185d" style={{ marginRight: 10, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#be185d" }}>Compliance Required</Text>
              <Text style={{ fontSize: 11, color: "#9f1239", marginTop: 4 }}>All marked documents (*) are required for account verification. Upload them to proceed with business operations.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaxLegalDocumentsPage;
