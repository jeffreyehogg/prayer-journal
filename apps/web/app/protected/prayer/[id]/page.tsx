import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Prayer } from "@prayer-journal/core";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddNoteForm } from "@/components/AddNoteForm";
import { NoteList } from "@/components/NoteList";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";

export default async function PrayerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const awaitedParams = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }

  // Fetch the prayer
  const { data: prayer, error: prayerError } = await supabase
    .from("prayers")
    .select("id, title, status, category")
    .eq("id", awaitedParams.id)
    .single<Prayer>();

  // Fetch the notes for this prayer
  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("id, created_at, content")
    .eq("prayer_id", awaitedParams.id)
    .order("created_at", { ascending: false });

  if (prayerError || !prayer) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8">
        <BackButton>← Back to Journal</BackButton>
        <p>Prayer not found.</p>
        {prayerError && (
          <pre className="text-sm text-destructive">{prayerError.message}</pre>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <Button asChild variant="outline" size="sm" className="w-fit">
        <Link href="/protected">← Back to Journal</Link>
      </Button>

      <div className="flex flex-wrap items-center gap-4">
        <h2 className="font-bold text-3xl">{prayer.title}</h2>
        <div className="flex gap-2">
          {prayer.category && (
            <Badge variant="outline" className="text-sm">
              {prayer.category}
            </Badge>
          )}
          <Badge
            variant={
              prayer.status === "Answered"
                ? "default"
                : prayer.status === "Praying"
                ? "secondary"
                : "outline"
            }
            className="capitalize text-sm"
          >
            {prayer.status}
          </Badge>
        </div>
      </div>

      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
        &quot;Then the Lord replied: 'Write down the revelation and make it
        plain on tablets...'&quot;
        <footer className="mt-1 text-sm not-italic font-medium">
          Habakkuk 2:2
        </footer>
      </blockquote>

      <AddNoteForm prayerId={prayer.id} />

      {/* List of notes */}
      {notes && <NoteList notes={notes} prayerId={prayer.id} />}
      {notesError && <p className="text-destructive">Error loading notes.</p>}
    </div>
  );
}
