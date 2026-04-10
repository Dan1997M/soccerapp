import { supabase } from "@/lib/supabase";

export type Rental = {
  id: string;
  user_id: string;
  location: string;
  rental_date: string;
  field_name: string;
  field_type: string;
  start_time: string;
  duration: string;
  price: string;
  status: string;
  created_at: string;
};

export async function createRental(input: {
  location: string;
  rental_date: string;
  field_name: string;
  field_type: string;
  start_time: string;
  duration: string;
  price: string;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in.");

  const { data, error } = await supabase
    .from("rentals")
    .insert({
      user_id: user.id,
      location: input.location,
      rental_date: input.rental_date,
      field_name: input.field_name,
      field_type: input.field_type,
      start_time: input.start_time,
      duration: input.duration,
      price: input.price,
      status: "booked",
    })
    .select()
    .single();

  if (error) throw error;

  return data as Rental;
}

export async function fetchMyRentals() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return [];

  const { data, error } = await supabase
    .from("rentals")
    .select("*")
    .eq("user_id", user.id)
    .order("rental_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as Rental[];
}

export async function cancelRental(rentalId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in.");

  const { data, error } = await supabase
    .from("rentals")
    .update({ status: "cancelled" })
    .eq("id", rentalId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data as Rental;
}