export type Locale = "fr" | "en" | "es";

const translations = {
  fr: {
    nav: {
      turbos: "Nos Turbos",
      reconditioning: "Reconditionnement",
      articles: "Nos Articles",
      contact: "Contact",
      faq: "FAQ",
      login: "Connexion",
      logout: "Déconnexion",
      myAccount: "Mon compte",
      myOrders: "Mes commandes",
      cart: "Panier",
      searchPlaceholder: "Rechercher un turbo par référence, véhicule...",
    },
    hero: {
      trust: {
        warranty: "Garantie 2 ans",
        delivery: "Livraison rapide",
        payment: "Paiement sécurisé",
        workshop: "Atelier sur place",
      },
      cta: {
        viewTurbos: "Voir nos turbos",
        contact: "Nous contacter",
      },
    },
    search: {
      title: "Rechercher par véhicule",
      make: "Marque",
      model: "Modèle",
      engine: "Motorisation",
      searchBtn: "Rechercher",
      select: "Sélectionner",
      loading: "Chargement...",
      viewAll: "Voir tous les turbos",
      searchMake: "Rechercher une marque...",
      noMake: "Aucune marque trouvée",
    },
    applications: {
      tagline: "Nos domaines",
      title: "Turbos pour toutes les applications",
      subtitle: "Automobile, marine, industriel — on couvre tout",
      discover: "Découvrir",
      items: [
        {
          title: "Automobile",
          desc: "Voitures, utilitaires, poids lourds. Toutes marques, tous modèles. Turbo neuf ou reconditionné.",
          href: "/produits?application=automobile",
        },
        {
          title: "Marine",
          desc: "Bateaux, yachts, navires de croisière. Turbos marins adaptés aux conditions extrêmes.",
          href: "/produits?application=marine",
        },
        {
          title: "Industriel",
          desc: "Groupes électrogènes, engins de chantier, machines agricoles. Solutions sur mesure.",
          href: "/produits?application=industriel",
        },
      ],
    },
    makesGrid: {
      tagline: "Par marque",
      title: "Trouvez votre turbo par marque",
      subtitle: "Sélectionnez votre marque pour voir les turbos compatibles",
    },
    why: {
      tagline: "Notre différence",
      title: "Pourquoi TurboSouf ?",
      items: [
        {
          title: "Atelier intégré",
          desc: "Reconditionnement professionnel dans notre propre atelier. Chaque turbo est testé sur banc d'essai et calibré avant expédition.",
        },
        {
          title: "Garantie 2 ans",
          desc: "Tous nos turbos reconditionnés sont couverts par une garantie de 2 ans pièces et main-d'œuvre.",
        },
        {
          title: "Prix compétitifs",
          desc: "Jusqu'à 50% d'économie par rapport au neuf, sans compromis sur la qualité. Paiement en 3x/4x sans frais.",
        },
        {
          title: "Conseil expert",
          desc: "Notre équipe de spécialistes vous accompagne pour trouver le bon turbo compatible avec votre véhicule ou application.",
        },
        {
          title: "Multi-applications",
          desc: "Automobile, marine, industriel — nous couvrons toutes les applications avec des turbos adaptés à chaque usage.",
        },
        {
          title: "Reconditionnement",
          desc: "Confiez-nous votre turbo, on le remet à neuf. Diagnostic, réparation et test complet en atelier.",
        },
      ],
    },
    partners: "Nos marques partenaires",
    blog: {
      tagline: "BLOG",
      title: "Nos Articles",
      viewAll: "Voir tous",
    },
    faq: {
      tagline: "FAQ",
      title: "Questions\nfréquentes",
      subtitle: "Tout ce que vous devez savoir sur nos turbos reconditionnés, la garantie et la livraison.",
      viewAll: "Voir toutes les FAQ",
      items: [
        {
          q: "Quelle est la garantie sur les turbos reconditionnés ?",
          a: "Tous nos turbos reconditionnés sont garantis 2 ans, pièces et main-d'œuvre.",
        },
        {
          q: "Qu'est-ce que la consigne ?",
          a: "La consigne est un montant remboursable que vous payez à l'achat d'un turbo en échange standard. Renvoyez votre ancien turbo et nous vous remboursons la consigne.",
        },
        {
          q: "Quels sont les délais de livraison ?",
          a: "Livraison standard en 2-3 jours ouvrés. Express en 24h. Gratuite dès 150 euros.",
        },
        {
          q: "Faites-vous les turbos pour bateaux et industriel ?",
          a: "Oui, nous couvrons toutes les applications : automobile, marine (bateaux, yachts) et industriel (groupes électrogènes, engins de chantier).",
        },
        {
          q: "Puis-je faire reconditionner mon propre turbo ?",
          a: "Absolument. Envoyez-nous votre turbo, nous le diagnostiquons et le remettons à neuf dans notre atelier. Devis gratuit.",
        },
      ],
    },
    cta: {
      contact: "Nous contacter",
    },
    localeSwitcher: {
      fr: "FR",
      en: "EN",
      es: "ES",
    },
  },

  en: {
    nav: {
      turbos: "Our Turbos",
      reconditioning: "Reconditioning",
      articles: "Articles",
      contact: "Contact",
      faq: "FAQ",
      login: "Login",
      logout: "Log out",
      myAccount: "My account",
      myOrders: "My orders",
      cart: "Cart",
      searchPlaceholder: "Search a turbo by reference, vehicle...",
    },
    hero: {
      trust: {
        warranty: "2-year warranty",
        delivery: "Fast delivery",
        payment: "Secure payment",
        workshop: "In-house workshop",
      },
      cta: {
        viewTurbos: "View our turbos",
        contact: "Contact us",
      },
    },
    search: {
      title: "Search by vehicle",
      make: "Make",
      model: "Model",
      engine: "Engine",
      searchBtn: "Search",
      select: "Select",
      loading: "Loading...",
      viewAll: "View all turbos",
      searchMake: "Search a make...",
      noMake: "No make found",
    },
    applications: {
      tagline: "Our fields",
      title: "Turbos for every application",
      subtitle: "Automotive, marine, industrial — we cover it all",
      discover: "Discover",
      items: [
        {
          title: "Automotive",
          desc: "Cars, vans, heavy goods vehicles. All makes, all models. New or reconditioned turbo.",
          href: "/produits?application=automobile",
        },
        {
          title: "Marine",
          desc: "Boats, yachts, cruise ships. Marine turbos built for extreme conditions.",
          href: "/produits?application=marine",
        },
        {
          title: "Industrial",
          desc: "Generators, construction equipment, agricultural machinery. Bespoke solutions.",
          href: "/produits?application=industriel",
        },
      ],
    },
    makesGrid: {
      tagline: "By make",
      title: "Find your turbo by make",
      subtitle: "Select your make to see compatible turbos",
    },
    why: {
      tagline: "Our difference",
      title: "Why TurboSouf?",
      items: [
        {
          title: "In-house workshop",
          desc: "Professional reconditioning in our own workshop. Every turbo is bench-tested and calibrated before despatch.",
        },
        {
          title: "2-year warranty",
          desc: "All our reconditioned turbos come with a 2-year parts and labour warranty.",
        },
        {
          title: "Competitive prices",
          desc: "Save up to 50% compared to new, with no compromise on quality. Pay in 3 or 4 instalments at no extra cost.",
        },
        {
          title: "Expert advice",
          desc: "Our team of specialists will help you find the right turbo compatible with your vehicle or application.",
        },
        {
          title: "Multi-application",
          desc: "Automotive, marine, industrial — we cover every application with turbos suited to each use.",
        },
        {
          title: "Reconditioning",
          desc: "Send us your turbo and we'll restore it to as-new condition. Full diagnosis, repair and testing in our workshop.",
        },
      ],
    },
    partners: "Our partner brands",
    blog: {
      tagline: "BLOG",
      title: "Latest Articles",
      viewAll: "View all",
    },
    faq: {
      tagline: "FAQ",
      title: "Frequently\nasked questions",
      subtitle: "Everything you need to know about our reconditioned turbos, warranty and delivery.",
      viewAll: "View all FAQs",
      items: [
        {
          q: "What warranty comes with reconditioned turbos?",
          a: "All our reconditioned turbos are covered by a 2-year parts and labour warranty.",
        },
        {
          q: "What is a core charge (consigne)?",
          a: "A core charge is a refundable deposit paid when you buy a turbo on an exchange basis. Return your old turbo and we will refund the deposit in full.",
        },
        {
          q: "How long does delivery take?",
          a: "Standard delivery takes 2–3 working days. Express delivery is available within 24 hours. Free delivery on orders over €150.",
        },
        {
          q: "Do you supply turbos for boats and industrial use?",
          a: "Yes, we cover all applications: automotive, marine (boats, yachts) and industrial (generators, construction equipment).",
        },
        {
          q: "Can I have my own turbo reconditioned?",
          a: "Absolutely. Send us your turbo and we will diagnose it and restore it to as-new condition in our workshop. Free quote.",
        },
      ],
    },
    cta: {
      contact: "Contact us",
    },
    localeSwitcher: {
      fr: "FR",
      en: "EN",
      es: "ES",
    },
  },

  es: {
    nav: {
      turbos: "Nuestros Turbos",
      reconditioning: "Reacondicionamiento",
      articles: "Artículos",
      contact: "Contacto",
      faq: "FAQ",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      myAccount: "Mi cuenta",
      myOrders: "Mis pedidos",
      cart: "Carrito",
      searchPlaceholder: "Buscar un turbo por referencia, vehículo...",
    },
    hero: {
      trust: {
        warranty: "Garantía 2 años",
        delivery: "Entrega rápida",
        payment: "Pago seguro",
        workshop: "Taller propio",
      },
      cta: {
        viewTurbos: "Ver nuestros turbos",
        contact: "Contactarnos",
      },
    },
    search: {
      title: "Buscar por vehículo",
      make: "Marca",
      model: "Modelo",
      engine: "Motor",
      searchBtn: "Buscar",
      select: "Seleccionar",
      loading: "Cargando...",
      viewAll: "Ver todos los turbos",
      searchMake: "Buscar una marca...",
      noMake: "Ninguna marca encontrada",
    },
    applications: {
      tagline: "Nuestros ámbitos",
      title: "Turbos para todas las aplicaciones",
      subtitle: "Automoción, marina, industrial — lo cubrimos todo",
      discover: "Descubrir",
      items: [
        {
          title: "Automoción",
          desc: "Turismos, furgonetas, vehículos pesados. Todas las marcas, todos los modelos. Turbo nuevo o reacondicionado.",
          href: "/produits?application=automobile",
        },
        {
          title: "Marina",
          desc: "Barcos, yates, cruceros. Turbos marinos diseñados para condiciones extremas.",
          href: "/produits?application=marine",
        },
        {
          title: "Industrial",
          desc: "Grupos electrógenos, maquinaria de construcción, equipos agrícolas. Soluciones a medida.",
          href: "/produits?application=industriel",
        },
      ],
    },
    makesGrid: {
      tagline: "Por marca",
      title: "Encuentra tu turbo por marca",
      subtitle: "Selecciona tu marca para ver los turbos compatibles",
    },
    why: {
      tagline: "Nuestra diferencia",
      title: "¿Por qué TurboSouf?",
      items: [
        {
          title: "Taller propio",
          desc: "Reacondicionamiento profesional en nuestro propio taller. Cada turbo se prueba en banco y se calibra antes del envío.",
        },
        {
          title: "Garantía 2 años",
          desc: "Todos nuestros turbos reacondicionados incluyen una garantía de 2 años en piezas y mano de obra.",
        },
        {
          title: "Precios competitivos",
          desc: "Ahorra hasta un 50% frente al nuevo, sin comprometer la calidad. Pago en 3 o 4 plazos sin recargo.",
        },
        {
          title: "Asesoramiento experto",
          desc: "Nuestro equipo de especialistas te ayuda a encontrar el turbo adecuado para tu vehículo o aplicación.",
        },
        {
          title: "Multiámbito",
          desc: "Automoción, marina, industrial — cubrimos todas las aplicaciones con turbos adaptados a cada uso.",
        },
        {
          title: "Reacondicionamiento",
          desc: "Envíanos tu turbo y lo dejamos como nuevo. Diagnóstico, reparación y prueba completa en taller.",
        },
      ],
    },
    partners: "Nuestras marcas asociadas",
    blog: {
      tagline: "BLOG",
      title: "Últimos Artículos",
      viewAll: "Ver todos",
    },
    faq: {
      tagline: "FAQ",
      title: "Preguntas\nfrecuentes",
      subtitle: "Todo lo que necesitas saber sobre nuestros turbos reacondicionados, la garantía y el envío.",
      viewAll: "Ver todas las FAQ",
      items: [
        {
          q: "¿Qué garantía tienen los turbos reacondicionados?",
          a: "Todos nuestros turbos reacondicionados tienen una garantía de 2 años en piezas y mano de obra.",
        },
        {
          q: "¿Qué es el depósito (consigne)?",
          a: "El depósito es un importe reembolsable que pagas al comprar un turbo en régimen de intercambio. Devuelve tu turbo antiguo y te reembolsamos el depósito íntegramente.",
        },
        {
          q: "¿Cuáles son los plazos de entrega?",
          a: "Entrega estándar en 2-3 días laborables. Entrega urgente en 24 horas. Envío gratuito a partir de 150 €.",
        },
        {
          q: "¿Hacéis turbos para barcos y uso industrial?",
          a: "Sí, cubrimos todas las aplicaciones: automoción, marina (barcos, yates) e industrial (grupos electrógenos, maquinaria de construcción).",
        },
        {
          q: "¿Puedo reacondicionar mi propio turbo?",
          a: "Por supuesto. Envíanos tu turbo, lo diagnosticamos y lo dejamos como nuevo en nuestro taller. Presupuesto gratuito.",
        },
      ],
    },
    cta: {
      contact: "Contactarnos",
    },
    localeSwitcher: {
      fr: "FR",
      en: "EN",
      es: "ES",
    },
  },
} as const;

export type Translations = typeof translations.fr;

export function getT(locale: Locale): Translations {
  return translations[locale] as unknown as Translations;
}
