import { notFound } from "next/navigation";
import { SERVER_API_URL, type VehicleMake, type VehicleModel, type VehicleEngine } from "@/lib/api";
import { VehicleEnginesClient } from "@/components/dashboard/vehicle-engines-client";

const API = SERVER_API_URL;

interface Props {
  params: Promise<{ makeId: string; modelId: string }>;
}

export default async function EnginesPage({ params }: Props) {
  const { makeId, modelId } = await params;

  let make: VehicleMake | null = null;
  let model: VehicleModel | null = null;
  let engines: VehicleEngine[] = [];

  try {
    const [makesRes, modelsRes, enginesRes] = await Promise.all([
      fetch(`${API}/api/v1/vehicles/makes`, { next: { revalidate: 60 } }).then(r => r.json()),
      fetch(`${API}/api/v1/vehicles/makes/${makeId}/models`, { next: { revalidate: 60 } }).then(r => r.json()),
      fetch(`${API}/api/v1/vehicles/models/${modelId}/engines`, { next: { revalidate: 30 } }).then(r => r.json()),
    ]);
    make = (makesRes.data || []).find((m: VehicleMake) => m.id === makeId) || null;
    model = (modelsRes.data || []).find((m: VehicleModel) => m.id === modelId) || null;
    engines = enginesRes.data || [];
  } catch {
    // fallback
  }

  if (!make || !model) notFound();

  return <VehicleEnginesClient make={make} model={model} initialEngines={engines} />;
}
