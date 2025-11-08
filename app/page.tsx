import { AuthButton } from "@/components/auth-button";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* --- Navigation Bar --- */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Praylio</Link>
            </div>
            <AuthButton />
          </div>
        </nav>

        {/* --- Hero Section --- */}
        <div className="flex-1 flex flex-col gap-12 max-w-2xl p-5 items-center text-center mt-12">
          <h1 className="text-5xl font-bold !leading-tight">
            Your Private Digital Prayer Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Organize your thoughts, track your journey, and see your prayers
            answered. All in one secure, private space.
          </p>
          <Button asChild size="lg">
            <Link href={user ? "/protected" : "/auth/login"}>
              {user ? "Go to Your Journal" : "Get Started"}
            </Link>
          </Button>
        </div>

        <Footer />
      </div>
    </main>
  );
}
