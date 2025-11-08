"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Prayer = {
  id: number;
  title: string;
  status: "Pending" | "Praying" | "Answered";
  category: string | null;
};

export type Note = {
  id: number;
  created_at: string;
  content: string;
};

export async function addPrayer(title: string, category: string | null) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  // 1. Find the highest current sort_order for this user
  const { data: maxOrderPrayer, error: maxOrderError } = await supabase
    .from("prayers")
    .select("sort_order")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  if (maxOrderError && maxOrderError.code !== 'PGRST116') {
    console.error("Error fetching max sort_order:", maxOrderError);
    return { error: maxOrderError.message };
  }

  const newSortOrder = (maxOrderPrayer?.sort_order ?? 0) + 1;

  const { error: insertError } = await supabase
    .from("prayers")
    .insert({
      title: title,
      category: category,
      status: "Pending",
      user_id: user.id,
      sort_order: newSortOrder,
    });

  if (insertError) {
    console.error("Error adding prayer:", insertError);
    return { error: insertError.message };
  }

  revalidatePath("/protected");
}

export async function updatePrayerOrder(orderedIds: number[]) {
  const supabase = await createClient();

  // Create an array of update promises
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("prayers")
      .update({ sort_order: index + 1 }) // Use 1-based index for order
      .eq("id", id)
  );

 const results = await Promise.all(updates);

  const firstErrorResult = results.find((result) => result.error);

  if (firstErrorResult && firstErrorResult.error) {
    console.error("Error updating prayer order:", firstErrorResult.error);
    return { error: firstErrorResult.error.message };
  }

  revalidatePath("/protected");
  revalidatePath("/protected/answered");
}

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

  revalidatePath("/protected");
  revalidatePath("/protected/answered");
  revalidatePath(`/protected/prayer/${id}`);
}

export async function deletePrayer(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("prayers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting prayer:", error);
    return;
  }

  revalidatePath("/protected");
}

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

export async function updateNote(noteId: number, content: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .update({ content: content })
    .eq("id", noteId);

  if (error) {
    console.error("Error updating note:", error);
    return { error: error.message };
  }
}

export async function deleteNote(noteId: number, prayerId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Error deleting note:", error);
    return { error: error.message };
  }

  revalidatePath(`/protected/prayer/${prayerId}`);
}