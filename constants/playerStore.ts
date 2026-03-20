export type Player = {
  id: string;
  name: string;
  username: string;
  image: string;
  date: string;
  added?: boolean;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "them";
};

const recentPlayers: Player[] = [
  {
    id: "1",
    name: "Leo Messi",
    username: "@leomessi",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    date: "Played on March 18",
    added: false,
  },
  {
    id: "2",
    name: "Cristiano Ronaldo",
    username: "@cristiano",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "Played on March 17",
    added: false,
  },
  {
    id: "3",
    name: "Neymar Jr",
    username: "@neymarjr",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    date: "Played on March 16",
    added: false,
  },
  {
    id: "4",
    name: "Luis Suarez",
    username: "@luissuarez",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    date: "Played on March 15",
    added: false,
  },
];

let friends: Player[] = [];
let readChats: string[] = [];

let conversations: Record<string, ChatMessage[]> = {
  "@leomessi": [
    { id: "1", text: "Yo, are you playing tonight?", sender: "them" },
    { id: "2", text: "Yeah, I’m down. What time?", sender: "me" },
    { id: "3", text: "Probably around 8 at Hattrick.", sender: "them" },
  ],
  "@cristiano": [
    { id: "1", text: "You going to the field later?", sender: "them" },
    { id: "2", text: "Yeah, I’ll be there at 8.", sender: "me" },
  ],
  "@neymarjr": [
    { id: "1", text: "Which field did you book?", sender: "them" },
  ],
  "@luissuarez": [
    { id: "1", text: "Good game bro 🔥", sender: "them" },
  ],
};

export function getRecentPlayers() {
  return recentPlayers;
}

export function getFriends() {
  return friends;
}

export function isFriend(username: string) {
  return friends.some((player) => player.username === username);
}

export function addFriend(player: Player) {
  const alreadyFriend = friends.some((p) => p.username === player.username);

  if (!alreadyFriend) {
    friends.push({ ...player, added: true });
  }

  const recentPlayer = recentPlayers.find((p) => p.username === player.username);
  if (recentPlayer) {
    recentPlayer.added = true;
  }

  if (!conversations[player.username]) {
    conversations[player.username] = [];
  }
}

export function markChatAsRead(username: string) {
  if (!readChats.includes(username)) {
    readChats.push(username);
  }
}

export function isChatRead(username: string) {
  return readChats.includes(username);
}

export function markChatAsUnread(username: string) {
  readChats = readChats.filter((item) => item !== username);
}

export function getConversation(username: string) {
  return conversations[username] || [];
}

export function sendMessage(username: string, text: string) {
  if (!conversations[username]) {
    conversations[username] = [];
  }

  conversations[username].push({
    id: Date.now().toString(),
    text,
    sender: "me",
  });
}

export function getLastMessage(username: string) {
  const conversation = conversations[username] || [];
  return conversation.length > 0
    ? conversation[conversation.length - 1].text
    : "Start a conversation";
}