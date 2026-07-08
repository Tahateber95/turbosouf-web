"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/lib/admin-api";
import { CLIENT_API_URL } from "@/lib/api";
import type { ProductDetail, Category, Brand, VehicleMake, VehicleModel, VehicleEngine } from "@/lib/api";

const API = CLIENT_API_URL;

const productSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  sku: z.string().min(1, "SKU requis"),
  shortDescription: z.string().min(1, "Description courte requise"),
  description: z.string().min(1, "Description requise"),
  priceHT: z.coerce.number().min(0, "Prix HT requis"),
  tvaRate: z.coerce.number().min(0).max(100).default(20),
  salePriceHT: z.coerce.number().nullable().optional(),
  depositAmount: z.coerce.number().nullable().optional(),
  categoryId: z.string().min(1, "Catégorie requise"),
  brandId: z.string().nullable().optional(),
  condition: z.string().min(1, "État requis"),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  oemReference: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  b2bPriceHT: z.coerce.number().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  images: z.array(z.object({
    url: z.string().min(1, "URL requise"),
    altText: z.string().nullable().optional(),
    sortOrder: z.coerce.number().default(0),
    isPrimary: z.boolean().default(false),
  })).default([]),
  attributes: z.array(z.object({
    key: z.string().min(1, "Clé requise"),
    value: z.string().min(1, "Valeur requise"),
    sortOrder: z.coerce.number().default(0),
  })).default([]),
  addOns: z.array(z.object({
    name: z.string().min(1, "Nom requis"),
    description: z.string().nullable().optional(),
    priceHT: z.coerce.number().min(0, "Prix requis"),
    tvaRate: z.coerce.number().min(0).max(100).default(20),
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number().default(0),
  })).default([]),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  mode: "create" | "edit";
  product?: ProductDetail;
  categories: Category[];
  brands: Brand[];
  makes: VehicleMake[];
}

