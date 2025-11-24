import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AudioRecorderPlayer from "react-native-nitro-sound";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Get screen width for message bubble sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Define a type for a single message
interface Message {
  from: "me" | "them";
  text: string;
  time: string;
  audio?: string; // Optional field for voice message URI
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const route = useRoute();
  // Safely extract route params
  const { userName, initials } = (route.params as any) || {};

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "them",
      text: "Hello! How can I assist you today regarding your order?",
      time: "10:30 AM",
    },
    {
      from: "me",
      text: "Hi! I had a question about my service request.",
      time: "10:31 AM",
    },
    {
      from: "them",
      text: "Sure! Could you please share your order ID?",
      time: "10:32 AM",
    },
    { from: "me", text: "It’s ORD-8901.", time: "10:33 AM" },
    {
      from: "them",
      text: "Thank you! I’ve checked your order. It’s currently being processed.",
      time: "10:35 AM",
    },
  ]);

  const scrollRef = useRef<ScrollView | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0); // Holds recording time in ms

  // Use the imported singleton instance
  const audioRecorderPlayer = AudioRecorderPlayer;

  // --- Utility Effects ---

  // Scroll to bottom on new message
  useEffect(() => {
    // A small timeout helps ensure the scroll calculation happens after the new message is rendered
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages]);

  // --- Message Handling ---

  // Send Text Message
  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      from: "me",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  const handleCall = () => {
    Alert.alert("Calling", `Calling ${userName || "User"}...`);
  };

  // --- Voice Recording Functions ---

  const checkAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone to record audio.",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permission Denied",
            "Microphone permission is required to send voice messages."
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled differently
  };

  const onStartRecord = async () => {
    if (!(await checkAudioPermission())) return;

    try {
      // Note: The library handles setting the default file path and format.
      const uri = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      setRecordSecs(0); // Reset timer on start
      console.log("Recording started at:", uri);

      audioRecorderPlayer.addRecordBackListener((e: any) => {
        // e.currentPosition is in milliseconds
        setRecordSecs(e.currentPosition);
        return;
      });
    } catch (error) {
      console.error("Recording start error:", error);
      setRecording(false);
    }
  };

  const onStopRecord = async () => {
    if (!recording) return; // Prevents stopping if not actively recording

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);

      const durationSecs = Math.round(recordSecs / 1000); // Convert ms to seconds
      setRecordSecs(0); // Clear timer

      console.log("Recording saved:", result);

      // Only send if recording lasted more than 1 second
      if (durationSecs > 1) {
        setMessages((prev) => [
          ...prev,
          {
            from: "me",
            // Display duration in the message text for visual feedback
            text: `[🎙️ Voice Message - ${durationSecs}s]`,
            audio: result, // Save the URI
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        // Discard short recording and notify user
        Alert.alert("Recording too short", "Voice message must be at least 1 second long. Discarded.");
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      setRecording(false); // Ensure state is reset
      setRecordSecs(0);
    }
  };

  // Function to cancel and discard the recording
  const onCancelRecord = async () => {
    if (!recording) return;

    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setRecordSecs(0);
      console.log("Recording cancelled.");
      Alert.alert("Recording Cancelled", "The voice message was discarded.");
    } catch (error) {
      console.error("Cancel recording error:", error);
      setRecording(false);
      setRecordSecs(0);
    }
  };


  // --- Rendering Functions ---

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  const renderMessageBubble = (msg: Message, index: number) => {
    const mine = msg.from === "me";
    const isVoiceMessage = msg.audio && msg.text.includes("[🎙️ Voice Message");

    return (
      <View
        key={index}
        style={{
          marginBottom: 12,
          alignItems: mine ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={[
            styles.bubble,
            mine ? styles.bubbleRight : styles.bubbleLeft,
            { maxWidth: SCREEN_WIDTH * 0.85 },
          ]}
        >
          {/* Main message content (Text or Voice Placeholder) */}
          <Text
            style={{
              color: mine ? "#0f172a" : "#374151",
              fontSize: 14,
              lineHeight: 20,
              fontStyle: isVoiceMessage ? 'italic' : 'normal',
            }}
          >
            {msg.text}
          </Text>

          {/* Time Stamp */}
          <Text
            style={{
              color: mine ? "#6b7280" : "#9ca3af",
              fontSize: 10,
              alignSelf: "flex-end",
              marginTop: 4,
            }}
          >
            {msg.time}
          </Text>
        </View>
      </View>
    );
  };

  // --- Conditional Rendering for Action Button (Mic OR Send) ---
  const renderActionButton = () => {
    // 1. If text is present, show the Send button (calls sendMessage)
    if (message.length > 0) {
      return (
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
          <Icon name="send" size={24} color="#40916c" />
        </TouchableOpacity>
      );
    }

    // 2. If no text, show the Microphone button (Hold to Record, calls onStartRecord/onStopRecord)
    return (
      <TouchableOpacity
        onPressIn={onStartRecord}
        // Note: onPressOut is disabled here because the dedicated recording UI now handles Stop/Send
        // We rely on the user to click the send button in the recording UI or cancel.
        style={{ marginLeft: 10 }}
      >
        <Icon name={"microphone-outline"} size={26} color={"#40916c"} />
      </TouchableOpacity>
    );
  };


  // --- Main Component Render ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#2d6a4f", "#40916c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View
          style={{ flexDirection: "row", alignItems: "center", flex: 1, marginLeft: 8 }}
        >
          <View style={styles.avatar}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {(initials || "RK").toUpperCase()}
            </Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {userName || "Rajesh Kumar"}
            </Text>
            <Text style={{ color: "#fff", opacity: 0.9, fontSize: 12 }}>
              Online now
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleCall} style={styles.headerIcon}>
            <Icon name="phone" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, { marginLeft: 8 }]}>
            <Icon name="dots-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ORDER BANNER */}
      <View style={styles.orderBanner}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#1971c2", fontWeight: "700" }}>
            📦 Order #ORD-8901
          </Text>
          <Text style={{ marginLeft: 12, color: "#333" }}>•</Text>
          <Text style={{ marginLeft: 8, color: "#40916c", fontWeight: "700" }}>
            Processing
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: "#1971c2", fontWeight: "700" }}>View Order</Text>
        </TouchableOpacity>
      </View>

      {/* BODY & KEYBOARD AVOIDING VIEW */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}

        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 89 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: "#6b7280", fontSize: 12 }}>Today</Text>
          </View>

          {messages.map(renderMessageBubble)}
        </ScrollView>


        {/* INPUT BAR (CONDITIONAL UI) */}
        <View
          style={[
            styles.inputWrap,
            {
              paddingBottom: Platform.OS === "ios" ? 16 : 16,
            },
          ]}
        >
          {recording ? (
            // 🎤 RECORDING UI: Shows Delete Icon, Timer, and Send Icon 🎤
            <View style={styles.recordingInputContent}>
              {/* DELETE/CANCEL Icon */}
              <TouchableOpacity onPress={onCancelRecord} style={styles.recordingIcon}>
                <Icon name="delete" size={24} color="#d00000" />
              </TouchableOpacity>

              {/* Timer / Indicator */}
              <View style={styles.recordingStatus}>
                <Icon name="record-circle" size={18} color="#d00000" />
                <Text style={styles.recordingTimerText}>{formatTime(recordSecs)}</Text>
              </View>

              {/* STOP & SEND Icon (Calls onStopRecord) */}
              <TouchableOpacity onPress={onStopRecord} style={styles.recordingIcon}>
                <Icon name="send" size={24} color="#40916c" />
              </TouchableOpacity>
            </View>
          ) : (
            // 📝 TEXT INPUT UI: Shows Attachment, Camera, Text Input, and Conditional Action Button 📝
            <>
              <TouchableOpacity style={styles.inputIcon}>
                <Icon name="paperclip" size={22} color="#555" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.inputIcon, { marginLeft: 6 }]}>
                <Icon name="camera" size={22} color="#555" />
              </TouchableOpacity>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />

              {/* Render the appropriate action button (Microphone OR Send) */}
              {renderActionButton()}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 14 : 35, // Adjust for iOS/Android status bar difference
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  orderBanner: {
    backgroundColor: "#e7f5ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#dceefe",
  },
  // --- Message Bubbles ---
  bubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 1, // Subtle shadow for Android
    shadowColor: "#000", // Subtle shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bubbleLeft: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4, // "Point" at the top-left corner
  },
  bubbleRight: {
    backgroundColor: "#d8f3dc", // Light green
    alignSelf: "flex-end",
    borderTopRightRadius: 4, // "Point" at the top-right corner
  },
  // --- Input Bar ---
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingTop: 6,
    position: 'relative',
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
  },
  // --- Recording UI Styles ---
  recordingInputContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 40, // Match typical input height
  },
  recordingIcon: {
    padding: 8,
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows status to take up central space
    justifyContent: 'center',
  },
  recordingTimerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
});

export default ChatScreen;