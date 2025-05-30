// app/articles/[slug]/page.js
import { notFound } from "next/navigation";

// Fonction pour récupérer l'article depuis GitHub
async function getArticle(slug) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/content/articles/${slug}.md?ref=main`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 }, // Cache pendant 1 minute
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = atob(data.content); // Décoder base64

    return parseMarkdownArticle(content, `${slug}.md`);
  } catch (error) {
    console.error("Erreur récupération article:", error);
    return null;
  }
}

// Parser markdown (même fonction que dans le CMS)
function parseMarkdownArticle(content, filename) {
  try {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) return null;

    const frontMatter = frontMatterMatch[1];
    const articleContent = content.replace(/^---\n[\s\S]*?\n---\n/, "");

    const metadata = {};
    frontMatter.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        let value = valueParts
          .join(":")
          .trim()
          .replace(/^["']|["']$/g, "");

        if (key.trim() === "tags") {
          if (value.startsWith("[") && value.endsWith("]")) {
            value = value.slice(1, -1);
            metadata[key.trim()] = value
              .split(",")
              .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
              .filter((tag) => tag.length > 0);
          } else if (value.includes(",")) {
            metadata[key.trim()] = value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
          } else if (value.length > 0) {
            metadata[key.trim()] = [value];
          } else {
            metadata[key.trim()] = [];
          }
        } else {
          metadata[key.trim()] = value;
        }
      }
    });

    return {
      title: metadata.title || "Sans titre",
      slug: metadata.slug || filename.replace(".md", ""),
      excerpt: metadata.excerpt || "",
      category: metadata.category || "non-categorise",
      publishedAt:
        metadata.publishedAt || metadata.date || new Date().toISOString(),
      draft: metadata.draft === "true" || metadata.draft === true,
      content: articleContent,
      tags: Array.isArray(metadata.tags)
        ? metadata.tags
        : metadata.tags
        ? [metadata.tags]
        : [],
      author: metadata.author || "Admin",
      ...metadata,
    };
  } catch (error) {
    console.error("Erreur parsing article:", error);
    return null;
  }
}

// Génération des métadonnées
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

// Page principale
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.draft) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header de l'article */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {article.category
                .replace("-", " ")
                .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          )}

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Par {article.author}</span>
            <span className="mx-2">•</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Contenu de l'article */}
        <article className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            {/* Affichage basique du markdown - vous pouvez ajouter un parser markdown ici */}
            <div style={{ whiteSpace: "pre-wrap" }}>{article.content}</div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            ← Retour aux articles
          </a>
        </div>
      </div>
    </div>
  );
}
