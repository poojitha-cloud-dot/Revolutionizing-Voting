
export type Language = 'en' | 'es' | 'fr' | 'de';

export const translations = {
  en: {
    nav: {
      home: "Home",
      recommendations: "Recommendations",
      about: "About",
      contact: "Contact",
      language: "Language"
    },
    hero: {
      title: "Your Companion for a Perfect Home",
      subtitle: "Personalized recommendations for renovation, decor, and maintenance tailored specifically to your new space.",
      cta: "Get Started"
    },
    features: {
      renovation: "Smart Renovation",
      renovation_desc: "Track projects and get cost estimates based on your location.",
      decor: "Curated Decor",
      decor_desc: "Discover styles that match your taste and your home's architecture.",
      garden: "Garden Planning",
      garden_desc: "Seasonal planting guides for your specific climate zone."
    },
    recommendations: {
      title: "Curated for You",
      subtitle: "Based on your preferences",
      refresh: "Refresh Suggestions"
    }
  },
  es: {
    nav: {
      home: "Inicio",
      recommendations: "Recomendaciones",
      about: "Sobre Nosotros",
      contact: "Contacto",
      language: "Idioma"
    },
    hero: {
      title: "Tu Compañero para un Hogar Perfecto",
      subtitle: "Recomendaciones personalizadas de renovación, decoración y mantenimiento adaptadas específicamente a tu nuevo espacio.",
      cta: "Empezar"
    },
    features: {
      renovation: "Renovación Inteligente",
      renovation_desc: "Seguimiento de proyectos y estimaciones de costos basadas en tu ubicación.",
      decor: "Decoración Curada",
      decor_desc: "Descubre estilos que coinciden con tu gusto y la arquitectura de tu hogar.",
      garden: "Planificación de Jardines",
      garden_desc: "Guías de plantación estacional para tu zona climática específica."
    },
    recommendations: {
      title: "Curado para Ti",
      subtitle: "Basado en tus preferencias",
      refresh: "Actualizar Sugerencias"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      recommendations: "Recommandations",
      about: "À Propos",
      contact: "Contact",
      language: "Langue"
    },
    hero: {
      title: "Votre Compagnon pour une Maison Parfaite",
      subtitle: "Recommandations personnalisées pour la rénovation, la décoration et l'entretien adaptées à votre nouvel espace.",
      cta: "Commencer"
    },
    features: {
      renovation: "Rénovation Intelligente",
      renovation_desc: "Suivez les projets et obtenez des estimations de coûts basées sur votre emplacement.",
      decor: "Décoration Soignée",
      decor_desc: "Découvrez des styles qui correspondent à vos goûts et à l'architecture de votre maison.",
      garden: "Planification de Jardin",
      garden_desc: "Guides de plantation saisonnière pour votre zone climatique spécifique."
    },
    recommendations: {
      title: "Sélectionné pour Vous",
      subtitle: "Basé sur vos préférences",
      refresh: "Actualiser les Suggestions"
    }
  },
  de: {
    nav: {
      home: "Startseite",
      recommendations: "Empfehlungen",
      about: "Über Uns",
      contact: "Kontakt",
      language: "Sprache"
    },
    hero: {
      title: "Ihr Begleiter für ein Perfektes Zuhause",
      subtitle: "Personalisierte Empfehlungen für Renovierung, Dekoration und Wartung, speziell auf Ihr neues Zuhause zugeschnitten.",
      cta: "Loslegen"
    },
    features: {
      renovation: "Intelligente Renovierung",
      renovation_desc: "Verfolgen Sie Projekte und erhalten Sie Kostenschätzungen basierend auf Ihrem Standort.",
      decor: "Kuratierte Dekoration",
      decor_desc: "Entdecken Sie Stile, die Ihrem Geschmack und der Architektur Ihres Hauses entsprechen.",
      garden: "Gartenplanung",
      garden_desc: "Saisonale Pflanzleitfäden für Ihre spezifische Klimazone."
    },
    recommendations: {
      title: "Für Sie Kuratiert",
      subtitle: "Basierend auf Ihren Vorlieben",
      refresh: "Vorschläge Aktualisieren"
    }
  }
};

import { create } from 'zustand';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
}

export const useLanguage = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: translations['en'], // Default to English initially, updated via hook selector usually or just raw access
}));

// Helper to get current translations based on state
export const useTranslations = () => {
  const language = useLanguage((state) => state.language);
  return translations[language];
};
