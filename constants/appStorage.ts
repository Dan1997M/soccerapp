import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUserSession = {
  isLoggedIn: boolean;
  mode: "login" | "signup";
};

export type StoredTeamRegistration = {
  location: string;
  teamName: string;
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  selectedLogoId: string;
};

const USER_SESSION_KEY = "th3_user_session";
const TEAM_REGISTRATION_KEY = "th3_team_registration";

export async function saveUserSession(session: StoredUserSession) {
  await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

export async function getUserSession(): Promise<StoredUserSession | null> {
  const value = await AsyncStorage.getItem(USER_SESSION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUserSession;
  } catch {
    return null;
  }
}

export async function clearUserSession() {
  await AsyncStorage.removeItem(USER_SESSION_KEY);
}

export async function saveTeamRegistration(team: StoredTeamRegistration) {
  await AsyncStorage.setItem(TEAM_REGISTRATION_KEY, JSON.stringify(team));
}

export async function getTeamRegistration(): Promise<StoredTeamRegistration | null> {
  const value = await AsyncStorage.getItem(TEAM_REGISTRATION_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as StoredTeamRegistration;
  } catch {
    return null;
  }
}

export async function clearTeamRegistration() {
  await AsyncStorage.removeItem(TEAM_REGISTRATION_KEY);
}