import { notFound } from "next/navigation";
import { getArticleBySlug, getLatestArticles } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";

export default async function ArticlePage({ params }) {
  // Attendre les params avant de les utiliser (Next.js 15)
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  // Récupérer l'article par slug
  const article = getArticleBySlug(slug);

  // Vérifier que l'article existe et appartient à la bonne catégorie
  if (!article || article.category !== category) {
    notFound();
  }

  // Articles similaires (même catégorie)
  const relatedArticles = getLatestArticles(20)
    .filter((a) => a.category === category && a.slug !== slug)
    .slice(0, 3);

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: {
      "@type": "Person",
      name: article.author?.name || "Les Pros de Cherbourg",
    },
    publisher: {
      "@type": "Organization",
      name: "Les Pros de Cherbourg",
      logo: {
        "@type": "ImageObject",
        url: "https://lesprosdecherbourg.fr/images/logo.jpg",
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lesprosdecherbourg.fr/categorie/${category}/${slug}`,
    },
  };

  return (
    <div className="pt-16">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-800">
              Accueil
            </Link>
            <span>/</span>
            <Link
              href={`/categorie/${category}`}
              className="hover:text-gray-800 capitalize"
            >
              {category.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article header */}
      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button asChild variant="outline" className="mb-6">
              <Link href={`/categorie/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à {category.replace(/-/g, " ")}
              </Link>
            </Button>

            {/* Category badge */}
            <div className="mb-4">
              <Link
                href={`/categorie/${category}`}
                className="inline-block bg-primary text-white text-sm font-medium px-3 py-1 rounded-full hover:bg-primary/80 transition-colors"
              >
                {category
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author?.name || "Auteur"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <time dateTime={article.publishedAt}>
                  {format(new Date(article.publishedAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{article.readingTime} min de lecture</span>
              </div>
            </div>

            {/* Featured image */}
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {article.content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: article.content.replace(/\n/g, "<br />"),
                  }}
                />
              ) : (
                <p>Contenu de l&rsquo;article à venir...</p>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Génération des métadonnées pour le SEO
export async function generateMetadata({ params }) {
  // Attendre les params avant de les utiliser (Next.js 15)
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;

  const article = getArticleBySlug(slug);

  if (!article || article.category !== category) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: `${article.title} | Les Pros de Cherbourg`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: "article",
    },
  };
}
