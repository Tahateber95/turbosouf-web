/**
 * Category-aware product illustrations.
 * Renders a rich SVG placeholder when no product image is available,
 * with the part type visually recognizable + brand/SKU info overlaid.
 */

interface ProductIllustrationProps {
  categoryName?: string | null;
  brandName?: string | null;
  sku?: string;
  condition?: string;
  size?: "sm" | "md" | "lg";
}

const CATEGORY_CONFIG: Record<string, { gradient: string; label: string; icon: React.ReactNode }> = {
  turbocompresseurs: {
    gradient: "from-blue-600/90 via-blue-500/80 to-cyan-400/70",
    label: "TURBO",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        {/* Turbo housing */}
        <circle cx="60" cy="60" r="44" stroke="white" strokeWidth="2" opacity="0.3" />
        <circle cx="60" cy="60" r="32" stroke="white" strokeWidth="1.5" opacity="0.2" />
        {/* Compressor wheel blades */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="60"
            y1="60"
            x2={60 + 28 * Math.cos((angle * Math.PI) / 180)}
            y2={60 + 28 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="2.5"
            opacity="0.4"
            strokeLinecap="round"
          />
        ))}
        {/* Center hub */}
        <circle cx="60" cy="60" r="10" fill="white" opacity="0.25" />
        <circle cx="60" cy="60" r="5" fill="white" opacity="0.4" />
        {/* Inlet pipe */}
        <path d="M10 55 Q25 55 30 60 Q25 65 10 65" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
        {/* Outlet pipe */}
        <path d="M110 55 Q95 55 90 60 Q95 65 110 65" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
        {/* Spin lines */}
        <path d="M42 42 Q60 50 78 42" stroke="white" strokeWidth="1" opacity="0.15" fill="none" />
        <path d="M42 78 Q60 70 78 78" stroke="white" strokeWidth="1" opacity="0.15" fill="none" />
      </svg>
    ),
  },
  injecteurs: {
    gradient: "from-emerald-600/90 via-emerald-500/80 to-teal-400/70",
    label: "INJECTEUR",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        {/* Injector body */}
        <rect x="50" y="15" width="20" height="60" rx="4" stroke="white" strokeWidth="2" opacity="0.4" />
        {/* Connector top */}
        <rect x="46" y="10" width="28" height="12" rx="3" stroke="white" strokeWidth="1.5" opacity="0.3" />
        {/* Nozzle */}
        <path d="M54 75 L54 95 Q54 100 60 105 Q66 100 66 95 L66 75" stroke="white" strokeWidth="2" opacity="0.4" fill="none" />
        {/* Spray pattern */}
        <line x1="55" y1="105" x2="48" y2="115" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="60" y1="107" x2="60" y2="118" stroke="white" strokeWidth="1" opacity="0.25" />
        <line x1="65" y1="105" x2="72" y2="115" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Solenoid coil lines */}
        <line x1="52" y1="30" x2="68" y2="30" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="52" y1="35" x2="68" y2="35" stroke="white" strokeWidth="1" opacity="0.2" />
        <line x1="52" y1="40" x2="68" y2="40" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Electrical connector pins */}
        <line x1="55" y1="5" x2="55" y2="10" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
        <line x1="65" y1="5" x2="65" y2="10" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
      </svg>
    ),
  },
  "pompes-hp": {
    gradient: "from-purple-600/90 via-purple-500/80 to-violet-400/70",
    label: "POMPE HP",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        {/* Pump body */}
        <rect x="30" y="30" width="60" height="50" rx="8" stroke="white" strokeWidth="2" opacity="0.4" />
        {/* Drive shaft */}
        <circle cx="60" cy="55" r="15" stroke="white" strokeWidth="2" opacity="0.3" />
        <circle cx="60" cy="55" r="6" fill="white" opacity="0.2" />
        {/* Pressure chamber */}
        <path d="M30 45 L18 40 L18 60 L30 55" stroke="white" strokeWidth="1.5" opacity="0.3" fill="none" />
        {/* Output pipe */}
        <path d="M90 45 L102 40 L102 60 L90 55" stroke="white" strokeWidth="1.5" opacity="0.3" fill="none" />
        {/* Pressure gauge */}
        <circle cx="60" cy="25" r="8" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <line x1="60" y1="25" x2="64" y2="21" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
        {/* Mounting bolts */}
        <circle cx="35" cy="85" r="3" stroke="white" strokeWidth="1" opacity="0.2" />
        <circle cx="85" cy="85" r="3" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Fuel rail connection */}
        <rect x="45" y="80" width="30" height="8" rx="3" stroke="white" strokeWidth="1" opacity="0.2" />
      </svg>
    ),
  },
  freinage: {
    gradient: "from-red-600/90 via-red-500/80 to-orange-400/70",
    label: "FREINAGE",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        {/* Brake disc */}
        <circle cx="60" cy="60" r="40" stroke="white" strokeWidth="2" opacity="0.3" />
        <circle cx="60" cy="60" r="30" stroke="white" strokeWidth="1.5" opacity="0.2" />
        <circle cx="60" cy="60" r="15" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Ventilation slots */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={angle}
            x1={60 + 18 * Math.cos((angle * Math.PI) / 180)}
            y1={60 + 18 * Math.sin((angle * Math.PI) / 180)}
            x2={60 + 35 * Math.cos((angle * Math.PI) / 180)}
            y2={60 + 35 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="1"
            opacity="0.15"
          />
        ))}
        {/* Caliper */}
        <path d="M85 45 Q100 55 100 65 Q100 75 85 78" stroke="white" strokeWidth="2.5" opacity="0.35" fill="none" strokeLinecap="round" />
        {/* Hub bolts */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <circle
            key={angle}
            cx={60 + 12 * Math.cos((angle * Math.PI) / 180)}
            cy={60 + 12 * Math.sin((angle * Math.PI) / 180)}
            r="2"
            fill="white"
            opacity="0.2"
          />
        ))}
      </svg>
    ),
  },
  "huiles-additifs": {
    gradient: "from-amber-600/90 via-amber-500/80 to-yellow-400/70",
    label: "HUILE",
    icon: (
      <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
        {/* Oil bottle */}
        <path d="M45 30 L45 20 Q45 15 50 15 L70 15 Q75 15 75 20 L75 30" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
        <rect x="38" y="30" width="44" height="70" rx="6" stroke="white" strokeWidth="2" opacity="0.4" />
        {/* Cap */}
        <rect x="48" y="10" width="24" height="8" rx="3" stroke="white" strokeWidth="1.5" opacity="0.3" />
        {/* Oil level */}
        <path d="M42 60 Q60 55 78 60 L78 96 Q78 98 76 98 L44 98 Q42 98 42 96 Z" fill="white" opacity="0.1" />
        {/* Label area */}
        <rect x="46" y="50" width="28" height="20" rx="3" stroke="white" strokeWidth="1" opacity="0.2" />
        {/* Drop */}
        <path d="M60 108 Q56 104 56 100 Q56 96 60 94 Q64 96 64 100 Q64 104 60 108 Z" fill="white" opacity="0.2" />
      </svg>
    ),
  },
};

