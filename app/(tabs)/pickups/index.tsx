import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fetchPickupGames, PickupGame } from "../../../lib/pickupGames";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekDays() {
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);

    result.push({
      label: i === 0 ? "Today" : weekdayLabels[current.getDay()],
      date: current.getDate().toString(),
      fullDate: current.toISOString().split("T")[0],
    });
  }

  return result;
}

const days = getWeekDays();

const locations = ["Hattrick", "Patio", "Oakridge"];

const locationImageMap: Record<string, string> = {
  hattrick: "https://picsum.photos/id/1011/1200/700",
  patio: "https://picsum.photos/id/1035/1200/700",
  oakridge: "https://picsum.photos/id/1043/1200/700",
};

function formatLocationForDb(location: string) {
  return location.toLowerCase();
}

function formatLocationForUi(location: string) {
  return location.charAt(0).toUpperCase() + location.slice(1);
}

function formatTime(time: string) {
  if (!time) return "";

  const [hourString, minuteString] = time.split(":");
  let hour = Number(hourString);
  const minute = minuteString ?? "00";

  const suffix = hour >= 12 ? "PM" : "AM";

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour = hour - 12;
  }

  return `${hour}:${minute} ${suffix}`;
}

function convertTimeToMinutes(time: string) {
  const cleanTime = formatTime(time);
  const [hourMinute, period] = cleanTime.split(" ");
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
  const days = useMemo(() => getWeekDays(), []);
  const [selectedDay, setSelectedDay] = useState("Today");
  const [selectedLocation, setSelectedLocation] = useState("Hattrick");
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<PickupGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      setLoading(true);
      const data = await fetchPickupGames();
      setGames(data);
    } catch (error) {
      console.log("Error fetching games:", error);
      Alert.alert("Error", "Could not load pickup games.");
    } finally {
      setLoading(false);
    }
  }

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesLocation =
          game.location === formatLocationForDb(selectedLocation);

        const query = searchQuery.toLowerCase().trim();

        const matchesSearch =
          query.length === 0 ||
          game.format.toLowerCase().includes(query) ||
          game.field_name.toLowerCase().includes(query) ||
          game.surface.toLowerCase().includes(query) ||
          game.location.toLowerCase().includes(query) ||
          formatTime(game.start_time).toLowerCase().includes(query);

        // Day filter is temporarily not connected yet because your seeded SQL dates
        // are real database dates, while these chips are still mock UI labels.
        const selectedDayData = days.find((day) => day.label === selectedDay);

        const matchesDay = selectedDayData
        ? game.game_date === selectedDayData.fullDate
        : true;

        return matchesLocation && matchesSearch && matchesDay;
      })
      .sort(
        (a, b) =>
          convertTimeToMinutes(a.start_time) - convertTimeToMinutes(b.start_time)
      );
  }, [games, searchQuery, selectedDay, selectedLocation]);

  const openGameDetails = (game: PickupGame) => {
    router.push({
      pathname: "/(tabs)/pickups/[id]",
      params: {
        id: game.id,
        title: game.format,
        date: game.game_date,
        time: formatTime(game.start_time),
        spotsLeft: game.max_players.toString(),
        price: `$${game.price_per_player}`,
        location: formatLocationForUi(game.location),
        image: locationImageMap[game.location] ?? "https://picsum.photos/1200/700",
        fieldName: game.field_name,
        surface: game.surface,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.title}>Pick Up Games</Text>
          <Text style={styles.subtitle}>Choose a day and location</Text>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search game, time, field, or location"
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
            <Pressable
              key={game.id}
              style={styles.card}
              onPress={() => openGameDetails(game)}
            >
              <Image
                source={{
                  uri:
                    locationImageMap[game.location] ??
                    "https://picsum.photos/1200/700",
                }}
                style={styles.cardImage}
              />

              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>{game.format}</Text>
                <Text style={styles.price}>${game.price_per_player}</Text>
              </View>

              <Text style={styles.fieldInfo}>
                {game.field_name} • {game.surface}
              </Text>

              <Text style={styles.cardDateTime}>
                {formatTime(game.start_time)}
             </Text>

              <View style={styles.bottomRow}>
                <Text style={styles.spotsText}>
                  <Text style={styles.spotsNumber}>
                    {game.pickup_game_players?.filter(
                      (player) => player.status === "joined"
                      ).length ?? 0}
                    </Text>
                    {" / "}
                    <Text style={styles.spotsNumber}>
                      {game.max_players}
                  </Text>
                </Text>

                <View style={styles.detailsPill}>
                  <Text style={styles.detailsPillText}>View Details</Text>
                </View>
              </View>
            </Pressable>
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

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
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

  cardImage: {
    width: "100%",
    height: 170,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
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
    fontSize: 25,
    fontFamily: "AfacadBold",
  },

  fieldInfo: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 6,
  },

  cardDateTime: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 25,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  spotsText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontFamily: "Afacad",
  },

  detailsPill: {
    backgroundColor: "#F2DD77",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  detailsPillText: {
    color: "#1337f6",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },

  noGamesText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Afacad",
    textAlign: "center",
    marginTop: 20,
  },

  spotsNumber: {
    color: "#F2DD77",
    fontFamily: "AfacadBold",
    fontSize: 20,
  }
});