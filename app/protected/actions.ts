"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Prayer = {
  id: number;
  title: string;
  status: "Pending" | "Praying" | "Answered";
  category: string | null;
};

// UPDATE the prayer status
export async function updatePrayerStatus(id: number, status: Prayer["status"]) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("prayers")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    console.error("Error updating prayer:", error);
    return;
  }

  revalidatePath("/protected");
}

// UPDATE a prayer
export async function updatePrayer(
  id: number,
  title: string,
  category: string | null,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("prayers")
    .update({ title: title, category: category })
    .eq("id", id);

  if (error) {
    console.error("Error updating prayer:", error);
    return { error: error.message };
  }

  // Revalidate all pages that show prayer lists
  revalidatePath("/protected");
  revalidatePath("/protected/answered");
  revalidatePath(`/protected/prayer/${id}`);
}

// DELETE a prayer
export async function deletePrayer(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("prayers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting prayer:", error);
    return;
  }

  revalidatePath("/protected");
}

// ADD a note
export async function addNote(prayerId: number, content: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("notes")
    .insert({
      prayer_id: prayerId,
      content: content,
      user_id: user.id,
    });

  if (error) {
    console.error("Error adding note:", error);
    return { error: error.message };
  }

  revalidatePath(`/protected/prayer/${prayerId}`);
}