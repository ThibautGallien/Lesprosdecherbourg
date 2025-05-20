import { Article, CategoryInfo } from "@/types";

export const categoryInfo: Record<string, CategoryInfo> = {
  "technologie": {
    slug: "technologie",
    name: "Technologie",
    description: "Découvrez les dernières innovations technologiques, les tests de produits et nos conseils d'experts pour rester à la pointe de la tech."
  },
  "mode-et-beaute": {
    slug: "mode-et-beaute",
    name: "Mode et beauté",
    description: "Suivez les dernières tendances mode, nos conseils beauté et nos sélections de produits pour sublimer votre style au quotidien."
  },
  "voyage": {
    slug: "voyage",
    name: "Voyage",
    description: "Explorez de nouvelles destinations, découvrez nos guides de voyage et astuces pour préparer vos prochaines aventures à travers le monde."
  },
  "loisirs": {
    slug: "loisirs",
    name: "Loisirs",
    description: "Culture, divertissement, sorties et activités : trouvez l'inspiration pour occuper votre temps libre et enrichir votre quotidien."
  },
  "sante-et-bien-etre": {
    slug: "sante-et-bien-etre",
    name: "Santé et Bien-être",
    description: "Conseils santé, bien-être mental et physique, nutrition et fitness pour vous accompagner vers un mode de vie équilibré et épanouissant."
  }
};

