"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PropTypes from "prop-types";

export default function FeaturedArticles({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fonctions de navigation simplifiées
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!articles.length || isPaused) return;

    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, articles.length, goToNext]);

  if (!articles.length) return null;

  return (
    <div
      className="relative overflow-hidden h-[500px] md:h-[600px] lg:h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Toutes les slides */}
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative w-full h-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
              <div className="container mx-auto">
                <div className="transform transition-all duration-500">
                  <Link
                    href={`/categorie/${article.category}`}
                    className="inline-block mb-2 text-xs md:text-sm font-medium px-3 py-1 bg-primary text-white rounded-full"
                  >
                    {article.category
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-2 md:mb-4">
                    <Link href={`/article/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-white/80 mb-4 max-w-2xl">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {article.author.name}
                      </p>
                      <p className="text-white/60 text-sm">
                        {format(new Date(article.publishedAt), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={`/article/${article.slug}`}>
                      Lire l&apos;article
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 z-10 flex items-center justify-center transition-colors"
        onClick={goToPrev}
        aria-label="Article précédent"
        type="button"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 z-10 flex items-center justify-center transition-colors"
        onClick={goToNext}
        aria-label="Article suivant"
        type="button"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            )}
            aria-label={`Aller à l'article ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

FeaturedArticles.propTypes = {
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
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      publishedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};
