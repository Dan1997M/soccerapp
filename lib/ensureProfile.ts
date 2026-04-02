import { supabase } from "@/lib/supabase";

export async function ensureProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.log("Profile fetch error:", fetchError.message);
    return;
  }

  if (existing) return;

  const fullName =
    user.user_metadata?.full_name ||
    [user.user_metadata?.first_name, user.user_metadata?.last_name]
      .filter(Boolean)
      .join(" ") ||
    null;

  const phoneNumber = user.user_metadata?.phone_number ?? null;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: fullName,
    phone_number: phoneNumber,
  });

  if (insertError) {
    console.log("Profile insert error:", insertError.message);
  }
}