import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const competeData = {
  Hattrick: {
    tournaments: [
      { id: 1, title: "Summer 7v7 Cup", date: "July 12, 2026", fee: "$150 per team" },
      { id: 2, title: "Night Lights Tournament", date: "August 8, 2026", fee: "$180 per team" },
    ],
    leagues: [
      { id: 1, title: "Coed Midweek League", season: "6 weeks", fee: "$500 per team" },
      { id: 2, title: "Sunday Competitive League", season: "8 weeks", fee: "$650 per team" },
    ],
  },
  Patio: {
    tournaments: [
      { id: 1, title: "Friday Night Futsal Tournament", date: "August 2, 2026", fee: "$120 per team" },
    ],
    leagues: [
      { id: 1, title: "Patio Futsal League", season: "5 weeks", fee: "$420 per team" },
    ],
  },
  Oakridge: {
    tournaments: [
      { id: 1, title: "Oakridge Weekend Cup", date: "September 6, 2026", fee: "$160 per team" },
    ],
    leagues: [
      { id: 1, title: "Men’s Sunday League", season: "8 weeks", fee: "$600 per team" },
    ],
  },
};

const logoMap = {
  barca: {
    short: "FCB",
    bg: "#A50044",
    accent: "#004D98",
    text: "#ffffff",
  },
  madrid: {
    short: "RMA",
    bg: "#ffffff",
    accent: "#D4AF37",
    text: "#1337f6",
  },
  city: {
    short: "MCI",
    bg: "#6CABDD",
    accent: "#1C2C5B",
    text: "#ffffff",
  },
  juve: {
    short: "JUV",
    bg: "#111111",
    accent: "#ffffff",
    text: "#ffffff",
  },
};

export default function CompeteEventsScreen() {
  const { location, teamName, captainName, selectedLogoId } = useLocalSearchParams<{
    location?: string;
    teamName?: string;
    captainName?: string;
    selectedLogoId?: string;
  }>();

  const selectedLocation =
    (location as keyof typeof competeData) || "Hattrick";

  const events = competeData[selectedLocation];
  const selectedLogo =
    logoMap[(selectedLogoId as keyof typeof logoMap) || "barca"];

  const handleRegisterTournament = (item: {
    title: string;
    date: string;
    fee: string;
  }) => {
    router.push({
      pathname: "/checkout",
      params: {
        type: "compete",
        title: item.title,
        location: selectedLocation,
        date: item.date,
        field: teamName || "",
        duration: "Tournament Registration",
        time: "Team Entry",
        price: item.fee,
      },
    });
  };

  const handleRegisterLeague = (item: {
    title: string;
    season: string;
    fee: string;
  }) => {
    router.push({
      pathname: "/checkout",
      params: {
        type: "compete",
        title: item.title,
        location: selectedLocation,
        field: teamName || "",
        duration: item.season,
        time: "League Registration",
        price: item.fee,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Available Competitions</Text>
        </View>

        <View style={styles.teamCard}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamLabel}>Registered Team</Text>
            <Text style={styles.teamName}>{teamName}</Text>
            <Text style={styles.teamText}>Captain: {captainName}</Text>
            <Text style={styles.teamText}>Location: {selectedLocation}</Text>
          </View>

          <View
            style={[
              styles.teamLogo,
              {
                backgroundColor: selectedLogo.bg,
                borderColor: selectedLogo.accent,
              },
            ]}
          >
            <Text style={[styles.teamLogoText, { color: selectedLogo.text }]}>
              {selectedLogo.short}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tournaments</Text>
        <View style={styles.sectionWrapper}>
          {events.tournaments.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>Date: {item.date}</Text>
              <Text style={styles.cardText}>Entry Fee: {item.fee}</Text>

              <Pressable
                style={styles.button}
                onPress={() => handleRegisterTournament(item)}
              >
                <Text style={styles.buttonText}>Register Tournament</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Leagues</Text>
        <View style={styles.sectionWrapper}>
          {events.leagues.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardText}>Season: {item.season}</Text>
              <Text style={styles.cardText}>Team Fee: {item.fee}</Text>

              <Pressable
                style={styles.button}
                onPress={() => handleRegisterLeague(item)}
              >
                <Text style={styles.buttonText}>Register League</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1337f6",
  },

  container: {
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

  teamCard: {
    backgroundColor: "#F2DD77",
    borderRadius: 24,
    padding: 18,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamInfo: {
    flex: 1,
    paddingRight: 12,
  },

  teamLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  teamLogoText: {
    fontSize: 18,
    fontFamily: "AfacadBold",
  },

  teamLabel: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 4,
  },

  teamName: {
    color: "#1337f6",
    fontSize: 24,
    fontFamily: "AfacadBold",
    marginBottom: 6,
  },

  teamText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 4,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 14,
  },

  sectionWrapper: {
    gap: 14,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 24,
    padding: 18,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "AfacadBold",
    marginBottom: 10,
  },

  cardText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 6,
  },

  button: {
    backgroundColor: "#F2DD77",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  buttonText: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "AfacadBold",
  },
});