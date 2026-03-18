import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { GAMES } from "../../../constants/mockGames";
import GameCard from "../../components/GameCard";

export default function PickupsPatio() {
  const games = GAMES.filter((g) => g.location === "patio");

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>th3hattrick</Text>

      <View style={styles.locationRow}>
        <Pressable onPress={() => router.push("/(tabs)/pickups/oakridge")}>
          <Text style={styles.arrow}>‹</Text>
        </Pressable>
        <Text style={styles.location}>Patio</Text>
      </View>

      <FlatList
        style={{ marginTop: 18 }}
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={() => router.push(`/(tabs)/pickups/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary, paddingTop: 50, paddingHorizontal: 16 },
  logo: { color: Colors.white, textAlign: "center", fontWeight: "800", fontSize: 22, marginBottom: 10 },
  locationRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14, marginTop: 8 },
  location: { color: Colors.white, fontSize: 20, fontWeight: "800", textDecorationLine: "underline" },
  arrow: { color: "rgba(255,255,255,0.6)", fontSize: 28, paddingHorizontal: 8 },
});