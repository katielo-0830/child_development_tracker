import type { Route } from "./+types/home";
import { Therapists } from "../components/therapists"; // Adjust path if necessary
import { Dashboard } from "../components/dashboard"; // Adjust path if necessary

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Therapists - Child Development Tracker" }, // Updated title
    { name: "description", content: "View and manage therapists." }, // Updated description
  ];
}

export default function Home() {
  return <Dashboard />;
}
