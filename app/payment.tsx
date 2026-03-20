import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function PaymentScreen() {
  const { location, date, time } = useLocalSearchParams();

  return (
    <View style={styles.container}>

      {/* 🔙 BACK BUTTON */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Confirm Booking</Text>

      <Text style={styles.info}>Location: {location}</Text>
      <Text style={styles.info}>Date: {date}</Text>
      <Text style={styles.info}>Time: {time}</Text>

      <Text style={styles.note}>
        (Payment integration coming next 🔥)
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
  },

  headerRow: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },

  backArrow: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "AfacadBold",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "AfacadBold",
    marginBottom: 20,
  },

  info: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },

  note: {
    marginTop: 20,
    color: "rgba(255,255,255,0.7)",
  },
});