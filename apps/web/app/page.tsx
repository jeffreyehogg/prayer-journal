import { AuthButton } from "@/components/auth-button";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
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
        <Navbar />

        {/* --- Hero Section --- */}
        <div className="flex-1 flex flex-col gap-12 max-w-2xl p-5 items-center text-center mt-12">
          <h1 className="text-5xl font-bold !leading-tight">
            Your Digital Prayer Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Organize your thoughts, track your journey, and see your prayers
            answered. All in one secure, private space.
          </p>

          <blockquote className="mt-4 p-4 border-l-4 border-border italic text-muted-foreground">
            &quot;Do not be anxious about anything, but in every situation, by
            prayer and petition, with thanksgiving, present your requests to
            God.&quot;
            <footer className="mt-2 text-sm not-italic font-medium">
              Philippians 4:6
            </footer>
          </blockquote>

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
