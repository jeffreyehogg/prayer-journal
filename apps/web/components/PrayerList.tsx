"use client";

import { useState, useTransition, useEffect } from "react";
import {
  deletePrayer,
  updatePrayerStatus,
  updatePrayerOrder,
} from "@/app/protected/actions";
import { type Prayer } from "@prayer-journal/core";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, GripVertical } from "lucide-react";
import { EditPrayerForm } from "./EditPrayerForm";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortablePrayerItem({ prayer }: { prayer: Prayer }) {
  const [isPending, startTransition] = useTransition();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: prayer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-md flex justify-between items-center gap-4 bg-background"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground/50" />
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/protected/prayer/${prayer.id}`}
            className="text-lg font-medium hover:underline"
          >
            {prayer.title}
          </Link>
          {prayer.category && (
            <Badge variant="secondary" className="font-normal">
              {prayer.category}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              className="px-2"
            >
              <Badge
                variant={
                  prayer.status === "Answered"
                    ? "default"
                    : prayer.status === "Praying"
                    ? "secondary"
                    : "outline"
                }
                className="capitalize"
              >
                {prayer.status}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={prayer.status}
              onValueChange={(newStatus) => {
                startTransition(() => {
                  updatePrayerStatus(prayer.id, newStatus as Prayer["status"]);
                });
              }}
            >
              <DropdownMenuRadioItem value="Pending">
                Pending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Praying">
                Praying
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Answered">
                Answered
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <EditPrayerForm prayer={prayer} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                startTransition(() => {
                  deletePrayer(prayer.id);
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function PrayerList({
  prayers: initialPrayers,
  emptyMessage,
}: {
  prayers: Prayer[];
  emptyMessage?: string;
}) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPrayers(initialPrayers);
  }, [initialPrayers]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = prayers.findIndex((item) => item.id === active.id);
      const newIndex = prayers.findIndex((item) => item.id === over.id);
      const newArray = arrayMove(prayers, oldIndex, newIndex);
      setPrayers(newArray);
      const orderedIds = newArray.map((item) => item.id);
      startTransition(async () => {
        await updatePrayerOrder(orderedIds);
      });
    }
  }

  if (prayers.length === 0) {
    return (
      <p className="text-muted-foreground">
        {emptyMessage ||
          "You haven't added any prayers yet. Add one to get started!"}
      </p>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={prayers} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {prayers.map((prayer) => (
            <SortablePrayerItem key={prayer.id} prayer={prayer} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
