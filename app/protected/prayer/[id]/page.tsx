import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { type Prayer } from "../../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddNoteForm } from "@/components/AddNoteForm";

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
    .select("id, title, status")
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
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href="/protected">← Back to Journal</Link>
        </Button>
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

      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl">{prayer.title}</h2>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {prayer.status}
        </span>
      </div>

      <AddNoteForm prayerId={prayer.id} />

      {/* List of notes */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-xl">Notes</h3>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2">{note.content}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No notes yet.</p>
        )}
      </div>
    </div>
  );
}
