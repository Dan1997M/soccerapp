import { fetchPickupGames, PickupGame } from "@/lib/pickupGames";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const locations = ["Hattrick", "Patio", "Oakridge"];

type DayChip = {
  label: string;
  date: string;
  isoDate: string;
};

type DisplayGame = {
  id: string;
  title: string;
  date: string;
  displayDayLabel: string;
  time: string;
  spotsLeft: number;
  price: string;
  image: string;
  joined: boolean;
  location: string;
  sortDateTime: number;
};

function formatLocalISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNext8Days(): DayChip[] {
  const today = new Date();

  return Array.from({ length: 8 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const label =
      index === 0
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" });

    return {
      label,
      date: String(date.getDate()),
      isoDate: formatLocalISODate(date),
    };
  });
}

function formatLocation(location: string) {
  return location.charAt(0).toUpperCase() + location.slice(1);
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hourNum = Number(hours);
  const suffix = hourNum >= 12 ? "PM" : "AM";
  const twelveHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${twelveHour}:${minutes} ${suffix}`;
}

function buildGameDateTime(game: PickupGame) {
  const [year, month, day] = game.game_date.split("-").map(Number);
  const [hours, minutes] = game.start_time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes).getTime();
}

function getDisplayLabelFromDays(gameDate: string, days: DayChip[]) {
  const matchingDay = days.find((day) => day.isoDate === gameDate);

  if (matchingDay) {
    return matchingDay.label;
  }

  const [year, month, day] = gameDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function PickupsScreen() {
  const days = useMemo(() => getNext8Days(), []);
  const [selectedDay, setSelectedDay] = useState(days[0].label);
  const [selectedLocation, setSelectedLocation] = useState("Hattrick");
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<PickupGame[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const selectedDayObj = useMemo(() => {
    return days.find((day) => day.label === selectedDay) ?? days[0];
  }, [days, selectedDay]);

  const loadGames = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id ?? null);

      const data = await fetchPickupGames(selectedLocation.toLowerCase());
      setGames(data);
    } catch (error) {
      console.log("Error fetching pickup games:", error);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await loadGames();
      setLoading(false);
    };

    run();
  }, [selectedLocation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const mappedGames = useMemo<DisplayGame[]>(() => {
    return games.map((game) => {
      const joinedPlayers =
        game.pickup_game_players?.filter(
          (player) => player.status === "joined"
        ) || [];

      const joinedCount = joinedPlayers.length;
      const spotsLeft = Math.max(0, game.max_players - joinedCount);
      const hasJoined = !!joinedPlayers.find(
        (player) => player.user_id === userId
      );

      return {
        id: game.id,
        title: `${game.format} • ${game.field_name}`,
        date: game.game_date,
        displayDayLabel: getDisplayLabelFromDays(game.game_date, days),
        time: `${formatTime(game.start_time)} - ${formatTime(game.end_time)}`,
        spotsLeft,
        price: `$${game.price_per_player}`,
        image: "https://picsum.photos/1200/700",
        joined: hasJoined,
        location: formatLocation(game.location),
        sortDateTime: buildGameDateTime(game),
      };
    });
  }, [games, userId, days]);

  const filteredGames = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mappedGames
      .filter((game) => {
        const matchesDay = game.date === selectedDayObj.isoDate;

        const matchesSearch =
          query.length === 0 ||
          game.title.toLowerCase().includes(query) ||
          game.time.toLowerCase().includes(query) ||
          game.location.toLowerCase().includes(query);

        return matchesDay && matchesSearch;
      })
      .sort((a, b) => a.sortDateTime - b.sortDateTime);
  }, [mappedGames, searchQuery, selectedDayObj]);

  const myGames = useMemo(() => {
    return filteredGames.filter((game) => game.joined);
  }, [filteredGames]);

  const availableGames = useMemo(() => {
    return filteredGames.filter((game) => !game.joined);
  }, [filteredGames]);

  const openGameDetails = (game: DisplayGame) => {
    router.push({
      pathname: "/(tabs)/pickups/[id]",
      params: {
        id: game.id,
        title: game.title,
        date: game.displayDayLabel,
        time: game.time,
        spotsLeft: game.spotsLeft.toString(),
        price: game.price,
        location: game.location,
        image: game.image,
      },
    });
  };

  const renderGameCard = (game: DisplayGame, isMyGame = false) => (
    <Pressable
      key={game.id}
      style={styles.card}
      onPress={() => openGameDetails(game)}
    >
      <Image source={{ uri: game.image }} style={styles.cardImage} />

      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle}>{game.title}</Text>
        <Text style={styles.price}>{game.price}</Text>
      </View>

      <Text style={styles.cardDateTime}>
        {game.displayDayLabel} • {game.time}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.spotsText}>
          {game.spotsLeft} {game.spotsLeft === 1 ? "spot" : "spots"} left
        </Text>

        <View style={isMyGame ? styles.joinedPill : styles.detailsPill}>
          <Text
            style={isMyGame ? styles.joinedPillText : styles.detailsPillText}
          >
            {isMyGame ? "Joined" : "View Details"}
          </Text>
        </View>
      </View>
    </Pressable>
  );

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
              key={day.isoDate}
              style={
                day.label === selectedDay ? styles.dayChipActive : styles.dayChip
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

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#F2DD77" />
        </View>
      ) : (
        <ScrollView
          style={styles.cardsScroll}
          contentContainerStyle={styles.cardsWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {myGames.length > 0 && (
            <View style={styles.sectionWrapper}>
              <Text style={styles.sectionTitle}>My Games</Text>
              {myGames.map((game) => renderGameCard(game, true))}
            </View>
          )}

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Available Games</Text>

            {availableGames.length > 0 ? (
              availableGames.map((game) => renderGameCard(game))
            ) : (
              <Text style={styles.noGamesText}>
                No available games for this day at {selectedLocation}.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
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

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionWrapper: {
    marginBottom: 8,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "AfacadBold",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
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

  joinedPill: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F2DD77",
  },

  joinedPillText: {
    color: "#F2DD77",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },

  noGamesText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Afacad",
    textAlign: "center",
    marginTop: 6,
  },
});