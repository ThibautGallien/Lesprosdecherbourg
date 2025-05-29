import { getArticleFromCMS } from "./cms.js";

// Articles existants (garde tes articles de test)
export const articles = [
  {
    id: "1",
    title:
      "Les 5 innovations technologiques qui vont révolutionner notre quotidien",
    slug: "innovations-technologiques-2024",
    excerpt:
      "Découvrez les technologies émergentes qui s'apprêtent à transformer radicalement notre façon de vivre, travailler et communiquer.",
    content: "Contenu de l'article...",
    category: "technologie",
    image:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      name: "Marie Dubois",
      avatar: "/images/authors/marie.jpg",
    },
    publishedAt: "2024-01-15T10:30:00Z",
    tags: ["innovation", "technologie", "futur"],
    readingTime: 8,
    featured: true,
  },
  // ... tes autres articles existants
];

// Informations sur les catégories
export const categoryInfo = {
  tech: {
    name: "Technologie",
    slug: "technologie",
    description:
      "Découvrez les dernières innovations et tendances technologiques",
    color: "blue",
  },
  fashion: {
    name: "Mode et Beauté",
    slug: "mode-et-beaute",
    description: "Tendances mode, conseils beauté et style de vie",
    color: "pink",
  },
  travel: {
    name: "Voyage",
    slug: "voyage",
    description: "Destinations, conseils voyage et découvertes culturelles",
    color: "green",
  },
  leisure: {
    name: "Loisirs",
    slug: "loisirs",
    description: "Activités, hobbies et divertissements",
    color: "purple",
  },
  health: {
    name: "Santé et Bien-être",
    slug: "sante-et-bien-etre",
    description: "Conseils santé, nutrition et bien-être",
    color: "orange",
  },
};

// Fonction pour combiner articles existants et CMS
function getAllArticles() {
  const cmsArticles = getArticleFromCMS();

  // Combine articles existants et articles CMS
  const combinedArticles = [...articles, ...cmsArticles];

  // Trie par date de publication (plus récent en premier)
  return combinedArticles.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

// Fonctions existantes modifiées
export function getFeaturedArticles() {
  const allArticles = getAllArticles();
  return allArticles.filter((article) => article.featured);
}

export function getLatestArticles(limit = 10) {
  const allArticles = getAllArticles();
  return allArticles.slice(0, limit);
}

export function getArticlesByCategory(category, limit = null) {
  const allArticles = getAllArticles();
  const filtered = allArticles.filter(
    (article) => article.category === category
  );
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getArticleBySlug(slug) {
  const allArticles = getAllArticles();
  console.log("🔍 Recherche slug:", slug);
  console.log(
    "📄 Articles disponibles:",
    allArticles.map((a) => ({ slug: a.slug, category: a.category }))
  );

  const found = allArticles.find((article) => article.slug === slug);
  console.log(
    "✅ Article trouvé:",
    found ? `${found.slug} (${found.category})` : "AUCUN"
  );

  return found;
}
