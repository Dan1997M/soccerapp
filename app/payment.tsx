import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#1337f6" />
      </Pressable>

      <Text style={styles.title}>Payment Screen</Text>
      <Text style={styles.subtitle}>
        This is where your payment flow will go later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F2DD77",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginBottom: 8,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Afacad",
    textAlign: "center",
  },
});