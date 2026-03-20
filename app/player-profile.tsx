import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { addFriend, isFriend } from "../constants/playerStore";

export default function PlayerProfileScreen() {
  const { id, name, username, image, date, added } = useLocalSearchParams<{
    id?: string;
    name?: string;
    username?: string;
    image?: string;
    date?: string;
    added?: string;
  }>();

  const [friendAdded, setFriendAdded] = useState(
    added === "true" || (username ? isFriend(username) : false)
  );

  const handleAddFriend = () => {
    if (!friendAdded && id && name && username && image && date) {
      addFriend({
        id,
        name,
        username,
        image,
        date,
        added: true,
      });
      setFriendAdded(true);
    }
  };

  const handleMessage = () => {
    router.push({
      pathname: "/chat",
      params: {
        name,
        username,
        image,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Image source={{ uri: image }} style={styles.avatar} />

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.username}>{username}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Last Played</Text>
        <Text style={styles.detailText}>{date}</Text>

        <View style={styles.buttonRow}>
          {friendAdded ? (
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Friend</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryButton} onPress={handleAddFriend}>
              <Text style={styles.primaryButtonText}>Add Friend</Text>
            </Pressable>
          )}

          <Pressable style={styles.secondaryButton} onPress={handleMessage}>
            <Text style={styles.secondaryButtonText}>Message</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    paddingTop: 100,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  backButton: {
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

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 14,
  },

  name: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginBottom: 4,
  },

  username: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "Afacad",
    marginBottom: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 18,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 6,
  },

  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#F2DD77",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },
});