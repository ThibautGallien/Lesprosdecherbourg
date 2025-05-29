import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export function getArticleFromCMS() {
  try {
    console.log("🔍 Lecture du dossier:", articlesDirectory);

    // Vérifier si le dossier content/articles existe
    if (!fs.existsSync(articlesDirectory)) {
      console.log("⚠️ Dossier content/articles n'existe pas encore");
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    console.log("📁 Fichiers trouvés:", fileNames);

    const markdownFiles = fileNames.filter((name) => name.endsWith(".md"));
    console.log("📄 Fichiers markdown:", markdownFiles);

    if (markdownFiles.length === 0) {
      console.log("⚠️ Aucun fichier markdown trouvé");
      return [];
    }

    const allArticles = markdownFiles.map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);

      console.log("📖 Lecture du fichier:", fullPath);

      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Parse du frontmatter
      const matterResult = matter(fileContents);
      console.log("✅ Frontmatter parsé:", matterResult.data);

      return {
        id,
        slug: matterResult.data.slug || id,
        title: matterResult.data.title || "Sans titre",
        excerpt: matterResult.data.excerpt || "Pas de description",
        content: matterResult.content,
        category: matterResult.data.category || "technologie",
        image: matterResult.data.image || "/images/placeholder.jpg",
        author: matterResult.data.author || {
          name: "Auteur",
          avatar: "/images/placeholder-avatar.jpg",
        },
        publishedAt: matterResult.data.publishedAt || new Date().toISOString(),
        tags: matterResult.data.tags || [],
        readingTime: matterResult.data.readingTime || 5,
        featured: matterResult.data.featured || false,
        draft: matterResult.data.draft || false,
      };
    });

    console.log(
      "📚 Articles traités:",
      allArticles.map((a) => ({ slug: a.slug, category: a.category }))
    );

    // Filtrer les brouillons et trier par date
    const filteredArticles = allArticles
      .filter((article) => !article.draft)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    console.log("🎯 Articles finaux:", filteredArticles.length);
    return filteredArticles;
  } catch (error) {
    console.error("❌ Erreur lors de la lecture des articles CMS:", error);
    return [];
  }
}

export function getCMSArticleBySlug(slug) {
  const articles = getArticleFromCMS();
  return articles.find((article) => article.slug === slug);
}
