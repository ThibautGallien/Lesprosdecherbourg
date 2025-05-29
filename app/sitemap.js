import { getLatestArticles, categoryInfo } from "@/lib/data";

export default function sitemap() {
  const baseUrl = "https://lesprosdecherbourg.fr"; // Remplace par ton domaine

  // URLs statiques
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // URLs des catégories
  const categoryUrls = Object.values(categoryInfo).map((category) => ({
    url: `${baseUrl}/categorie/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // URLs des articles
  const articles = getLatestArticles(1000); // Tous les articles
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/categorie/${article.category}/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticUrls, ...categoryUrls, ...articleUrls];
}
