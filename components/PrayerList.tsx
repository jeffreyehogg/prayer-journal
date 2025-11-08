"use client";

import { useTransition } from "react";
import {
  deletePrayer,
  updatePrayerStatus,
  type Prayer,
} from "@/app/protected/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function PrayerList({ prayers }: { prayers: Prayer[] }) {
  const [isPending, startTransition] = useTransition();

  if (prayers.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't added any prayers yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {prayers.map((prayer) => (
        <div
          key={prayer.id}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          {/* Prayer Title */}
          <Link
            href={`/protected/prayer/${prayer.id}`}
            className="text-lg hover:underline"
          >
            {prayer.title}
          </Link>

          {/* Prayer Category */}
          {prayer.category && (
            <Badge variant="outline" className="font-normal">
              {prayer.category}
            </Badge>
          )}

          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPending}>
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
                      updatePrayerStatus(
                        prayer.id,
                        newStatus as Prayer["status"]
                      );
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

            {/* Delete Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
      ))}
    </div>
  );
}
