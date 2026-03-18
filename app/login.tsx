import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from "react-native-reanimated";

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const isSignup = mode === "signup";

  return (
    <View style={styles.container}>
      <Animated.View style={styles.card} layout={Layout.springify()}>
        <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>

        <Text style={styles.subtitle}>
          {isSignup
            ? "Create your account to get started"
            : "Welcome back, please login to your account"}
        </Text>

        {isSignup && (
          <>
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />
            </Animated.View>

            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />
            </Animated.View>

            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </Animated.View>
          </>
        )}

        <TextInput
          placeholder={isSignup ? "Email" : "User Name"}
          placeholderTextColor="#9AA3B2"
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9AA3B2"
          style={styles.input}
          secureTextEntry
        />

        {isSignup && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#9AA3B2"
              style={styles.input}
              secureTextEntry
            />
          </Animated.View>
        )}

        <View style={styles.shadowWrapper}>
          <Pressable
            style={styles.button}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setMode(isSignup ? "login" : "signup")}
          style={{ marginTop: 12 }}
        >
          <Text style={styles.linkText}>
            {isSignup ? "Already have an account? " : "Don’t have an account? "}
            <Text style={styles.linkBold}>
              {isSignup ? "Login" : "Signup"}
            </Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1337f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    color: "#ffffff",
    marginBottom: 10,
  },
  shadowWrapper: {
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 6,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 18,
    backgroundColor: "#F2DD77",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#0B2AAE",
    fontSize: 16,
    fontWeight: "800",
  },
  linkText: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontSize: 12,
  },
  linkBold: {
    color: "#ffffff",
    fontWeight: "800",
  },
});