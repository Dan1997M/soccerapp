import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const bookingData = {
  Hattrick: [
    {
      field: "Field 1",
      slots: ["6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"],
      price: "$120/hr",
    },
    {
      field: "Field 2",
      slots: ["6:00 PM - 7:00 PM", "8:00 PM - 9:00 PM"],
      price: "$140/hr",
    },
    {
      field: "Field 3",
      slots: ["7:00 PM - 8:00 PM", "9:00 PM - 10:00 PM"],
      price: "$140/hr",
    },
    {
      field: "Field 4",
      slots: ["5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"],
      price: "$120/hr",
    },
  ],

  Patio: [
    {
      field: "Field 1",
      slots: ["6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
      price: "$120/hr",
    },
    {
      field: "Field 2",
      slots: ["5:00 PM - 6:00 PM", "8:00 PM - 9:00 PM"],
      price: "$120/hr",
    },
  ],

  Oakridge: [
    {
      field: "Field 1",
      slots: ["6:30 PM - 7:30 PM", "7:30 PM - 8:30 PM"],
      price: "$120/hr",
    },
    {
      field: "Field 2",
      slots: ["8:00 PM - 9:00 PM", "9:00 PM - 10:00 PM"],
      price: "$110/hr",
    },
  ],
};

export default function RentalBookingScreen() {
  const { location } = useLocalSearchParams<{ location: string }>();

  const rentals =
    bookingData[(location as keyof typeof bookingData) || "Hattrick"];

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const chosenFieldData = useMemo(
    () => rentals.find((item) => item.field === selectedField) ?? null,
    [rentals, selectedField]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#1337f6" />
      </Pressable>

      <Text style={styles.title}>Choose Time</Text>
      <Text style={styles.subtitle}>{location} Rentals</Text>

      <Text style={styles.sectionTitle}>Select Field</Text>
      <View style={styles.optionGroup}>
        {rentals.map((item) => (
          <Pressable
            key={item.field}
            style={
              selectedField === item.field ? styles.optionActive : styles.option
            }
            onPress={() => {
              setSelectedField(item.field);
              setSelectedTime(null);
            }}
          >
            <Text
              style={
                selectedField === item.field
                  ? styles.optionTextActive
                  : styles.optionText
              }
            >
              {item.field} • {item.price}
            </Text>
          </Pressable>
        ))}
      </View>

      {chosenFieldData && (
        <>
          <Text style={styles.sectionTitle}>Available Times</Text>
          <View style={styles.optionGroup}>
            {chosenFieldData.slots.map((slot) => (
              <Pressable
                key={slot}
                style={
                  selectedTime === slot ? styles.optionActive : styles.option
                }
                onPress={() => setSelectedTime(slot)}
              >
                <Text
                  style={
                    selectedTime === slot
                      ? styles.optionTextActive
                      : styles.optionText
                  }
                >
                  {slot}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {selectedField && selectedTime && chosenFieldData && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>Location: {location}</Text>
          <Text style={styles.summaryText}>Field: {selectedField}</Text>
          <Text style={styles.summaryText}>Time: {selectedTime}</Text>
          <Text style={styles.summaryText}>Price: {chosenFieldData.price}</Text>

          <View style={styles.shadowWrapper}>
            <Pressable
              style={styles.button}
              onPress={() => router.push("/payment")}
            >
              <Text style={styles.buttonText}>Proceed to Payment</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 30,
    backgroundColor: "#1337f6",
    flexGrow: 1,
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F2DD77",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
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

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 10,
    marginTop: 10,
  },

  optionGroup: {
    gap: 10,
    marginBottom: 16,
  },

  option: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    padding: 14,
  },

  optionActive: {
    backgroundColor: "#F2DD77",
    borderRadius: 18,
    padding: 14,
  },

  optionText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Afacad",
  },

  optionTextActive: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 18,
    marginTop: 8,
  },

  summaryTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 10,
  },

  summaryText: {
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