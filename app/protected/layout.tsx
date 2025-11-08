import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-4 items-center font-semibold">
              <Link href={"/protected"}>Praylio</Link>
              <Button
                asChild
                variant="link"
                className="p-0 text-sm font-semibold text-muted-foreground"
              >
                <Link href="/protected">Active Journal</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="p-0 text-sm font-semibold text-muted-foreground"
              >
                <Link href="/protected/answered">Answered</Link>
              </Button>
            </div>
            <AuthButton />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {children}
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>© 2025 Praylio</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
