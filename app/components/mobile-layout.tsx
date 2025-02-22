import { Link } from "@tanstack/react-router";
import { LucideHome, LucideNotebook, LucideSettings } from "lucide-react";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <header className="bg-primary text-primary-foreground p-4 text-lg font-bold border-b border">
        <Link to="/">Scribbles</Link>
      </header>
      <main className="overflow-y-auto p-4">{children}</main>
      <nav className="bg-background border-t">
        <ul className="grid grid-cols-4 gap-2 p-2 py-6">
          <li className="flex justify-center">
            <Link to="/">
              <LucideHome size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/notes">
              <LucideNotebook size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/">
              <LucideSettings size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/">
              <LucideSettings size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
