import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const locations = ["Hattrick", "Patio", "Oakridge"];

const locationInfo = {
  Hattrick: {
    address: "123 Hattrick Dr, Conroe, TX",
    fields: [
      "Field 1 - 5v5 - Turf - $120/hr",
      "Field 2 - 7v7 - Turf - $140/hr",
      "Field 3 - 7v7 - Turf - $140/hr",
      "Field 4 - 5v5 - Turf - $120/hr",
    ],
    shoes:
      "Turf shoes or regular cleats only. No artificial grass cleats, indoor cleats, or metal cleats.",
  },

  Patio: {
    address: "456 Patio Ln, Conroe, TX",
    fields: [
      "Field 1 - 7v7 - Turf - $120/hr",
      "Field 2 - Futsal - $120/hr",
    ],
    shoes:
      "Field 1 allows turf shoes or regular cleats. Field 2 allows indoor shoes only.",
  },

  Oakridge: {
    address: "789 Oakridge Blvd, Conroe, TX",
    fields: [
      "Field 1 - 7v7 - Indoor Turf - $120/hr",
      "Field 2 - 9v9 - Outdoor Field - $110/hr",
    ],
    shoes: "Turf shoes or regular cleats only.",
  },
};

export default function RentalsScreen() {
  const [selectedLocation, setSelectedLocation] = useState("Hattrick");
  const [selectedDate, setSelectedDate] = useState("2026-03-18");

  const info = locationInfo[selectedLocation as keyof typeof locationInfo];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Field Rentals</Text>
      <Text style={styles.subtitle}>Choose a location to view field details</Text>

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

      <View style={styles.calendarCard}>
        <Text style={styles.sectionTitle}>Select Date</Text>

        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: "#F2DD77",
              selectedTextColor: "#1337f6",
            },
          }}
          theme={{
            calendarBackground: "transparent",
            dayTextColor: "#ffffff",
            monthTextColor: "#ffffff",
            textDisabledColor: "rgba(255,255,255,0.35)",
            arrowColor: "#F2DD77",
            todayTextColor: "#F2DD77",
          }}
        />

        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{selectedLocation}</Text>
        <Text style={styles.detailText}>Address: {info.address}</Text>

        <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>Fields</Text>
        {info.fields.map((field, index) => (
          <Text key={index} style={styles.detailText}>
            • {field}
          </Text>
        ))}

        <Text style={[styles.sectionSubtitle, { marginTop: 12 }]}>Field Rules</Text>
        <Text style={styles.detailText}>{info.shoes}</Text>

        <View style={styles.shadowWrapper}>
          <Pressable
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/rental-booking",
                params: { location: selectedLocation, date: selectedDate },
              })
            }
          >
            <Text style={styles.buttonText}>Continue Booking</Text>
          </Pressable>
        </View>
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
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Afacad",
    textAlign: "center",
    marginBottom: 16,
  },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
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

  calendarCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  selectedDateText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Afacad",
    marginTop: 12,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 18,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "AfacadBold",
    marginBottom: 8,
  },

  sectionSubtitle: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "AfacadBold",
    marginBottom: 6,
  },

  detailText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 6,
  },

  shadowWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 16,
  },

  button: {
    backgroundColor: "#F2DD77",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },
});