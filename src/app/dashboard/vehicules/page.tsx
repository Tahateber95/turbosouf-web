import { SERVER_API_URL, type VehicleMake } from "@/lib/api";
import { VehicleMakesClient } from "@/components/dashboard/vehicle-makes-client";

export default async function VehiclesPage() {
  let makes: VehicleMake[] = [];

  try {
    const res = await fetch(`${SERVER_API_URL}/api/v1/vehicles/makes`, { next: { revalidate: 60 } });
    const json = await res.json();
    makes = json.data || [];
  } catch {
    // fallback to empty
  }

  return <VehicleMakesClient initialMakes={makes} />;
}
