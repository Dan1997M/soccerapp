import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PaymentMethodsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Saved Methods</Text>
        <Text style={styles.emptyText}>
          No payment methods added yet.
        </Text>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Add Payment Method</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
    backgroundColor: "#1337f6",
    flexGrow: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backArrow: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginRight: 14,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "AfacadBold",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 10,
  },

  emptyText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontFamily: "Afacad",
  },

  primaryButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },
});