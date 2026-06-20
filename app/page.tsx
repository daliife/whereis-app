import { getAllSpaces } from "@/lib/inventory";
import HomePageClient from "@/components/home/HomePageClient";

export default function HomePage() {
  return <HomePageClient spaces={getAllSpaces()} />;
}
