import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { saveTeamRegistration } from "../constants/appStorage";

const logoOptions = [
  {
    id: "barca",
    label: "Barca",
    short: "FCB",
    bg: "#A50044",
    accent: "#004D98",
    text: "#ffffff",
  },
  {
    id: "madrid",
    label: "Madrid",
    short: "RMA",
    bg: "#ffffff",
    accent: "#D4AF37",
    text: "#1337f6",
  },
  {
    id: "city",
    label: "City",
    short: "MCI",
    bg: "#6CABDD",
    accent: "#1C2C5B",
    text: "#ffffff",
  },
  {
    id: "juve",
    label: "Juve",
    short: "JUV",
    bg: "#111111",
    accent: "#ffffff",
    text: "#ffffff",
  },
];

export default function TeamRegistrationScreen() {
  const { location } = useLocalSearchParams<{
    location?: string;
  }>();

  const [teamName, setTeamName] = useState("");
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [captainName, setCaptainName] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");

  const handleContinue = async () => {
    if (
      !teamName.trim() ||
      !selectedLogoId ||
      !captainName.trim() ||
      !captainPhone.trim() ||
      !captainEmail.trim()
    ) {
      Alert.alert("Missing Information", "Please complete all required fields.");
      return;
    }

    await saveTeamRegistration({
      location: location || "",
      teamName,
      captainName,
      captainPhone,
      captainEmail,
      selectedLogoId,
    });

    router.push({
      pathname: "/compete-events",
      params: {
        location: location || "",
        teamName,
        captainName,
        selectedLogoId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Team Registration</Text>
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.locationLabel}>Selected Location</Text>
            <Text style={styles.locationValue}>{location}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Team Details</Text>

            <Text style={styles.inputLabel}>Team Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter team name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={teamName}
              onChangeText={setTeamName}
            />

            <Text style={styles.inputLabel}>Choose Team Logo</Text>
            <View style={styles.logoGrid}>
              {logoOptions.map((logo) => {
                const isSelected = selectedLogoId === logo.id;

                return (
                  <Pressable
                    key={logo.id}
                    style={[
                      styles.logoOption,
                      isSelected && styles.logoOptionSelected,
                    ]}
                    onPress={() => setSelectedLogoId(logo.id)}
                  >
                    <View
                      style={[
                        styles.logoBadge,
                        {
                          backgroundColor: logo.bg,
                          borderColor: logo.accent,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.logoBadgeText,
                          { color: logo.text },
                        ]}
                      >
                        {logo.short}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.logoLabel,
                        isSelected && styles.logoLabelSelected,
                      ]}
                    >
                      {logo.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Team Captain Contact</Text>

            <Text style={styles.inputLabel}>Captain Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter captain name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={captainName}
              onChangeText={setCaptainName}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={captainPhone}
              onChangeText={setCaptainPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={captainEmail}
              onChangeText={setCaptainEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1337f6",
  },

  keyboardWrapper: {
    flex: 1,
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

  locationCard: {
    backgroundColor: "#F2DD77",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  locationLabel: {
    color: "#1337f6",
    fontSize: 14,
    fontFamily: "Afacad",
    marginBottom: 4,
  },

  locationValue: {
    color: "#1337f6",
    fontSize: 24,
    fontFamily: "AfacadBold",
  },

  formCard: {
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

  inputLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "AfacadBold",
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 48,
    color: "#ffffff",
    fontFamily: "Afacad",
    marginBottom: 10,
  },

  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  logoOption: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  logoOptionSelected: {
    borderColor: "#F2DD77",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  logoBadgeText: {
    fontSize: 16,
    fontFamily: "AfacadBold",
  },

  logoLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "Afacad",
  },

  logoLabelSelected: {
    fontFamily: "AfacadBold",
  },

  continueButton: {
    backgroundColor: "#F2DD77",
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    color: "#1337f6",
    fontSize: 16,
    fontFamily: "AfacadBold",
  },
});