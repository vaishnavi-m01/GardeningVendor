import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddPlantForm = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        try {
            const imagePicker = launchImageLibrary;
            if (!imagePicker) {
                console.log("Image Picker not available");
                return;
            }

            const result = await imagePicker({
                mediaType: "photo",
                quality: 1,
                selectionLimit: 1,
            });

            if (result.didCancel) return;
            if (result.errorMessage) console.log(result.errorMessage);

            if (result.assets?.[0]?.uri) setImageUri(result.assets[0].uri);
        } catch (error) {
            console.log("Error picking image:", error);
        }
    };


    return (
        <View className="flex-1 bg-white">
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === "ios" ? 40 : 60}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                className="px-4 py-2"
            >
                {/* Service */}
                <Text className="font-LeagueSpartan font-bold text-[18px] text-[#2A2A2A] mb-4 mt-1">
                    Plant Name
                </Text>
                <TextInput
                    placeholder="Plant "
                    className="h-[45px] rounded-[10px] border border-[#C7C7C7] px-3 mb-4"
                />

                {/* Description */}
                <Text className="font-LeagueSpartan font-bold text-[18px] text-[#2A2A2A] mb-4">
                    Description
                </Text>
                <TextInput
                    placeholder="Enter description"
                    multiline
                    textAlignVertical="top"
                    className="h-[100px] rounded-[10px] border border-[#C7C7C7] px-3 py-2 mb-4"
                />

                {/* Image Upload */}
                <Text className="font-LeagueSpartan font-bold text-[18px] text-[#2A2A2A] mb-4">
                    Image Upload
                </Text>
                <TouchableOpacity
                    onPress={pickImage}
                    className="h-[180px] border border-dashed border-[#A1A1A1] rounded-[10px] bg-gray-50 items-center justify-center mb-4"
                >
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-full h-full rounded-[10px]"
                            resizeMode="cover"
                        />
                    ) : (
                        <Text className="text-gray-500 text-[15px]">Tap to select image</Text>
                    )}
                </TouchableOpacity>

                {/* Price */}
                <Text className="font-LeagueSpartan font-bold text-[18px] text-[#2A2A2A] mb-4">
                    Price
                </Text>
                <TextInput
                    placeholder="Enter price"
                    keyboardType="numeric"
                    className="h-[45px] rounded-[10px] border border-[#C7C7C7] px-3 mb-8"
                />

                {/* Submit Button */}
                <TouchableOpacity className="bg-[#003602] py-3 rounded-full items-center mt-4 mb-10">
                    <Text className="text-[#FFFFFF] font-semibold text-[16px]">Submit</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default AddPlantForm;
