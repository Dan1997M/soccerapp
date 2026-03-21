import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const locations = ["Hattrick", "Patio", "Oakridge"];

const locationDetails = {
  Hattrick: {
    address: "123 Hattrick Dr, Conroe, TX",
    summary: "Best for 7v7 tournaments and weekday leagues.",
  },
  Patio: {
    address: "456 Patio Ln, Conroe, TX",
    summary: "Great for futsal events and small-sided competitions.",
  },
  Oakridge: {
    address: "789 Oakridge Blvd, Conroe, TX",
    summary: "Ideal for larger league formats and weekend matches.",
  },
};

export default function CompeteScreen() {
  const [selectedLocation, setSelectedLocation] = useState("Hattrick");

  const info =
    locationDetails[selectedLocation as keyof typeof locationDetails];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Compete</Text>
      <Text style={styles.subtitle}>
        Choose a location and register your team for leagues or tournaments
      </Text>

      <Text style={styles.sectionTitle}>Select Location</Text>

      <View style={styles.locationRow}>
        {locations.map((location) => (
          <Pressable
            key={location}
            style={
              location === selectedLocation
                ? styles.locationChipActive
                : styles.locationChip
            }
            onPress={() => setSelectedLocation(location)}
          >
            <Text
              style={
                location === selectedLocation
                  ? styles.locationChipActiveText
                  : styles.locationChipText
              }
            >
              {location}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{selectedLocation}</Text>
        <Text style={styles.infoText}>Address: {info.address}</Text>
        <Text style={styles.infoText}>{info.summary}</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: "/team-registration",
              params: {
                location: selectedLocation,
              },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Register Team</Text>
        </Pressable>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>What happens next?</Text>
        <Text style={styles.noteText}>
          After registering your team, the app will show the leagues and
          tournaments available for your selected location.
        </Text>
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
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontFamily: "Afacad",
    textAlign: "center",
    marginBottom: 22,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },

  locationChip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },

  locationChipActive: {
    flex: 1,
    backgroundColor: "#F2DD77",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },

  locationChipText: {
    color: "#ffffff",
    fontFamily: "Afacad",
    fontSize: 14,
  },

  locationChipActiveText: {
    color: "#1337f6",
    fontFamily: "AfacadBold",
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  infoTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "AfacadBold",
    marginBottom: 10,
  },

  infoText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 8,
  },

  primaryButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  primaryButtonText: {
    color: "#1337f6",
    fontSize: 15,
    fontFamily: "AfacadBold",
  },

  noteCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 18,
  },

  noteTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 8,
  },

  noteText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
    lineHeight: 22,
  },
});