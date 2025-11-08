// In app/protected/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Prayer = {
  id: number;
  title: string;
  status: "Pending" | "Praying" | "Answered";
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

// ADD a journal entry
export async function addJournalEntry(prayerId: number, content: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("journal_entries")
    .insert({
      prayer_id: prayerId,
      content: content,
      user_id: user.id,
    });

  if (error) {
    console.error("Error adding journal entry:", error);
    return { error: error.message };
  }

  revalidatePath(`/protected/prayer/${prayerId}`);
}