import { createRental } from "@/lib/rentals";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { joinPickupGame } from "../lib/pickupGames";

export default function CheckoutScreen() {
  const {
    id,
    type,
    title,
    location,
    date,
    time,
    price,
    field,
    duration,
  } = useLocalSearchParams<{
    id?: string;
    type?: string;
    title?: string;
    location?: string;
    date?: string;
    time?: string;
    price?: string;
    field?: string;
    duration?: string;
  }>();

  const handleProceedToPayment = async () => {
    try {
      if (type === "pickup") {
        if (!id) {
          throw new Error("Game ID missing");
        }

        await joinPickupGame(id);

        Alert.alert("Payment Successful", "You have joined the pickup game.", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/pickups");
            },
          },
        ]);

        return;
      }

      if (type === "rental") {
        if (!location || !date || !field || !time || !price) {
          throw new Error("Missing rental details");
        }

        await createRental({
          location,
          rental_date: date,
          field_name: field,
          field_type: title || "Field Rental",
          start_time: time,
          duration: duration || "1 hour",
          price,
        });

        Alert.alert("Booking Confirmed", "Your field has been reserved.", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/my-rentals");
            },
          },
        ]);

        return;
      }

      Alert.alert(
        "Coming Soon",
        "This payment flow is not connected yet for this booking type."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not complete payment");
    }
  };

  const headerLabel =
    type === "pickup"
      ? "Pickup Game"
      : type === "rental"
      ? "Field Rental"
      : "Competition Registration";

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Review & Confirm</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>{headerLabel}</Text>

          {!!title && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Title</Text>
              <Text style={styles.infoValue}>{title}</Text>
            </View>
          )}

          {!!location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{location}</Text>
            </View>
          )}

          {!!field && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {type === "compete" ? "Team" : "Field"}
              </Text>
              <Text style={styles.infoValue}>{field}</Text>
            </View>
          )}

          {!!date && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
          )}

          {!!time && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {type === "compete" ? "Entry Type" : "Time"}
              </Text>
              <Text style={styles.infoValue}>{time}</Text>
            </View>
          )}

          {!!duration && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {type === "compete" ? "Format" : "Duration"}
              </Text>
              <Text style={styles.infoValue}>{duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{price || "$0"}</Text>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Before You Pay</Text>
          <Text style={styles.noticeText}>
            Please review your booking details carefully before continuing.
          </Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleProceedToPayment}>
          <Text style={styles.primaryButtonText}>Proceed to Payment</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1337f6",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
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

  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },

  infoLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "Afacad",
    flex: 1,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "AfacadBold",
    flex: 1,
    textAlign: "right",
  },

  totalCard: {
    backgroundColor: "#F2DD77",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#1337f6",
    fontSize: 20,
    fontFamily: "AfacadBold",
  },

  totalValue: {
    color: "#1337f6",
    fontSize: 24,
    fontFamily: "AfacadBold",
  },

  noticeCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  noticeTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 8,
  },

  noticeText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    fontFamily: "Afacad",
    lineHeight: 22,
  },

  primaryButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryButtonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },

  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },
});