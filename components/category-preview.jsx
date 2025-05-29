import Link from "next/link";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import PropTypes from "prop-types";

export default function CategoryPreview({ category, articles }) {
  // Display at most 4 articles
  const displayArticles = articles.slice(0, 4);

  if (!displayArticles.length) return null;

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {category.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {category.description}
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link href={`/categorie/${category.slug}`}>
              Voir tous les articles
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

CategoryPreview.propTypes = {
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      publishedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};
