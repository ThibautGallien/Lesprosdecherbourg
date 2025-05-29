import {
  getFeaturedArticles,
  getLatestArticles,
  getArticlesByCategory,
  categoryInfo,
} from "@/lib/data";
import FeaturedArticles from "@/components/featured-articles";
import ArticleCard from "@/components/article-card";
import CategoryPreview from "@/components/category-preview";
import HomeNewsletter from "@/components/home-newsletter"; // 👈 CHANGÉ ICI
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const latestArticles = getLatestArticles(6);

  // Get category previews
  const categoryPreviews = Object.keys(categoryInfo).map((key) => {
    const category = categoryInfo[key];
    const articles = getArticlesByCategory(category.slug, 4);
    return { category, articles };
  });

  return (
    <div className="pt-16">
      {/* Hero Section with Featured Articles SLIDER */}
      <section>
        <FeaturedArticles articles={featuredArticles} />
      </section>

      {/* Latest Articles Section */}
      <section className="py-16" id="articles">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Derniers Articles
            </h2>
            <Button asChild variant="outline">
              <Link href="/articles">Voir tous les articles</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Previews - show first 2 categories */}
      {categoryPreviews.slice(0, 2).map(({ category, articles }) => (
        <CategoryPreview
          key={category.slug}
          category={category}
          articles={articles}
        />
      ))}

      {/* Newsletter Section */}
      <HomeNewsletter />

      {/* More Category Previews - show remaining categories */}
      {categoryPreviews.slice(2).map(({ category, articles }) => (
        <CategoryPreview
          key={category.slug}
          category={category}
          articles={articles}
        />
      ))}
    </div>
  );
}
