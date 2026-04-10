import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <Text style={styles.detailText}>
          Join confirmations, invites, reminders, and updates can be managed
          here later.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <Text style={styles.emptyText}>
          You have no notifications right now.
        </Text>
      </View>
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

  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontFamily: "Afacad",
  },

  emptyText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontFamily: "Afacad",
  },
});