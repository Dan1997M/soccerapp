import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PickupDetailsScreen() {
  const { title, date, time, spotsLeft, price, location, image } =
    useLocalSearchParams<{
      id?: string;
      title?: string;
      date?: string;
      time?: string;
      spotsLeft?: string;
      price?: string;
      location?: string;
      image?: string;
    }>();

  const remainingSpots = Number(spotsLeft || 0);

  const handleJoin = () => {
    if (remainingSpots <= 0) return;

    router.push({
      pathname: "/checkout",
      params: {
        type: "pickup",
        title: title || "",
        location: location || "",
        date: date || "",
        time: time || "",
        price: price || "",
      },
    });
  };

  const handleInviteInApp = () => {
    router.push({
      pathname: "/friends",
      params: {
        inviteGameTitle: title || "",
        inviteGameLocation: location || "",
        inviteGameDate: date || "",
        inviteGameTime: time || "",
      },
    });
  };

  const handleTextInvite = async () => {
    const message = `Join me for ${title} at ${location} on ${date} at ${time}.`;
    const url =
      Platform.OS === "ios"
        ? `sms:&body=${encodeURIComponent(message)}`
        : `sms:?body=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Game Details</Text>
        </View>

        <Image
          source={{ uri: image || "https://picsum.photos/1200/700" }}
          style={styles.fieldImage}
        />

        <View style={styles.heroCard}>
          <Text style={styles.gameTitle}>{title}</Text>
          <Text style={styles.gameSubtitle}>{location}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Game Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Price</Text>
            <Text style={styles.infoValue}>{price}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Spots Left</Text>
            <Text style={styles.infoValue}>
              {remainingSpots} {remainingSpots === 1 ? "spot" : "spots"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Format</Text>
            <Text style={styles.infoValue}>
              {title?.includes("5v5")
                ? "5v5"
                : title?.includes("7v7")
                ? "7v7"
                : "Open Play"}
            </Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About This Game</Text>
          <Text style={styles.aboutText}>
            Competitive but friendly pickup game. Arrive 15 minutes early, bring
            the right shoes, and be ready to play. Teams are balanced when
            possible and spots are first come, first served.
          </Text>
        </View>

        <View style={styles.inviteRow}>
          <Pressable style={styles.secondaryButton} onPress={handleInviteInApp}>
            <Text style={styles.secondaryButtonText}>Invite Friend</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={handleTextInvite}>
            <Text style={styles.secondaryButtonText}>Send via Text</Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.joinButton,
            remainingSpots === 0 && styles.fullButton,
          ]}
          onPress={handleJoin}
          disabled={remainingSpots === 0}
        >
          <Text
            style={[
              styles.joinButtonText,
              remainingSpots === 0 && styles.fullButtonText,
            ]}
          >
            {remainingSpots === 0 ? "Full" : "Join Game"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1337f6",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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

  fieldImage: {
    width: "100%",
    height: 220,
    borderRadius: 24,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  heroCard: {
    backgroundColor: "#F2DD77",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },

  gameTitle: {
    color: "#1337f6",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginBottom: 4,
  },

  gameSubtitle: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "Afacad",
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  aboutCard: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "Afacad",
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "AfacadBold",
  },

  aboutText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    fontFamily: "Afacad",
    lineHeight: 22,
  },

  inviteRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "AfacadBold",
  },

  joinButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  joinButtonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },

  fullButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  fullButtonText: {
    color: "rgba(255,255,255,0.7)",
  },
});