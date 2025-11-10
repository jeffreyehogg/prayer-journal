"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-fit"
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}