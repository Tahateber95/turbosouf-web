/**
 * Vehicle make logos as inline SVGs for common brands.
 * Falls back to 2-letter abbreviation if no logo available.
 */

interface MakeLogoProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

const LOGOS: Record<string, React.ReactNode> = {
  audi: (
    <svg viewBox="0 0 200 60" fill="currentColor">
      <circle cx="40" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="70" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="100" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="130" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  bmw: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="5"/>
      <path d="M50 3 A47 47 0 0 1 97 50 L50 50 Z" fill="#0066B1" opacity="0.8"/>
      <path d="M50 97 A47 47 0 0 1 3 50 L50 50 Z" fill="#0066B1" opacity="0.8"/>
    </svg>
  ),
  "mercedes-benz": (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="12" x2="50" y2="50" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="16" y2="72" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="84" y2="72" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  mercedes: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="12" x2="50" y2="50" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="16" y2="72" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="50" x2="84" y2="72" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  volkswagen: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M25 25 L50 68 L75 25" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M32 38 L50 80 L68 38" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    </svg>
  ),
  vw: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M25 25 L50 68 L75 25" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M32 38 L50 80 L68 38" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    </svg>
  ),
  renault: (
    <svg viewBox="0 0 80 100" fill="currentColor">
      <path d="M40 5 L75 30 L75 75 L40 95 L5 75 L5 30 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M40 25 L58 38 L58 65 L40 78 L22 65 L22 38 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
  ),
  peugeot: (
    <svg viewBox="0 0 80 100" fill="currentColor">
      <path d="M40 5 L40 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M40 15 Q55 20 60 35 Q55 50 40 50" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M40 50 Q55 50 60 65 Q55 80 40 80" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M25 70 L55 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
  citroen: (
    <svg viewBox="0 0 100 80" fill="currentColor">
      <path d="M50 5 L20 30 L80 30 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M50 30 L20 55 L80 55 Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
    </svg>
  ),
  toyota: (
    <svg viewBox="0 0 120 80" fill="currentColor">
      <ellipse cx="60" cy="40" rx="55" ry="35" fill="none" stroke="currentColor" strokeWidth="4"/>
      <ellipse cx="60" cy="40" rx="32" ry="20" fill="none" stroke="currentColor" strokeWidth="4"/>
      <ellipse cx="60" cy="40" rx="12" ry="35" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  ford: (
    <svg viewBox="0 0 120 50" fill="currentColor">
      <ellipse cx="60" cy="25" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="4"/>
      <text x="60" y="33" textAnchor="middle" fontSize="24" fontWeight="bold" fontFamily="serif" fill="currentColor">Ford</text>
    </svg>
  ),
  fiat: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <text x="50" y="58" textAnchor="middle" fontSize="28" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">FIAT</text>
    </svg>
  ),
  opel: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M10 50 L90 50" stroke="currentColor" strokeWidth="4"/>
      <path d="M20 38 L80 38 Q85 38 85 43 L85 50 L15 50 L15 43 Q15 38 20 38" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  nissan: (
    <svg viewBox="0 0 120 60" fill="currentColor">
      <circle cx="60" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="4"/>
      <rect x="5" y="24" width="110" height="12" rx="6" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  ),
  hyundai: (
    <svg viewBox="0 0 100 80" fill="currentColor">
      <ellipse cx="50" cy="40" rx="45" ry="35" fill="none" stroke="currentColor" strokeWidth="4"/>
      <text x="50" y="48" textAnchor="middle" fontSize="26" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif" fill="currentColor">H</text>
    </svg>
  ),
  kia: (
    <svg viewBox="0 0 100 50" fill="currentColor">
      <ellipse cx="50" cy="25" rx="45" ry="22" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text x="50" y="33" textAnchor="middle" fontSize="24" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">KIA</text>
    </svg>
  ),
  seat: (
    <svg viewBox="0 0 100 60" fill="currentColor">
      <text x="50" y="42" textAnchor="middle" fontSize="32" fontWeight="bold" letterSpacing="3" fontFamily="sans-serif" fill="currentColor">SEAT</text>
      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  skoda: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M30 40 Q50 25 70 40 L65 55 Q50 45 35 55 Z" fill="currentColor" opacity="0.7"/>
      <path d="M62 43 L72 50 L65 55" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  dacia: (
    <svg viewBox="0 0 120 50" fill="currentColor">
      <rect x="5" y="5" width="110" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="4"/>
      <text x="60" y="33" textAnchor="middle" fontSize="20" fontWeight="bold" letterSpacing="4" fontFamily="sans-serif" fill="currentColor">DACIA</text>
    </svg>
  ),
  volvo: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="5" x2="80" y2="35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <text x="50" y="62" textAnchor="middle" fontSize="18" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">VOLVO</text>
    </svg>
  ),
  mini: (
    <svg viewBox="0 0 120 60" fill="currentColor">
      <circle cx="60" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="4"/>
      <line x1="5" y1="30" x2="33" y2="30" stroke="currentColor" strokeWidth="4"/>
      <line x1="87" y1="30" x2="115" y2="30" stroke="currentColor" strokeWidth="4"/>
      <text x="60" y="36" textAnchor="middle" fontSize="14" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif" fill="currentColor">MINI</text>
    </svg>
  ),
  jaguar: (
    <svg viewBox="0 0 120 50" fill="currentColor">
      <text x="60" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fontStyle="italic" fontFamily="serif" fill="currentColor">JAGUAR</text>
      <line x1="10" y1="42" x2="110" y2="42" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  "land rover": (
    <svg viewBox="0 0 120 50" fill="currentColor">
      <ellipse cx="60" cy="25" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text x="60" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="2" fontFamily="sans-serif" fill="currentColor">LAND</text>
      <text x="60" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" letterSpacing="2" fontFamily="sans-serif" fill="currentColor">ROVER</text>
    </svg>
  ),
  porsche: (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <rect x="10" y="5" width="80" height="90" rx="6" fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      <text x="50" y="57" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif" fill="currentColor">P</text>
    </svg>
  ),
  mazda: (
    <svg viewBox="0 0 120 60" fill="currentColor">
      <ellipse cx="60" cy="30" rx="50" ry="25" fill="none" stroke="currentColor" strokeWidth="4"/>
      <path d="M35 30 Q48 15 60 25 Q72 15 85 30" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  suzuki: (
    <svg viewBox="0 0 100 60" fill="currentColor">
      <text x="50" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fontStyle="italic" fontFamily="sans-serif" fill="currentColor">S</text>
      <circle cx="50" cy="30" r="27" fill="none" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  honda: (
    <svg viewBox="0 0 100 80" fill="currentColor">
      <rect x="10" y="10" width="80" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="4"/>
      <text x="50" y="50" textAnchor="middle" fontSize="36" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">H</text>
    </svg>
  ),
  subaru: (
    <svg viewBox="0 0 120 60" fill="currentColor">
      <ellipse cx="60" cy="30" rx="55" ry="25" fill="none" stroke="currentColor" strokeWidth="3"/>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <circle key={i} cx={35 + (i % 3) * 18} cy={i < 3 ? 22 : 38} r="4" fill="currentColor" opacity="0.6"/>
      ))}
    </svg>
  ),
  "alfa romeo": (
    <svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"/>
      <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="3"/>
      <text x="28" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill="currentColor">A</text>
      <text x="72" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="serif" fill="currentColor">R</text>
    </svg>
  ),
};

function normalize(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export function MakeLogo({ name, logoUrl, className = "w-full h-full" }: MakeLogoProps) {
  // If a logoUrl is provided, use it
  if (logoUrl) {
    return <img src={logoUrl} alt={name} className={`${className} object-contain`} />;
  }

  const key = normalize(name);
  const svg = LOGOS[key];

  if (svg) {
    return <div className={`${className} flex items-center justify-center text-gray-600`}>{svg}</div>;
  }

  // Fallback: 2-letter abbreviation
  return (
    <span className="text-sm font-bold text-gray-500 uppercase">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
