import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LucideNotebook, LucideSettings } from "lucide-react";
import { LucideHome } from "lucide-react";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_3.5rem]">
      <header className="bg-white text-primary-foreground p-4 text-lg font-bold border-b border">
        <Link to="/">Scribbles</Link>
      </header>
      <main className="overflow-y-auto p-4">
        <Outlet />
      </main>
      <nav className="bg-background border-t fixed bottom-0 left-0 right-0 bg-white">
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
