import { supabase } from "@/lib/supabase";

export type PickupGame = {
  id: string;
  location: "hattrick" | "patio" | "oakridge";
  format: "5v5" | "7v7" | "9v9";
  field_name: string;
  surface: "turf" | "futsal" | "grass";
  game_date: string;
  start_time: string;
  end_time: string;
  price_per_player: number;
  max_players: number;
  created_at: string;
  pickup_game_players?: {
    id: string;
    user_id: string;
    status: "joined" | "cancelled";
  }[];
};

export async function fetchPickupGames(location?: string) {
  let query = supabase
    .from("pickup_games")
    .select(`
      id,
      location,
      format,
      field_name,
      surface,
      game_date,
      start_time,
      end_time,
      price_per_player,
      max_players,
      created_at,
      pickup_game_players (
        id,
        user_id,
        status
      )
    `)
    .order("game_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (location) {
    query = query.eq("location", location);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as PickupGame[];
}

export async function joinPickupGame(gameId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in to join a game.");
  }

  const { data: game, error: gameError } = await supabase
    .from("pickup_games")
    .select("price_per_player")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    throw new Error("Game not found.");
  }

  const { data: existingRow, error: existingError } = await supabase
    .from("pickup_game_players")
    .select("id, status")
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingRow) {
    const { error: updateError } = await supabase
      .from("pickup_game_players")
      .update({
        status: "joined",
        paid: true,
        payment_amount: game.price_per_player,
        refund_status: "none",
        cancelled_at: null,
      })
      .eq("game_id", gameId)
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return;
  }

  const { error: insertError } = await supabase
    .from("pickup_game_players")
    .insert({
      game_id: gameId,
      user_id: user.id,
      status: "joined",
      paid: true,
      payment_amount: game.price_per_player,
      refund_status: "none",
    });

  if (insertError) {
    throw insertError;
  }
}

export async function leavePickupGame(gameId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("User not logged in");
  }

  const { data: game, error: gameError } = await supabase
    .from("pickup_games")
    .select("game_date, start_time")
    .eq("id", gameId)
    .single();

  if (gameError || !game) {
    throw new Error("Game not found");
  }

  const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
  const now = new Date();

  const diffInMs = gameDateTime.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  const isEligibleForRefund = diffInHours >= 24;
  const refundStatus = isEligibleForRefund ? "pending" : "not_eligible";

  const { data, error: updateError } = await supabase
    .from("pickup_game_players")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      refund_status: refundStatus,
    })
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "joined")
    .select();

  if (updateError) {
    throw updateError;
  }

  if (!data || data.length === 0) {
    throw new Error("No joined booking was updated");
  }

  return {
    success: true,
    refundEligible: isEligibleForRefund,
  };
}

export async function hasUserJoinedGame(gameId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("pickup_game_players")
    .select("id, status")
    .eq("game_id", gameId)
    .eq("user_id", user.id)
    .eq("status", "joined")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function canBackOutOfGame(gameId: string) {
  const { data: game, error } = await supabase
    .from("pickup_games")
    .select("game_date, start_time")
    .eq("id", gameId)
    .single();

  if (error || !game) {
    throw new Error("Game not found");
  }

  const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
  const now = new Date();

  const diffInMs = gameDateTime.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours >= 24;
}