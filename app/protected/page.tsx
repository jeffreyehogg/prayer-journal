import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddPrayerForm } from "@/components/AddPrayerForm";
import { PrayerList } from "@/components/PrayerList";
import { AlertCircle } from "lucide-react";
import { type Prayer } from "./actions";

export default async function ProtectedPage() {
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
    .in("status", ["Pending", "Praying"])
    .order("sort_order", { ascending: true })
    .returns<Prayer[]>();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="font-bold text-2xl">My Prayer Journal</h2>
        <AddPrayerForm />
      </div>

      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
        &quot;Devote yourselves to prayer, being watchful and thankful.&quot;
        <footer className="mt-1 text-sm not-italic font-medium">
          Colossians 4:2
        </footer>
      </blockquote>

      {error && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-md flex gap-4 items-center">
          <AlertCircle />
          <p>
            Sorry, we couldn't fetch your prayers. Please try praying harder!
          </p>
        </div>
      )}

      {!error && prayers && <PrayerList prayers={prayers} />}
    </div>
  );
}
