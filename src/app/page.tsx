import { getAllDisciplines } from "@/lib/categories";
import { getAllCareers } from "@/lib/careers";
import { HomeClient } from "./home-client";

export default function HomePage() {
  const disciplines = getAllDisciplines();
  const allCareers = getAllCareers();

  return (
    <HomeClient
      disciplines={disciplines}
      careers={allCareers}
    />
  );
}
