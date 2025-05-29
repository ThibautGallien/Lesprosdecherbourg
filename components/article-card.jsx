import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, User } from "lucide-react";
import PropTypes from "prop-types";

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link
        href={`/categorie/${article.category}/${article.slug}`}
        className="block"
      >
        <div className="relative h-48 w-full">
          <Image
            src={article.image || "/images/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
              {article.category
                ?.replace(/-/g, " ")
                ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Article"}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/categorie/${article.category}/${article.slug}`}>
          <h3 className="text-xl font-serif font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{article.author?.name || "Auteur"}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), "dd MMM yyyy", {
                locale: fr,
              })}
            </time>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/categorie/${article.category}/${article.slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Lire la suite
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    category: PropTypes.string,
    image: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    publishedAt: PropTypes.string.isRequired,
  }).isRequired,
};
