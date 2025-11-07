"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function AddPrayerForm() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    const supabase = createClient();
    setIsLoading(true);

    const { error } = await supabase
      .from("prayers")
      .insert({ title: title, status: "Pending" });

    if (!error) {
      setTitle("");
      router.refresh();
    } else {
      console.error("Error adding prayer:", error.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Pray for..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Prayer"}
      </Button>
    </form>
  );
}
