import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Article } from "@/types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "horizontal" | "minimal";
  className?: string;
}

export default function ArticleCard({ 
  article, 
  variant = "default",
  className
}: ArticleCardProps) {
  const isHorizontal = variant === "horizontal";
  const isMinimal = variant === "minimal";

  return (
    <article className={cn(
      "group overflow-hidden transition-all duration-300",
      isHorizontal && "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6",
      className
    )}>
      <div className={cn(
        "relative overflow-hidden rounded-lg aspect-video",
        isMinimal ? "aspect-[3/2]" : "aspect-[16/9]",
        isHorizontal ? "md:col-span-5" : "",
        (isHorizontal || isMinimal) ? "h-auto" : "h-48 md:h-56 lg:h-64"
      )}>
        <Link href={`/article/${article.slug}`}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <Link 
          href={`/categorie/${article.category}`}
          className="absolute top-2 left-2 z-10 text-xs font-medium px-2 py-1 bg-primary text-white rounded-full"
        >
          {article.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Link>
      </div>

      <div className={cn(
        "flex flex-col",
        isHorizontal ? "md:col-span-7" : "",
        isMinimal ? "mt-2" : "mt-4"
      )}>
        {!isMinimal && (
          <div className="flex items-center space-x-2 mb-2 text-sm text-gray-500">
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
            </time>
            <span>•</span>
            <span>{article.author.name}</span>
          </div>
        )}

        <h3 className={cn(
          "font-serif font-bold group-hover:text-primary transition-colors duration-300",
          isMinimal ? "text-base" : "text-xl md:text-2xl",
        )}>
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {!isMinimal && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        {isMinimal && (
          <div className="mt-1 text-sm text-gray-500">
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
            </time>
          </div>
        )}

        {!isMinimal && (
          <Link 
            href={`/article/${article.slug}`}
            className="text-primary font-medium mt-3 inline-flex items-center hover:underline"
          >
            Lire plus
          </Link>
        )}
      </div>
    </article>
  );
}