export function ProductForm({ mode, product, categories, brands, makes }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Vehicle compatibility state
  const [compatibleEngineIds, setCompatibleEngineIds] = useState<string[]>(
    product?.compatibleVehicles?.map(v => v.vehicleEngineId) || []
  );
  const [compatibleLabels, setCompatibleLabels] = useState<Record<string, string>>(
    Object.fromEntries(
      (product?.compatibleVehicles || []).map(v => [
        v.vehicleEngineId,
        `${v.makeName} ${v.modelName} - ${v.engineName}${v.powerCV ? ` (${v.powerCV}cv)` : ""}`
      ])
    )
  );

  // Vehicle selector state
  const [selMake, setSelMake] = useState("");
  const [selModel, setSelModel] = useState("");
  const [selEngine, setSelEngine] = useState("");
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [engines, setEngines] = useState<VehicleEngine[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingEngines, setLoadingEngines] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description,
      priceHT: product.priceHT,
      tvaRate: product.tvaRate,
      salePriceHT: product.salePriceHT,
      depositAmount: product.depositAmount,
      categoryId: product.categoryId,
      brandId: product.brandId,
      condition: product.condition,
      stockQuantity: product.stockQuantity,
      oemReference: product.oemReference,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      b2bPriceHT: product.b2bPriceHT,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      images: product.images || [],
      attributes: product.attributes || [],
      addOns: (product.addOns || []).map(a => ({
        name: a.name,
        description: a.description,
        priceHT: a.priceHT,
        tvaRate: a.tvaRate,
        isActive: a.isActive,
        sortOrder: a.sortOrder,
      })),
    } : {
      tvaRate: 20,
      condition: "Refurbished",
      isActive: true,
      isFeatured: false,
      stockQuantity: 0,
      images: [],
      attributes: [],
      addOns: [],
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({ control, name: "images" });
  const { fields: attrFields, append: addAttr, remove: removeAttr } = useFieldArray({ control, name: "attributes" });
  const { fields: addOnFields, append: addAddOn, remove: removeAddOn } = useFieldArray({ control, name: "addOns" });

  // Fetch models when make changes
  useEffect(() => {
    setModels([]);
    setEngines([]);
    setSelModel("");
    setSelEngine("");
    if (!selMake) return;
    setLoadingModels(true);
    fetch(`${API}/api/v1/vehicles/makes/${selMake}/models`)
      .then(r => r.json())
      .then(json => setModels(json.data || []))
      .catch(() => setModels([]))
      .finally(() => setLoadingModels(false));
  }, [selMake]);

  // Fetch engines when model changes
  useEffect(() => {
    setEngines([]);
    setSelEngine("");
    if (!selModel) return;
    setLoadingEngines(true);
    fetch(`${API}/api/v1/vehicles/models/${selModel}/engines`)
      .then(r => r.json())
      .then(json => setEngines(json.data || []))
      .catch(() => setEngines([]))
      .finally(() => setLoadingEngines(false));
  }, [selModel]);

  const addVehicleCompatibility = () => {
    if (!selEngine || compatibleEngineIds.includes(selEngine)) return;
    const engine = engines.find(e => e.id === selEngine);
    if (!engine) return;
    setCompatibleEngineIds(prev => [...prev, selEngine]);
    setCompatibleLabels(prev => ({
      ...prev,
      [selEngine]: `${engine.makeName} ${engine.modelName} - ${engine.name}${engine.powerCV ? ` (${engine.powerCV}cv)` : ""}`
    }));
    setSelEngine("");
  };

  const removeVehicleCompatibility = (engineId: string) => {
    setCompatibleEngineIds(prev => prev.filter(id => id !== engineId));
    setCompatibleLabels(prev => {
      const next = { ...prev };
      delete next[engineId];
      return next;
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        salePriceHT: data.salePriceHT || null,
        depositAmount: data.depositAmount || null,
        brandId: data.brandId || null,
        oemReference: data.oemReference || null,
        b2bPriceHT: data.b2bPriceHT || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        compatibleVehicleEngineIds: compatibleEngineIds,
        addOns: data.addOns.map((a, i) => ({ ...a, sortOrder: i })),
      };

      if (mode === "create") {
        await adminCreateProduct(payload);
        toast.success("Produit créé avec succès");
        window.location.href = "/dashboard/produits";
      } else {
        await adminUpdateProduct(product!.id, payload);
        toast.success("Produit mis à jour");
        window.location.href = "/dashboard/produits";
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("Supprimer ce produit ? Cette action est irréversible.")) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(product.id);
      toast.success("Produit supprimé");
      window.location.href = "/dashboard/produits";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <input {...register("name")} placeholder="ex: Turbo Garrett GT1544V" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Référence turbo *</label>
            <input {...register("oemReference")} placeholder="ex: 753420-5005S, K03-0015" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono bg-amber-50/50 border-amber-200 focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            <p className="text-[10px] text-gray-400 mt-1">Numéro de référence du fabricant (Garrett, BorgWarner, etc.)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU interne *</label>
            <input {...register("sku")} placeholder="ex: TS-0042" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
            <p className="text-[10px] text-gray-400 mt-1">Code interne TurboSouf</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description courte *</label>
            <input {...register("shortDescription")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description complète *</label>
            <textarea {...register("description")} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Prix & Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT (€) *</label>
            <input type="number" step="0.01" {...register("priceHT")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
            {errors.priceHT && <p className="text-xs text-red-500 mt-1">{errors.priceHT.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TVA (%)</label>
            <input type="number" step="0.1" {...register("tvaRate")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix promo HT (€)</label>
            <input type="number" step="0.01" {...register("salePriceHT")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consigne (€)</label>
            <input type="number" step="0.01" {...register("depositAmount")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix B2B HT (€)</label>
            <input type="number" step="0.01" {...register("b2bPriceHT")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input type="number" {...register("stockQuantity")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Classification</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select {...register("categoryId")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]">
              <option value="">Sélectionner...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <select {...register("brandId")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]">
              <option value="">Aucune</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État *</label>
            <select {...register("condition")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]">
              <option value="Refurbished">Reconditionné</option>
              <option value="New">Neuf</option>
              <option value="ExchangeStandard">Échange standard</option>
            </select>
          </div>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="rounded border-gray-300 text-[var(--ts-primary-500)]" />
              Actif
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" {...register("isFeatured")} className="rounded border-gray-300 text-[var(--ts-primary-500)]" />
              Mis en avant
            </label>
          </div>
        </div>
      </section>

      {/* Vehicle Compatibility */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Compatibilité véhicules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <select value={selMake} onChange={e => setSelMake(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
            <option value="">Marque...</option>
            {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={selModel} onChange={e => setSelModel(e.target.value)} disabled={!selMake || loadingModels} className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white disabled:opacity-50">
            <option value="">{loadingModels ? "Chargement..." : "Modèle..."}</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={selEngine} onChange={e => setSelEngine(e.target.value)} disabled={!selModel || loadingEngines} className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white disabled:opacity-50">
            <option value="">{loadingEngines ? "Chargement..." : "Motorisation..."}</option>
            {engines.map(e => <option key={e.id} value={e.id}>{e.name}{e.powerCV ? ` (${e.powerCV}cv)` : ""}</option>)}
          </select>
          <button type="button" onClick={addVehicleCompatibility} disabled={!selEngine} className="h-10 flex items-center justify-center gap-1.5 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        {compatibleEngineIds.length > 0 ? (
          <div className="space-y-2">
            {compatibleEngineIds.map(id => (
              <div key={id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                <span className="text-sm text-gray-700">{compatibleLabels[id] || id}</span>
                <button type="button" onClick={() => removeVehicleCompatibility(id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Aucun véhicule compatible ajouté.</p>
        )}
      </section>

      {/* Images */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Images</h2>
          <button type="button" onClick={() => addImage({ url: "", altText: "", sortOrder: imageFields.length, isPrimary: imageFields.length === 0 })} className="text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        {imageFields.length > 0 ? (
          <div className="space-y-3">
            {imageFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <input {...register(`images.${idx}.url`)} placeholder="URL de l'image" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                <input {...register(`images.${idx}.altText`)} placeholder="Texte alt" className="w-40 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                  <input type="checkbox" {...register(`images.${idx}.isPrimary`)} className="rounded border-gray-300 text-[var(--ts-primary-500)]" />
                  Principale
                </label>
                <button type="button" onClick={() => removeImage(idx)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Aucune image.</p>
        )}
      </section>

      {/* Attributes */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Attributs</h2>
          <button type="button" onClick={() => addAttr({ key: "", value: "", sortOrder: attrFields.length })} className="text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        {attrFields.length > 0 ? (
          <div className="space-y-3">
            {attrFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3">
                <input {...register(`attributes.${idx}.key`)} placeholder="Clé (ex: Poids)" className="w-48 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                <input {...register(`attributes.${idx}.value`)} placeholder="Valeur (ex: 5.2 kg)" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
                <button type="button" onClick={() => removeAttr(idx)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Aucun attribut.</p>
        )}
      </section>

      {/* Add-ons */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Options additionnelles</h2>
            <p className="text-xs text-gray-400 mt-0.5">Articles optionnels que le client peut ajouter à sa commande (ex: Kit Joint, Kit Turbo Complet…)</p>
          </div>
          <button
            type="button"
            onClick={() => addAddOn({ name: "", description: "", priceHT: 0, tvaRate: 20, isActive: true, sortOrder: addOnFields.length })}
            className="text-sm text-[var(--ts-primary-500)] hover:underline flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
        {addOnFields.length > 0 ? (
          <div className="space-y-3">
            {addOnFields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 items-start">
                <div className="space-y-2">
                  <input
                    {...register(`addOns.${idx}.name`)}
                    placeholder="Nom de l'option (ex: Kit Joint)"
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                  />
                  {errors.addOns?.[idx]?.name && <p className="text-xs text-red-500">{errors.addOns[idx]?.name?.message}</p>}
                  <input
                    {...register(`addOns.${idx}.description`)}
                    placeholder="Description (optionnel)"
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-gray-500 uppercase">Prix HT (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`addOns.${idx}.priceHT`)}
                    className="w-28 h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                  />
                  {errors.addOns?.[idx]?.priceHT && <p className="text-xs text-red-500">{errors.addOns[idx]?.priceHT?.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-gray-500 uppercase">TVA (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(`addOns.${idx}.tvaRate`)}
                    className="w-20 h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]"
                  />
                </div>
                <div className="flex flex-col items-center gap-1.5 pt-5">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" {...register(`addOns.${idx}.isActive`)} className="rounded border-gray-300 text-[var(--ts-primary-500)]" />
                    Actif
                  </label>
                  <button type="button" onClick={() => removeAddOn(idx)} className="text-red-500 hover:text-red-700 mt-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Aucune option additionnelle.</p>
        )}
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">SEO</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta titre</label>
            <input {...register("metaTitle")} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
            <textarea {...register("metaDescription")} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ts-primary-500)]" />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {mode === "edit" && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="h-10 px-4 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Supprimer
            </button>
          )}
        </div>
        <button type="submit" disabled={saving} className="h-10 px-6 flex items-center gap-2 bg-[var(--ts-primary-500)] hover:bg-[var(--ts-primary-600)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Créer le produit" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
