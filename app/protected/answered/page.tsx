import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrayerList } from "@/components/PrayerList";
import { AlertCircle } from "lucide-react";
import { type Prayer } from "../actions";

export default async function AnsweredPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/auth/login");
  }

  const { data: prayers, error } = await supabase
    .from("prayers")
    .select("id, title, status, category")
    .eq("status", "Answered")
    .order("sort_order", { ascending: true })
    .returns<Prayer[]>();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Answered Prayers</h2>
      </div>

      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
        &quot;Rejoice always, pray continually, give thanks in all
        circumstances; for this is God’s will for you in Christ Jesus.&quot;
        <footer className="mt-1 text-sm not-italic font-medium">
          1 Thessalonians 5:16-18
        </footer>
      </blockquote>

      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-md flex gap-4 items-center">
          <AlertCircle />
          <p>
            Sorry, we couldn't fetch your prayers. Don't stop praying!
          </p>
        </div>
      )}

      {!error && <PrayerList prayers={prayers} emptyMessage="You have no answered prayers yet. Don't stop praying!" />}
    </div>
  );
}
