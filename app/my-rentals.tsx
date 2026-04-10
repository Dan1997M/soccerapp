import { cancelRental, fetchMyRentals, Rental } from "@/lib/rentals";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type DisplayRental = {
  id: string;
  location: string;
  dateLabel: string;
  fieldLabel: string;
  timeLabel: string;
  duration: string;
  price: string;
  status: string;
  isPast: boolean;
  sortDateTime: number;
};

function parseLocalDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(isoDate: string) {
  const today = new Date();
  const date = parseLocalDate(isoDate);

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const rentalOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffMs = rentalOnly.getTime() - todayOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function buildRentalDateTime(rental: Rental) {
  const date = parseLocalDate(rental.rental_date);

  let hours = 0;
  let minutes = 0;

  if (rental.start_time.includes(":")) {
    const parts = rental.start_time.split(":");
    hours = Number(parts[0]) || 0;
    minutes = Number(parts[1]) || 0;
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  ).getTime();
}

export default function MyRentalsScreen() {
  const [rentals, setRentals] = useState<DisplayRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRentals = useCallback(async () => {
    try {
      const data = await fetchMyRentals();

      const mapped = data.map((rental) => {
        const sortDateTime = buildRentalDateTime(rental);
        const isPast =
          rental.status === "cancelled" ? true : sortDateTime < Date.now();

        return {
          id: rental.id,
          location: rental.location,
          dateLabel: formatDateLabel(rental.rental_date),
          fieldLabel: `${rental.field_name} • ${rental.field_type}`,
          timeLabel: rental.start_time,
          duration: rental.duration,
          price: rental.price,
          status: rental.status,
          isPast,
          sortDateTime,
        };
      });

      setRentals(mapped);
    } catch (error) {
      console.log("Error loading rentals:", error);
      setRentals([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        setLoading(true);
        await loadRentals();
        if (active) {
          setLoading(false);
        }
      };

      run();

      return () => {
        active = false;
      };
    }, [loadRentals])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRentals();
    setRefreshing(false);
  };

  const upcomingRentals = useMemo(() => {
    return [...rentals]
      .filter((rental) => !rental.isPast && rental.status === "booked")
      .sort((a, b) => a.sortDateTime - b.sortDateTime);
  }, [rentals]);

  const pastRentals = useMemo(() => {
    return [...rentals]
      .filter((rental) => rental.isPast || rental.status === "cancelled")
      .sort((a, b) => b.sortDateTime - a.sortDateTime);
  }, [rentals]);

  const handleCancelRental = (rentalId: string) => {
    Alert.alert(
      "Cancel Rental?",
      "Are you sure you want to cancel this rental?",
      [
        { text: "Keep Rental", style: "cancel" },
        {
          text: "Cancel Rental",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelRental(rentalId);
              Alert.alert("Cancelled", "Your rental has been cancelled.");
              await loadRentals();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Could not cancel rental."
              );
            }
          },
        },
      ]
    );
  };

  const renderRentalCard = (rental: DisplayRental, isPast = false) => (
    <View key={rental.id} style={styles.card}>
      <Text style={styles.cardTitle}>{rental.location}</Text>
      <Text style={styles.cardText}>{rental.fieldLabel}</Text>
      <Text style={styles.cardText}>
        {rental.dateLabel} • {rental.timeLabel}
      </Text>
      <Text style={styles.cardText}>Duration: {rental.duration}</Text>
      <Text style={styles.cardText}>Price: {rental.price}</Text>

      <View style={styles.bottomRow}>
        <View>
          <View
            style={
              rental.status === "cancelled"
                ? styles.cancelledBadge
                : isPast
                ? styles.pastBadge
                : styles.bookedBadge
            }
          >
            <Text
              style={
                rental.status === "cancelled"
                  ? styles.cancelledBadgeText
                  : isPast
                  ? styles.pastBadgeText
                  : styles.bookedBadgeText
              }
            >
              {rental.status === "cancelled"
                ? "Cancelled"
                : isPast
                ? "Past Rental"
                : "Booked"}
            </Text>
          </View>
        </View>

        {!isPast && rental.status === "booked" && (
          <Pressable
            style={styles.cancelButton}
            onPress={() => handleCancelRental(rental.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel Rental</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Rentals</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#F2DD77" />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Rentals</Text>
            {upcomingRentals.length > 0 ? (
              upcomingRentals.map((rental) => renderRentalCard(rental, false))
            ) : (
              <Text style={styles.emptyText}>
                You have no upcoming rentals yet.
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Rentals</Text>
            {pastRentals.length > 0 ? (
              pastRentals.map((rental) => renderRentalCard(rental, true))
            ) : (
              <Text style={styles.emptyText}>
                You have no past rentals yet.
              </Text>
            )}
          </View>
        </>
      )}
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

  loadingWrap: {
    paddingTop: 80,
    alignItems: "center",
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 12,
  },

  emptyText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    fontFamily: "Afacad",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 8,
  },

  cardText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    fontFamily: "Afacad",
    marginBottom: 6,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  bookedBadge: {
    backgroundColor: "#F2DD77",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

  bookedBadgeText: {
    color: "#1337f6",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },

  pastBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },

  pastBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },

  cancelledBadge: {
    backgroundColor: "rgba(255,77,77,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },

  cancelledBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },

  cancelButton: {
    backgroundColor: "#ff4d4d",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  cancelButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },
});