// Sample article data
export const articles: Article[] = [
  {
    id: "1",
    title: "Les 5 innovations technologiques qui vont révolutionner notre quotidien",
    slug: "innovations-technologiques-revolution-quotidien",
    excerpt: "Découvrez les technologies émergentes qui s'apprêtent à transformer radicalement notre façon de vivre, travailler et communiquer.",
    content: "Contenu complet de l'article sur les innovations technologiques...",
    category: "technologie",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "1",
      name: "Marie Dupont",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Journaliste tech passionnée et early adopter de nouvelles technologies."
    },
    publishedAt: "2025-04-10T08:00:00Z",
    featured: true,
    tags: ["innovation", "futur", "technologie", "ia", "robotique"]
  },
  {
    id: "2",
    title: "Guide complet des tendances mode printemps-été 2025",
    slug: "tendances-mode-printemps-ete-2025",
    excerpt: "Notre sélection des pièces incontournables et des couleurs phares qui domineront votre garde-robe cette saison.",
    content: "Contenu complet de l'article sur les tendances mode...",
    category: "mode-et-beaute",
    image: "https://images.pexels.com/photos/5935740/pexels-photo-5935740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "2",
      name: "Sophie Martin",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Styliste et consultante mode avec 10 ans d'expérience dans l'industrie du luxe."
    },
    publishedAt: "2025-04-08T10:30:00Z",
    featured: true,
    tags: ["mode", "tendances", "style", "printemps-été", "fashion"]
  },
  {
    id: "3",
    title: "Les destinations secrètes de Normandie à découvrir absolument",
    slug: "destinations-secretes-normandie",
    excerpt: "Partez à la découverte des joyaux cachés de la Normandie, loin des sentiers battus et des foules touristiques.",
    content: "Contenu complet de l'article sur les destinations normandes...",
    category: "voyage",
    image: "https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "3",
      name: "Thomas Leroy",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Guide touristique passionné par l'histoire et les traditions normandes."
    },
    publishedAt: "2025-04-05T09:15:00Z",
    featured: true,
    tags: ["voyage", "normandie", "tourisme", "nature", "culture"]
  },
  {
    id: "4",
    title: "10 activités créatives pour occuper vos enfants pendant les vacances",
    slug: "activites-creatives-enfants-vacances",
    excerpt: "Des idées originales et éducatives pour divertir vos enfants tout en stimulant leur créativité et leur apprentissage.",
    content: "Contenu complet de l'article sur les activités pour enfants...",
    category: "loisirs",
    image: "https://images.pexels.com/photos/3933021/pexels-photo-3933021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "4",
      name: "Claire Dubois",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Éducatrice spécialisée et mère de trois enfants."
    },
    publishedAt: "2025-04-02T14:00:00Z",
    featured: false,
    tags: ["enfants", "activités", "créativité", "vacances", "famille"]
  },
  {
    id: "5",
    title: "Méditation et pleine conscience : les bases pour débuter",
    slug: "meditation-pleine-conscience-bases-debutants",
    excerpt: "Comment intégrer la méditation dans votre quotidien pour réduire le stress et améliorer votre bien-être mental.",
    content: "Contenu complet de l'article sur la méditation...",
    category: "sante-et-bien-etre",
    image: "https://images.pexels.com/photos/3759661/pexels-photo-3759661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "5",
      name: "Paul Marchand",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Coach en développement personnel et instructeur de méditation certifié."
    },
    publishedAt: "2025-03-28T11:45:00Z",
    featured: false,
    tags: ["méditation", "bien-être", "stress", "santé mentale", "pleine conscience"]
  },
  {
    id: "6",
    title: "Les meilleurs smartphones de 2025 : notre comparatif complet",
    slug: "meilleurs-smartphones-2025-comparatif",
    excerpt: "Découvrez notre sélection des smartphones les plus performants et innovants de l'année avec leurs points forts et leurs faiblesses.",
    content: "Contenu complet de l'article sur les smartphones...",
    category: "technologie",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "1",
      name: "Marie Dupont",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Journaliste tech passionnée et early adopter de nouvelles technologies."
    },
    publishedAt: "2025-03-25T15:20:00Z",
    featured: false,
    tags: ["smartphones", "tech", "comparatif", "mobile", "high-tech"]
  },
  {
    id: "7",
    title: "Soins naturels pour une peau éclatante : recettes et astuces",
    slug: "soins-naturels-peau-eclatante-recettes-astuces",
    excerpt: "Des solutions de beauté maison efficaces à base d'ingrédients naturels pour prendre soin de votre peau au quotidien.",
    content: "Contenu complet de l'article sur les soins naturels...",
    category: "mode-et-beaute",
    image: "https://images.pexels.com/photos/7983155/pexels-photo-7983155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "2",
      name: "Sophie Martin",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Styliste et consultante mode avec 10 ans d'expérience dans l'industrie du luxe."
    },
    publishedAt: "2025-03-20T13:10:00Z",
    featured: false,
    tags: ["beauté", "soins naturels", "cosmétiques", "peau", "bio"]
  },
  {
    id: "8",
    title: "Guide gastronomique de Cherbourg : les meilleures adresses",
    slug: "guide-gastronomique-cherbourg-meilleures-adresses",
    excerpt: "Notre sélection des restaurants, cafés et marchés incontournables pour savourer les spécialités locales à Cherbourg.",
    content: "Contenu complet de l'article sur la gastronomie à Cherbourg...",
    category: "loisirs",
    image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: {
      id: "3",
      name: "Thomas Leroy",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Guide touristique passionné par l'histoire et les traditions normandes."
    },
    publishedAt: "2025-03-15T12:30:00Z",
    featured: false,
    tags: ["gastronomie", "cherbourg", "restaurants", "cuisine", "gourmandise"]
  }
];

export function getFeaturedArticles() {
  return articles.filter(article => article.featured);
}

export function getLatestArticles(count = 6) {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getArticlesByCategory(category: string, count?: number) {
  const filteredArticles = articles.filter(article => article.category === category);
  
  if (count) {
    return filteredArticles.slice(0, count);
  }
  
  return filteredArticles;
}

export function getArticleBySlug(slug: string) {
  return articles.find(article => article.slug === slug);
}

export function getRelatedArticles(currentArticle: Article, count = 3) {
  return articles
    .filter(article => 
      article.id !== currentArticle.id && 
      (article.category === currentArticle.category || 
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, count);
}