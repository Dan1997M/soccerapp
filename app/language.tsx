import { setLanguage } from "@/lib/language";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LanguageScreen() {
  const handleSelect = async (lang: "en" | "es") => {
    await setLanguage(lang);
    router.replace("/startup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome / Bienvenido</Text>

      <Pressable style={styles.button} onPress={() => handleSelect("en")}>
        <Text style={styles.buttonText}>English</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => handleSelect("es")}>
        <Text style={styles.buttonText}>Español</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "AfacadBold",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#F2DD77",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },
});