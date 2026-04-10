import { fetchBookedRentalSlots } from "@/lib/rentals";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const bookingData = {
  Hattrick: [
    {
      field: "Field 1",
      type: "5v5",
      price: "$120/hr",
      slots: ["6:00 PM", "7:00 PM", "8:00 PM"],
    },
    {
      field: "Field 2",
      type: "7v7",
      price: "$140/hr",
      slots: ["6:00 PM", "8:00 PM", "9:00 PM"],
    },
    {
      field: "Field 3",
      type: "7v7",
      price: "$140/hr",
      slots: ["7:00 PM", "8:00 PM", "10:00 PM"],
    },
    {
      field: "Field 4",
      type: "5v5",
      price: "$120/hr",
      slots: ["5:00 PM", "6:00 PM", "7:00 PM"],
    },
  ],

  Patio: [
    {
      field: "Field 1",
      type: "7v7 Turf",
      price: "$120/hr",
      slots: ["6:00 PM", "7:00 PM", "8:00 PM"],
    },
    {
      field: "Field 2",
      type: "Futsal",
      price: "$120/hr",
      slots: ["5:00 PM", "6:00 PM", "8:00 PM"],
    },
  ],

  Oakridge: [
    {
      field: "Field 1",
      type: "7v7 Indoor Turf",
      price: "$120/hr",
      slots: ["6:30 PM", "7:30 PM", "8:30 PM"],
    },
    {
      field: "Field 2",
      type: "9v9 Outdoor Field",
      price: "$110/hr",
      slots: ["8:00 PM", "9:00 PM", "10:00 PM"],
    },
  ],
};

function formatLocalISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function convertDisplayTimeTo24Hour(time: string) {
  const [hourMinute, period] = time.split(" ");
  let [hours, minutes] = hourMinute.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:00`;
}

function isPastTimeForSelectedDate(selectedDate: string, slot: string) {
  const todayISO = formatLocalISODate(new Date());

  if (selectedDate !== todayISO) {
    return false;
  }

  const slot24 = convertDisplayTimeTo24Hour(slot);
  const [hours, minutes] = slot24.split(":").map(Number);

  const now = new Date();
  const slotDateTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  return slotDateTime.getTime() <= now.getTime();
}

export default function RentalBookingScreen() {
  const { location, date } = useLocalSearchParams<{
    location?: string;
    date?: string;
  }>();

  const selectedLocation = (location as keyof typeof bookingData) || "Hattrick";
  const selectedDate = date || formatLocalISODate(new Date());
  const fields = bookingData[selectedLocation];

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const chosenField = useMemo(() => {
    return fields.find((item) => item.field === selectedField) ?? null;
  }, [fields, selectedField]);

  const loadBookedSlots = useCallback(async () => {
    if (!selectedField || !selectedDate) {
      setBookedSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);

      const booked = await fetchBookedRentalSlots({
        location: selectedLocation,
        rental_date: selectedDate,
        field_name: selectedField,
      });

      setBookedSlots(booked);
    } catch (error) {
      console.log("Error loading booked rental slots:", error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedField, selectedLocation, selectedDate]);

  useEffect(() => {
    loadBookedSlots();
  }, [loadBookedSlots]);

  useFocusEffect(
    useCallback(() => {
      loadBookedSlots();
    }, [loadBookedSlots])
  );

  useEffect(() => {
    if (!selectedField) return;

    const interval = setInterval(() => {
      loadBookedSlots();
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedField, loadBookedSlots]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Choose Field</Text>
      <Text style={styles.subtitle}>
        {selectedLocation} • {selectedDate}
      </Text>

      <Text style={styles.sectionTitle}>Available Fields</Text>

      <View style={styles.optionGroup}>
        {fields.map((item) => {
          const isSelected = selectedField === item.field;

          return (
            <Pressable
              key={item.field}
              style={isSelected ? styles.optionActive : styles.option}
              onPress={() => {
                setSelectedField(item.field);
                setSelectedTime(null);
              }}
            >
              <Text
                style={isSelected ? styles.optionTextActive : styles.optionText}
              >
                {item.field}
              </Text>

              <Text
                style={
                  isSelected ? styles.optionSubTextActive : styles.optionSubText
                }
              >
                {item.type} • {item.price}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {chosenField && (
        <>
          <Text style={styles.sectionTitle}>Available Times</Text>

          {loadingSlots ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#F2DD77" />
              <Text style={styles.loadingText}>Checking availability...</Text>
            </View>
          ) : (
            <View style={styles.timeGrid}>
              {chosenField.slots.map((slot) => {
                const slot24Hour = convertDisplayTimeTo24Hour(slot);
                const isBooked = bookedSlots.includes(slot24Hour);
                const isPast = isPastTimeForSelectedDate(selectedDate, slot);
                const isUnavailable = isBooked || isPast;
                const isSelected = selectedTime === slot;

                return (
                  <Pressable
                    key={slot}
                    style={
                      isUnavailable
                        ? styles.timeButtonDisabled
                        : isSelected
                        ? styles.timeButtonActive
                        : styles.timeButton
                    }
                    onPress={() => {
                      if (!isUnavailable) {
                        setSelectedTime(slot);
                      }
                    }}
                    disabled={isUnavailable}
                  >
                    <Text
                      style={
                        isUnavailable
                          ? styles.timeTextDisabled
                          : isSelected
                          ? styles.timeTextActive
                          : styles.timeText
                      }
                    >
                      {slot}
                    </Text>

                    {isBooked && (
                      <Text style={styles.unavailableText}>Unavailable</Text>
                    )}

                    {!isBooked && isPast && (
                      <Text style={styles.unavailableText}>Past Time</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}

      {chosenField && selectedTime && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Review Booking</Text>

          <Text style={styles.summaryText}>Location: {selectedLocation}</Text>
          <Text style={styles.summaryText}>Date: {selectedDate}</Text>
          <Text style={styles.summaryText}>Field: {chosenField.field}</Text>
          <Text style={styles.summaryText}>Type: {chosenField.type}</Text>
          <Text style={styles.summaryText}>Time: {selectedTime}</Text>
          <Text style={styles.summaryText}>Price: {chosenField.price}</Text>

          <View style={styles.shadowWrapper}>
            <Pressable
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/checkout",
                  params: {
                    type: "rental",
                    location: selectedLocation,
                    date: selectedDate,
                    field: chosenField.field,
                    title: chosenField.type,
                    time: convertDisplayTimeTo24Hour(selectedTime),
                    duration: "1 hour",
                    price: chosenField.price,
                  },
                })
              }
            >
              <Text style={styles.buttonText}>Review & Confirm</Text>
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
    paddingBottom: 40,
    backgroundColor: "#1337f6",
    flexGrow: 1,
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
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 18,
    fontFamily: "Afacad",
    fontSize: 14,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 10,
    marginTop: 8,
  },

  optionGroup: {
    gap: 10,
    marginBottom: 18,
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
    fontSize: 16,
    fontFamily: "AfacadBold",
    marginBottom: 2,
  },

  optionTextActive: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
    marginBottom: 2,
  },

  optionSubText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontFamily: "Afacad",
  },

  optionSubTextActive: {
    color: "#1337f6",
    fontSize: 13,
    fontFamily: "Afacad",
  },

  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  loadingText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  timeButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 95,
    alignItems: "center",
  },

  timeButtonActive: {
    backgroundColor: "#F2DD77",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 95,
    alignItems: "center",
  },

  timeButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 95,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  timeText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  timeTextActive: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  timeTextDisabled: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  unavailableText: {
    color: "#ffb3b3",
    fontSize: 11,
    fontFamily: "Afacad",
    marginTop: 4,
  },

  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
    marginTop: 8,
  },

  summaryTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 12,
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