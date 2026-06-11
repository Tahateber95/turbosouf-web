import { notFound } from "next/navigation";
import { SERVER_API_URL, type VehicleMake, type VehicleModel } from "@/lib/api";
import { VehicleModelsClient } from "@/components/dashboard/vehicle-models-client";

const API = SERVER_API_URL;

interface Props {
  params: Promise<{ makeId: string }>;
}

export default async function ModelsPage({ params }: Props) {
  const { makeId } = await params;

  let make: VehicleMake | null = null;
  let models: VehicleModel[] = [];

  try {
    const [makesRes, modelsRes] = await Promise.all([
      fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } }).then(r => r.json()),
      fetch(`${API}/api/v1/vehicles/makes/${makeId}/models`, { next: { revalidate: 30 } }).then(r => r.json()),
    ]);
    make = (makesRes.data || []).find((m: VehicleMake) => m.id === makeId) || null;
    models = modelsRes.data || [];
  } catch {
    // fallback
  }

  if (!make) notFound();

  return <VehicleModelsClient make={make} initialModels={models} />;
}
