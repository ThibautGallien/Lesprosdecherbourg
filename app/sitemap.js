import { getLatestArticles, categoryInfo } from "@/lib/data";

export default function sitemap() {
  const baseUrl = "https://lesprosdecherbourg.fr";
  // Utilisez getLatestArticles avec une limite élevée pour récupérer tous les articles
  const articles = getLatestArticles(1000); // Ajustez selon vos besoins

  // Fonction utilitaire pour gérer les dates
  function getSafeDate(dateValue) {
    if (!dateValue) return new Date();

    // Si c'est déjà un objet Date
    if (dateValue instanceof Date) {
      return isNaN(dateValue.getTime()) ? new Date() : dateValue;
    }

    // Si c'est une string, essayer de la parser
    const parsedDate = new Date(dateValue);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  // Pages statiques avec leurs priorités et fréquences de mise à jour
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Pages de catégories
  const categoryPages = Object.keys(categoryInfo).map((key) => {
    const category = categoryInfo[key];
    return {
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  // Articles individuels avec gestion sécurisée des dates
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: getSafeDate(article.date || article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Combiner toutes les URLs
  return [...staticPages, ...categoryPages, ...articlePages];
}
