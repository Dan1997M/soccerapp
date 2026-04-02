import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StartupScreen() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)/pickups");
    }
  }, [loading, session]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#ffffff" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={styles.letters}>th</Text>
        <Text style={styles.bigThree}>3</Text>
        <Text style={styles.letters}>hattrick</Text>
      </View>

      <View style={styles.shadowWrapper}>
        <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 60,
  },
  letters: {
    fontFamily: "AfacadBold",
    fontSize: 72,
    color: "#ffffff",
    marginBottom: 14,
  },
  bigThree: {
    fontFamily: "AfacadBold",
    fontSize: 110,
    color: "#ffffff",
    marginHorizontal: 2,
    transform: [{ translateY: 10 }],
  },
  shadowWrapper: {
    width: "70%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12,
  },
  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#F2DD77",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#0B2AAE",
    fontSize: 18,
    fontWeight: "700",
  },
});