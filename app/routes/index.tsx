import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <h3>Welcome to Scribbles</h3>;
}
