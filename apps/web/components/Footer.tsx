import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>© {currentYear} Prayer Journal. All rights reserved.</p>
      <ThemeSwitcher />
    </footer>
  );
}
