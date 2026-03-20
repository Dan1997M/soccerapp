import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import {
  addFriend,
  getFriends,
  getRecentPlayers,
  Player,
} from "../../constants/playerStore";

export default function FriendsScreen() {
  const {
    inviteGameTitle,
    inviteGameLocation,
    inviteGameDate,
    inviteGameTime,
  } = useLocalSearchParams<{
    inviteGameTitle?: string;
    inviteGameLocation?: string;
    inviteGameDate?: string;
    inviteGameTime?: string;
  }>();

  const isInviteMode = !!inviteGameTitle;

  const [searchQuery, setSearchQuery] = useState("");
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [myFriends, setMyFriends] = useState<Player[]>([]);

  const refreshLists = useCallback(() => {
    setMyFriends([...getFriends()]);
    setRecentPlayers(getRecentPlayers().filter((player) => !player.added));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshLists();
    }, [refreshLists])
  );

  const filteredRecentPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return recentPlayers.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
    });
  }, [recentPlayers, searchQuery]);

  const handleAddPlayer = (player: Player) => {
    addFriend(player);
    refreshLists();
  };

  const openProfile = (user: Player) => {
    router.push({
      pathname: "/player-profile",
      params: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        date: user.date,
        added: user.added ? "true" : "false",
      },
    });
  };

  const openFriendProfile = (user: Player) => {
    router.push({
      pathname: "/player-profile",
      params: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        date: user.date,
        added: "true",
      },
    });
  };

  const handleInviteFriend = (friend: Player) => {
    Alert.alert(
      "Invite Sent",
      `${friend.name} was invited to ${inviteGameTitle} at ${inviteGameLocation} on ${inviteGameDate} at ${inviteGameTime}.`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
  {isInviteMode && (
    <Pressable style={styles.backButton} onPress={() => router.back()}>
      <Text style={styles.backArrow}>←</Text>
    </Pressable>
  )}

  <Text style={styles.title}>Friends</Text>
</View>

      {isInviteMode && (
        <View style={styles.inviteBanner}>
          <Text style={styles.inviteBannerTitle}>Invite Friends</Text>
          <Text style={styles.inviteBannerText}>
            {inviteGameTitle} • {inviteGameLocation} • {inviteGameDate} •{" "}
            {inviteGameTime}
          </Text>
        </View>
      )}

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="rgba(255,255,255,0.65)"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>My Friends</Text>

      {myFriends.length > 0 ? (
        <View style={styles.friendsListWrapper}>
          {myFriends.map((friend) => (
            <View key={friend.id} style={styles.friendRow}>
              <Pressable
                style={styles.leftSide}
                onPress={() => openFriendProfile(friend)}
              >
                <Image source={{ uri: friend.image }} style={styles.avatar} />

                <View style={styles.textBlock}>
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.username}>{friend.username}</Text>
                </View>
              </Pressable>

              {isInviteMode ? (
                <Pressable
                  style={styles.inviteButton}
                  onPress={() => handleInviteFriend(friend)}
                >
                  <Text style={styles.inviteButtonText}>Invite</Text>
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No friends added yet.</Text>
      )}

      <Text style={styles.sectionTitle}>Recent Players</Text>

      {filteredRecentPlayers.length > 0 ? (
        <View style={styles.listWrapper}>
          {filteredRecentPlayers.map((user) => (
            <View key={user.id} style={styles.userRow}>
              <Pressable
                style={styles.leftSide}
                onPress={() => openProfile(user)}
              >
                <Image source={{ uri: user.image }} style={styles.avatar} />

                <View style={styles.textBlock}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.date}>{user.date}</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.addButton}
                onPress={() => handleAddPlayer(user)}
                hitSlop={8}
              >
                <Text style={styles.addText}>Add</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No recent players right now.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 140,
    backgroundColor: "#1337f6",
    flexGrow: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    textAlign: "center",
    marginBottom: 18,
  },

  inviteBanner: {
    backgroundColor: "#F2DD77",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },

  inviteBannerTitle: {
    color: "#1337f6",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 4,
  },

  inviteBannerText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "Afacad",
  },

  searchWrapper: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  searchInput: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Afacad",
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  friendsListWrapper: {
    gap: 14,
    marginBottom: 22,
  },

  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  listWrapper: {
    gap: 14,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  textBlock: {
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },

  name: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },

  username: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "Afacad",
  },

  date: {
    color: "#F2DD77",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Afacad",
  },

  addButton: {
    backgroundColor: "#F2DD77",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  addText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  inviteButton: {
    backgroundColor: "#F2DD77",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 78,
    alignItems: "center",
    justifyContent: "center",
  },

  inviteButtonText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },

  emptyText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Afacad",
    marginBottom: 22,
  },
  headerRow: {
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 18,
  minHeight: 40,
},

backButton: {
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 10,
  paddingHorizontal: 4,
  paddingVertical: 2,
},

backArrow: {
  fontSize: 28,
  color: "#ffffff",
  fontFamily: "AfacadBold",
},
backArrow: {
  fontSize: 28,
  color: "#ffffff",
  fontFamily: "AfacadBold",
},
});