const DEFAULT_CONFIG = {
  gradient: "from-slate-600/90 via-slate-500/80 to-gray-400/70",
  label: "PIÈCE AUTO",
  icon: (
    <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
      <circle cx="60" cy="55" r="25" stroke="white" strokeWidth="2" opacity="0.3" />
      <path d="M45 55 L35 45 M75 55 L85 45 M60 30 L60 18" stroke="white" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      <rect x="40" y="85" width="40" height="12" rx="4" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <line x1="50" y1="80" x2="50" y2="85" stroke="white" strokeWidth="1.5" opacity="0.2" />
      <line x1="70" y1="80" x2="70" y2="85" stroke="white" strokeWidth="1.5" opacity="0.2" />
    </svg>
  ),
};

function getCategorySlug(categoryName: string | null | undefined): string {
  if (!categoryName) return "";
  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function conditionBadge(condition?: string) {
  switch (condition) {
    case "Refurbished":
      return { label: "Reconditionné", color: "bg-white/20 text-white" };
    case "New":
      return { label: "Neuf", color: "bg-emerald-400/30 text-emerald-100" };
    case "ExchangeStandard":
      return { label: "Échange Std", color: "bg-amber-400/30 text-amber-100" };
    default:
      return null;
  }
}

export function ProductIllustration({
  categoryName,
  brandName,
  sku,
  condition,
  size = "md",
}: ProductIllustrationProps) {
  const slug = getCategorySlug(categoryName);
  const config = CATEGORY_CONFIG[slug] || DEFAULT_CONFIG;
  const badge = conditionBadge(condition);

  const sizeClasses = {
    sm: "aspect-square",
    md: "aspect-square",
    lg: "aspect-square",
  };

  const iconSizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  };

  return (
    <div className={`relative ${sizeClasses[size]} bg-gradient-to-br ${config.gradient} overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }} />
      </div>

      {/* Main illustration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={iconSizes[size]}>
          {config.icon}
        </div>
      </div>

      {/* Category label */}
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-white/80 text-[9px] font-bold tracking-widest uppercase">
          {config.label}
        </span>
      </div>

      {/* Condition badge */}
      {badge && (
        <div className="absolute top-3 right-3">
          <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold ${badge.color} backdrop-blur-sm`}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-3 pb-3 pt-8">
        <div className="flex items-end justify-between">
          {brandName && (
            <span className="text-white/90 text-[11px] font-bold uppercase tracking-wider">
              {brandName}
            </span>
          )}
          {sku && (
            <span className="text-white/50 text-[9px] font-mono">
              {sku}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
