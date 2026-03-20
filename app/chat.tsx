import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ChatMessage,
  getConversation,
  markChatAsRead,
  sendMessage,
} from "../constants/playerStore";

export default function ChatScreen() {
  const { name, username, image } = useLocalSearchParams<{
    name?: string;
    username?: string;
    image?: string;
  }>();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (username) {
      markChatAsRead(username);
      setMessages([...getConversation(username)]);
    }
  }, [username]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !username) return;

    sendMessage(username, trimmedMessage);
    setMessages([...getConversation(username)]);
    setMessage("");

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <Image
          source={{
            uri: image || "https://via.placeholder.com/100",
          }}
          style={styles.headerAvatar}
        />

        <View>
          <Text style={styles.headerName}>{name || "Player Chat"}</Text>
          {!!username && <Text style={styles.headerUsername}>{username}</Text>}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((item) => (
          <View
            key={item.id}
            style={
              item.sender === "me"
                ? styles.sentMessage
                : styles.receivedMessage
            }
          >
            <Text
              style={
                item.sender === "me" ? styles.sentText : styles.receivedText
              }
            >
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="rgba(255,255,255,0.65)"
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />

        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 14,
  },

  backArrow: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "AfacadBold",
    marginRight: 10,
  },

  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  headerName: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
  },

  headerUsername: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Afacad",
    marginTop: 1,
  },

  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "78%",
  },

  receivedText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Afacad",
  },

  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F2DD77",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "78%",
  },

  sentText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 46,
    color: "#ffffff",
    fontFamily: "Afacad",
  },

  sendButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },
});