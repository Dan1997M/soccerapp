import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app_language";

export async function getLanguage() {
  return await AsyncStorage.getItem(LANGUAGE_KEY);
}

export async function setLanguage(lang: "en" | "es") {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
}