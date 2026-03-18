export type LocationKey = "hattrick" | "oakridge" | "patio";

export type Game = {
  id: string;
  location: LocationKey;
  fieldName: string;
  format: string;
  start: string;
  end: string;
  confirmed: number;
  maxPlayers: number;
};

export const GAMES: Game[] = [
  { id: "h1", location: "hattrick", fieldName: "Field 3", format: "7v7", start: "8:00pm", end: "9:00pm", confirmed: 10, maxPlayers: 14 },
  { id: "h2", location: "hattrick", fieldName: "Field 4", format: "5v5", start: "9:00pm", end: "10:00pm", confirmed: 6, maxPlayers: 10 },

  { id: "o1", location: "oakridge", fieldName: "Field 1", format: "7v7", start: "8:00pm", end: "9:00pm", confirmed: 11, maxPlayers: 14 },
  { id: "o2", location: "oakridge", fieldName: "Field 2", format: "9v9", start: "9:00pm", end: "10:00pm", confirmed: 14, maxPlayers: 18 },

  { id: "p1", location: "patio", fieldName: "Field 1", format: "5v5", start: "8:00pm", end: "9:00pm", confirmed: 6, maxPlayers: 10 },
  { id: "p2", location: "patio", fieldName: "Field 2", format: "Futsal", start: "9:00pm", end: "10:00pm", confirmed: 8, maxPlayers: 10 },
];