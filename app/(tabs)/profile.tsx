import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";



export default function ProfileScreen() {
  const { profile, loading } = useProfile();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/10.jpg" }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {loading ? "loading..." : profile?.full_name}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Profile</Text>
        <Text style={styles.detailText}>Preferred Position: Midfielder</Text>
        <Text style={styles.detailText}>Skill Level: Intermediate</Text>
        <Text style={styles.detailText}>Favorite Field: Hattrick</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My Activity</Text>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>My Pickup Games</Text>
        </Pressable>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>My Rentals</Text>
        </Pressable>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>My Friends</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>Notifications</Text>
        </Pressable>

        <Pressable style={styles.rowButton}>
          <Text style={styles.rowButtonText}>Payment Methods</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Pressable
          style={[styles.rowButton, { backgroundColor: "#ff4d4d" }]}
          onPress={handleSignOut}
        >
          <Text style={[styles.rowButtonText, { textAlign: "center" }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 140,
    backgroundColor: "#1337f6",
    flexGrow: 1,
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 14,
  },

  name: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginBottom: 4,
  },

  username: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "Afacad",
    marginBottom: 22,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 12,
  },

  detailText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 8,
  },

  rowButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  rowButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "AfacadBold",
  },
});