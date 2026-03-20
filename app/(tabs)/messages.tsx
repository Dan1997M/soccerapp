import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getFriends,
  getLastMessage,
  isChatRead,
  Player,
} from "../../constants/playerStore";

type ChatPreview = Player & {
  lastMessage: string;
  time: string;
  unread: number;
};

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<ChatPreview[]>([]);

  const refreshChats = useCallback(() => {
    const friends = getFriends();

    const chatList: ChatPreview[] = friends.map((friend, index) => ({
      ...friend,
      lastMessage: getLastMessage(friend.username),
      time:
        index === 0
          ? "6:42 PM"
          : index === 1
          ? "5:18 PM"
          : "Yesterday",
      unread: isChatRead(friend.username)
        ? 0
        : index === 0
        ? 2
        : index === 2
        ? 1
        : 0,
    }));

    setChats(chatList);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshChats();
    }, [refreshChats])
  );

  const filteredChats = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return chats.filter((chat) => {
      return (
        chat.name.toLowerCase().includes(query) ||
        chat.username.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Messages</Text>

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search messages"
          placeholderTextColor="rgba(255,255,255,0.65)"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredChats.length > 0 ? (
        <View style={styles.listWrapper}>
          {filteredChats.map((chat) => (
            <Pressable
              key={chat.id}
              style={styles.chatRow}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: {
                    name: chat.name,
                    username: chat.username,
                    image: chat.image,
                  },
                })
              }
            >
              <Image source={{ uri: chat.image }} style={styles.avatar} />

              <View style={styles.chatTextBlock}>
                <Text style={styles.name}>{chat.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>

              <View style={styles.rightSide}>
                <Text style={styles.time}>{chat.time}</Text>

                {chat.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          No chats yet. Add friends to start messaging.
        </Text>
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

  listWrapper: {
    gap: 14,
  },

  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  chatTextBlock: {
    flex: 1,
    marginRight: 10,
  },

  name: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "AfacadBold",
    marginBottom: 2,
  },

  lastMessage: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontFamily: "Afacad",
  },

  rightSide: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 44,
  },

  time: {
    color: "#F2DD77",
    fontSize: 12,
    fontFamily: "Afacad",
    marginBottom: 6,
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F2DD77",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  unreadText: {
    color: "#1337f6",
    fontSize: 12,
    fontFamily: "AfacadBold",
  },

  emptyText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontFamily: "Afacad",
    textAlign: "center",
    marginTop: 20,
  },
});