import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StartupScreen() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Text style={styles.letters}>th</Text>
        <Text style={styles.bigThree}>3</Text>
        <Text style={styles.letters}>hattrick</Text>
      </View>

      {/* Button with bottom shadow */}
      <View style={styles.shadowWrapper}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 60,
  },

  letters: {
    fontFamily: "AfacadBold",
    fontSize: 72,
    color: "#ffffff",
    marginBottom: 14, // raises letters slightly
  },

  bigThree: {
    fontFamily: "AfacadBold",
    fontSize: 110,
    color: "#ffffff",
    marginHorizontal: 2,
    transform: [{ translateY: 10 }], // pushes 3 slightly down
  },

  shadowWrapper: {
    width: "70%", 
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 }, // shadow only downward
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12, // Android shadow
  },

  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#F2DD77",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#0B2AAE",
    fontSize: 18,
    fontWeight: "700",
  },
});