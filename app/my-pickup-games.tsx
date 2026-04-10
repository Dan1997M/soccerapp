export default function MyPickupGamesScreen() 
import { fetchPickupGames, PickupGame } from "@/lib/pickupGames";
import { supabase } from "@/lib/supabase";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type JoinedDisplayGame = {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  spotsLeft: number;
  priceLabel: string;
  image: string;
  locationLabel: string;
  isPast: boolean;
  sortDateTime: number;
};

function parseLocalDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
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

function getDisplayDayLabel(isoDate: string) {
  const today = new Date();
  const date = parseLocalDate(isoDate);

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const gameOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffMs = gameOnly.getTime() - todayOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function buildGameDateTime(game: PickupGame) {
  const [year, month, day] = game.game_date.split("-").map(Number);
  const [hours, minutes] = game.start_time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes).getTime();
}

export default function MyPickupGamesScreen() {
  const [games, setGames] = useState<JoinedDisplayGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMyGames = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGames([]);
        return;
      }

      const allGames = await fetchPickupGames();

      const joinedGames = allGames
        .filter((game) =>
          game.pickup_game_players?.some(
            (player) =>
              player.user_id === user.id && player.status === "joined"
          )
        )
        .map((game) => {
          const joinedPlayers =
            game.pickup_game_players?.filter(
              (player) => player.status === "joined"
            ) || [];

          const joinedCount = joinedPlayers.length;
          const spotsLeft = Math.max(0, game.max_players - joinedCount);
          const gameDateTime = buildGameDateTime(game);
          const isPast = gameDateTime < Date.now();

          return {
            id: game.id,
            title: `${game.format} • ${game.field_name}`,
            dateLabel: getDisplayDayLabel(game.game_date),
            timeLabel: `${formatTime(game.start_time)} - ${formatTime(
              game.end_time
            )}`,
            spotsLeft,
            priceLabel: `$${game.price_per_player}`,
            image: "https://picsum.photos/1200/700",
            locationLabel: formatLocation(game.location),
            isPast,
            sortDateTime: gameDateTime,
          };
        });

      setGames(joinedGames);
    } catch (error) {
      console.log("Error loading my pickup games:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const run = async () => {
        setLoading(true);
        await loadMyGames();
        if (active) {
          setLoading(false);
        }
      };

      run();

      return () => {
        active = false;
      };
    }, [loadMyGames])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyGames();
    setRefreshing(false);
  };

  const upcomingGames = useMemo(() => {
    return [...games]
      .filter((game) => !game.isPast)
      .sort((a, b) => a.sortDateTime - b.sortDateTime);
  }, [games]);

  const pastGames = useMemo(() => {
    return [...games]
      .filter((game) => game.isPast)
      .sort((a, b) => b.sortDateTime - a.sortDateTime);
  }, [games]);

  const openGame = (game: JoinedDisplayGame) => {
    router.push({
      pathname: "/(tabs)/pickups/[id]",
      params: {
        id: game.id,
        title: game.title,
        date: game.dateLabel,
        time: game.timeLabel,
        spotsLeft: game.spotsLeft.toString(),
        price: game.priceLabel,
        location: game.locationLabel,
        image: game.image,
      },
    });
  };

  const renderGameCard = (game: JoinedDisplayGame, isPast = false) => (
    <Pressable
      key={game.id}
      style={styles.card}
      onPress={() => openGame(game)}
    >
      <Image source={{ uri: game.image }} style={styles.cardImage} />

      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle}>{game.title}</Text>
        <Text style={styles.price}>{game.priceLabel}</Text>
      </View>

      <Text style={styles.cardDateTime}>
        {game.dateLabel} • {game.timeLabel}
      </Text>

      <Text style={styles.cardMeta}>{game.locationLabel}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.spotsText}>
          {isPast ? "Completed game" : `${game.spotsLeft} spots left`}
        </Text>

        <View style={isPast ? styles.pastPill : styles.joinedPill}>
          <Text style={isPast ? styles.pastPillText : styles.joinedPillText}>
            {isPast ? "Past Game" : "Joined"}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>My Pickup Games</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#F2DD77" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Upcoming</Text>

            {upcomingGames.length > 0 ? (
              upcomingGames.map((game) => renderGameCard(game, false))
            ) : (
              <Text style={styles.emptyText}>
                You have no upcoming pickup games.
              </Text>
            )}
          </View>

          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>Past Games</Text>

            {pastGames.length > 0 ? (
              pastGames.map((game) => renderGameCard(game, true))
            ) : (
              <Text style={styles.emptyText}>
                You have no past pickup games yet.
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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

  scroll: {
    flex: 1,
  },

  content: {
    paddingBottom: 120,
  },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionWrapper: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontFamily: "AfacadBold",
    marginBottom: 12,
  },

  emptyText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: "Afacad",
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
    marginBottom: 8,
  },

  cardMeta: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
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

  pastPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  pastPillText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "AfacadBold",
  },
});