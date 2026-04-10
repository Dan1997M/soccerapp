import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
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
import {
  canBackOutOfGame,
  hasUserJoinedGame,
  leavePickupGame,
} from "../../../lib/pickupGames";

export default function PickupDetailsScreen() {
  const { id, title, date, time, spotsLeft, price, location, image } =
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

  const [hasJoined, setHasJoined] = useState(false);
  const [canBackOut, setCanBackOut] = useState(false);
  const [loadingState, setLoadingState] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadJoinState() {
        try {
          if (!id) return;

          setLoadingState(true);

          const joined = await hasUserJoinedGame(id);
          let backOutAllowed = false;

          if (joined) {
            backOutAllowed = await canBackOutOfGame(id);
          }

          if (isActive) {
            setHasJoined(joined);
            setCanBackOut(backOutAllowed);
          }
        } catch (error) {
          console.log("Error loading join state:", error);
        } finally {
          if (isActive) {
            setLoadingState(false);
          }
        }
      }

      loadJoinState();

      return () => {
        isActive = false;
      };
    }, [id])
  );
  const [joining, setJoining] = useState(false);
  const handleJoin = () => {
    if (remainingSpots <= 0 || joining) return;

    setJoining(true);

    router.push({
      pathname: "/checkout",
      params: {
        id: id || "",
        type: "pickup",
        title: title || "",
        location: location || "",
        date: date || "",
        time: time || "",
        price: price || "",
      },
    });

    
  };

  const handleBackOut = async () => {
    try {
      if (!id) {
        throw new Error("Game ID missing");
      }

      Alert.alert(
        "Back Out?",
        "If you cancel 24 or more hours before the game, you will receive a full refund.",
        [
          { text: "Keep Spot", style: "cancel" },
          {
            text: "Back Out",
            style: "destructive",
            onPress: async () => {
              try {
                const result = await leavePickupGame(id);

                Alert.alert(
                  "Cancelled",
                  result.refundEligible
                    ? "You backed out in time. Your refund is marked as pending."
                    : "You backed out too late for a refund."
                );

                setHasJoined(false);
                setCanBackOut(false);

                router.replace("/(tabs)/pickups");
              } catch (error: any) {
                Alert.alert(
                  "Error",
                  error.message || "Could not back out of game"
                );
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not back out of game");
    }
  };

  const handleInviteInApp = () => {
    router.push({
      pathname: "/friends",
      params: {
        inviteGameTitle: title || "",
        inviteGameLocation: location || "",
        inviteGameDate: date || "",
        inviteGameTime: time || "",
        inviteSpotsLeft: remainingSpots.toString(),
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

  const showJoinButton = !loadingState && !hasJoined && remainingSpots > 0;
  const showBackOutButton = !loadingState && hasJoined && canBackOut;
  const showNoActionButton = !loadingState && hasJoined && !canBackOut;
  const showFullMessage = !loadingState && !hasJoined && remainingSpots <= 0;

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
                : title?.includes("9v9")
                ? "9v9"
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

        {showJoinButton && (
          <Pressable style={styles.joinButton} onPress={handleJoin}>
            <Text style={styles.joinButtonText}>
              {joining ? "Processing..." : "Join Game"}
            </Text>
          </Pressable>
        )}

        {showBackOutButton && (
          <Pressable style={styles.backOutButton} onPress={handleBackOut}>
            <Text style={styles.backOutButtonText}>Back Out?</Text>
          </Pressable>
        )}

        {showNoActionButton && (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedText}>
              This game can no longer be cancelled.
            </Text>
          </View>
        )}

        {showFullMessage && (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedText}>This game is full.</Text>
          </View>
        )}
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

  backOutButton: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F2DD77",
  },

  backOutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },

  lockedCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  lockedText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "AfacadBold",
    textAlign: "center",
  },
});