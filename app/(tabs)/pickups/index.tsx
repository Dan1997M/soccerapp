import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const days = [
  { label: "Today", date: "16" },
  { label: "Mon", date: "17" },
  { label: "Tue", date: "18" },
  { label: "Wed", date: "19" },
  { label: "Thu", date: "20" },
  { label: "Fri", date: "21" },
  { label: "Sat", date: "22" },
  { label: "Sun", date: "23" },
];

const locations = ["Hattrick", "Patio", "Oakridge"];

const gamesByLocation = {
  Hattrick: [
    {
      id: 1,
      title: "Evening 7v7",
      date: "Today",
      time: "8:00 PM",
      spotsLeft: 3,
      price: "$10",
    },
    {
      id: 8,
      title: "Evening 7v7",
      date: "Today",
      time: "7:00 PM",
      spotsLeft: 2,
      price: "$10",
    },
    {
      id: 9,
      title: "Evening 5v5",
      date: "Today",
      time: "9:00 PM",
      spotsLeft: 1,
      price: "$10",
    },
    {
      id: 2,
      title: "Late Night Match",
      date: "Tue",
      time: "9:30 PM",
      spotsLeft: 5,
      price: "$12",
    },
    {
      id: 7,
      title: "Morning Pickup",
      date: "Today",
      time: "10:00 AM",
      spotsLeft: 4,
      price: "$9",
    },
  ],
  Patio: [
    {
      id: 3,
      title: "Patio Open Play",
      date: "Wed",
      time: "7:00 PM",
      spotsLeft: 4,
      price: "$8",
    },
    {
      id: 4,
      title: "Patio Small-Sided",
      date: "Fri",
      time: "8:15 PM",
      spotsLeft: 2,
      price: "$10",
    },
  ],
  Oakridge: [
    {
      id: 5,
      title: "Oakridge Pickup",
      date: "Thu",
      time: "6:30 PM",
      spotsLeft: 6,
      price: "$9",
    },
    {
      id: 6,
      title: "Weekend Match",
      date: "Sat",
      time: "10:00 AM",
      spotsLeft: 1,
      price: "$11",
    },
  ],
};

function convertTimeToMinutes(time: string) {
  const [hourMinute, period] = time.split(" ");
  let [hours, minutes] = hourMinute.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

export default function PickupsScreen() {
  const [selectedDay, setSelectedDay] = useState("Today");
  const [selectedLocation, setSelectedLocation] = useState("Hattrick");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = gamesByLocation[
    selectedLocation as keyof typeof gamesByLocation
  ]
    .filter((game) => {
      const matchesDay =
        selectedDay === "Today"
          ? game.date === "Today"
          : game.date === selectedDay;

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        game.title.toLowerCase().includes(query) ||
        game.time.toLowerCase().includes(query) ||
        selectedLocation.toLowerCase().includes(query);

      return matchesDay && matchesSearch;
    })
    .sort((a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time));

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick Up Games</Text>
          <Text style={styles.subtitle}>Choose a day and location</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search game, time, or location"
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}
        >
          {days.map((day) => (
            <Pressable
              key={day.label}
              style={
                day.label === selectedDay
                  ? styles.dayChipActive
                  : styles.dayChip
              }
              onPress={() => setSelectedDay(day.label)}
            >
              <Text
                style={
                  day.label === selectedDay
                    ? styles.dayChipActiveText
                    : styles.dayChipText
                }
              >
                {day.label}
              </Text>

              <Text
                style={
                  day.label === selectedDay
                    ? styles.dayChipActiveDateText
                    : styles.dayChipDateText
                }
              >
                {day.date}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

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
      </View>

      <ScrollView
        style={styles.cardsScroll}
        contentContainerStyle={styles.cardsWrapper}
        showsVerticalScrollIndicator={false}
      >
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <View key={game.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>{game.title}</Text>
                <Text style={styles.price}>{game.price}</Text>
              </View>

              <Text style={styles.cardDateTime}>
                {game.date} • {game.time}
              </Text>

              <View style={styles.bottomRow}>
                <Text style={styles.spotsText}>{game.spotsLeft} spots left</Text>

                <View style={styles.shadowWrapper}>
                  <Pressable style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join Game</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noGamesText}>
            No games available for this day at {selectedLocation}.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1337f6",
    paddingTop: 100,
    paddingHorizontal: 20,
  },

  topSection: {
    marginBottom: 12,
  },

  header: {
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    textAlign: "center",
    marginBottom: 2,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Afacad",
    textAlign: "center",
  },

  searchInput: {
    height: 48,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingHorizontal: 16,
    color: "#ffffff",
    fontFamily: "Afacad",
    fontSize: 15,
    marginBottom: 4,
  },

  daysRow: {
    paddingBottom: 6,
    gap: 10,
    alignItems: "center",
  },

  dayChip: {
    backgroundColor: "rgba(255,255,255,0.16)",
    width: 78,
    height: 68,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  dayChipActive: {
    backgroundColor: "#F2DD77",
    width: 78,
    height: 68,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  dayChipText: {
    color: "#ffffff",
    fontFamily: "Afacad",
    fontSize: 15,
  },

  dayChipActiveText: {
    color: "#1337f6",
    fontFamily: "AfacadBold",
    fontSize: 15,
  },

  dayChipDateText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Afacad",
    fontSize: 13,
    marginTop: 2,
  },

  dayChipActiveDateText: {
    color: "#1337f6",
    fontFamily: "AfacadBold",
    fontSize: 13,
    marginTop: 2,
  },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
    marginTop: 2,
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

  cardsScroll: {
    flex: 1,
  },

  cardsWrapper: {
    gap: 14,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 18,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    flex: 1,
    marginRight: 12,
  },

  price: {
    color: "#F2DD77",
    fontSize: 18,
    fontFamily: "AfacadBold",
  },

  cardDateTime: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  spotsText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontFamily: "Afacad",
  },

  shadowWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },

  joinButton: {
    backgroundColor: "#F2DD77",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  joinButtonText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  noGamesText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Afacad",
    textAlign: "center",
    marginTop: 20,
  },
});