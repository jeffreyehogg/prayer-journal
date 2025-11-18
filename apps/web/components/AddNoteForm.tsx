"use client";

import { useTransition, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addNote } from "@/app/protected/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AddNoteForm({ prayerId }: { prayerId: number }) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;

    startTransition(async () => {
      const result = await addNote(prayerId, content);

      if (!result?.error) {
        setContent("");
      } else {
        // TODO: Show error to user
        console.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        placeholder="Write an update, note, or thanksgiving..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
        rows={4}
      />
      <Button type="submit" disabled={isPending} className="w-fit self-end">
        {isPending ? "Saving..." : "Save Note"}
      </Button>
    </form>
  );
}
