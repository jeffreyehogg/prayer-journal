import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "./auth-button";
import { Button } from "./ui/button";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-4 items-center font-semibold">
          <Link href={user ? "/protected" : "/"}>Praylio</Link>

          {user && (
            <>
              <Button
                asChild
                variant="link"
                className="p-0 text-sm font-semibold text-muted-foreground"
              >
                <Link href="/protected">Prayer Journal</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="p-0 text-sm font-semibold text-muted-foreground"
              >
                <Link href="/protected/answered">Answered</Link>
              </Button>
            </>
          )}
        </div>

        <AuthButton />
      </div>
    </nav>
  );
}
