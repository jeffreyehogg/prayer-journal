"use client";

import { useTransition } from "react";
import { type Note, deleteNote } from "@/app/protected/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditNoteForm } from "./EditNoteForm";

export function NoteList({
  notes,
  prayerId,
}: {
  notes: Note[];
  prayerId: number;
}) {
  const [isPending, startTransition] = useTransition();

  if (notes.length === 0) {
    return <p className="text-muted-foreground">No notes yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-xl">Notes</h3>
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 bg-muted/50 rounded-lg group" // Use muted background
        >
          <div className="flex justify-between items-start">
            <p className="text-sm text-muted-foreground">
              {/* Use a more readable date format */}
              {new Date(note.created_at).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            {/* "More" Menu for Edit/Delete */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  className="-mt-2 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <EditNoteForm note={note} />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    startTransition(() => {
                      deleteNote(note.id, prayerId);
                    });
                  }}
                >
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-2 text-foreground whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      ))}
    </div>
  );
}
