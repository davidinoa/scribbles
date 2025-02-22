import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Home,
});

function Home() {
  return <h3>Welcome to Scribbles</h3>;
}
