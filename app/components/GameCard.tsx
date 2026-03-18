import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";
import type { Game } from "../../constants/mockGames";

export default function GameCard({ game, onPress }: { game: Game; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.field}>{game.fieldName}</Text>
        <Text style={styles.format}>{game.format}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.time}>
          {game.start} - {game.end}
        </Text>
        <Text style={styles.count}>
          {game.confirmed}/{game.maxPlayers} Confirmed
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  field: { color: Colors.white, fontSize: 14, fontWeight: "800" },
  format: { color: Colors.white, fontSize: 12, opacity: 0.9, marginTop: 4 },
  time: { color: Colors.white, fontSize: 12, fontWeight: "700" },
  count: { color: Colors.white, fontSize: 11, opacity: 0.85, marginTop: 6 },
});