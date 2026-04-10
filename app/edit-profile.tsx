import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Profile Photo</Text>
        <Text style={styles.detailText}>
          Upload and camera options can be added next.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Player Details</Text>
        <Text style={styles.detailText}>Preferred position: Coming soon</Text>
        <Text style={styles.detailText}>Skill level: Coming soon</Text>
      </View>

      <Pressable style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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

  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontFamily: "Afacad",
    marginBottom: 8,
  },

  saveButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  saveButtonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },
});