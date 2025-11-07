// In app/protected/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";

// We will create this component in the next step
// import { AddPrayerForm } from "@/components/AddPrayerForm";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // Fetch prayers for the logged-in user
  const { data: prayers, error } = await supabase
    .from("prayers")
    .select("id, title, status")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Prayer Journal</h2>
        {/* We will add this component soon */}
        {/* <AddPrayerForm /> */}
      </div>

      <div className="flex flex-col gap-4">
        {prayers && prayers.length > 0 ? (
          prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <span className="text-lg">{prayer.title}</span>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {prayer.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">
            You haven't added any prayers yet. Add one to get started!
          </p>
        )}
      </div>

      {/* We can remove the old tutorial content */}
    </div>
  );
}
