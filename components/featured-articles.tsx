"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Article } from "@/types";

interface FeaturedArticlesProps {
  articles: Article[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, 6000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, currentIndex]);

  const currentArticle = articles[currentIndex];

  if (!articles.length) return null;

  return (
    <div 
      className="relative overflow-hidden h-[500px] md:h-[600px] lg:h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={currentArticle.image}
              alt={currentArticle.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
              <div className="container mx-auto">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Link 
                    href={`/categorie/${currentArticle.category}`}
                    className="inline-block mb-2 text-xs md:text-sm font-medium px-3 py-1 bg-primary text-white rounded-full"
                  >
                    {currentArticle.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Link>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-2 md:mb-4">
                    <Link href={`/article/${currentArticle.slug}`}>
                      {currentArticle.title}
                    </Link>
                  </h2>
                  
                  <p className="text-white/80 mb-4 max-w-2xl">
                    {currentArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative">
                      <Image
                        src={currentArticle.author.avatar}
                        alt={currentArticle.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{currentArticle.author.name}</p>
                      <p className="text-white/60 text-sm">
                        {format(new Date(currentArticle.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <Link href={`/article/${currentArticle.slug}`}>
                      Lire l'article
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
        onClick={handlePrev}
        aria-label="Article précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
        onClick={handleNext}
        aria-label="Article suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            )}
            aria-label={`Aller à l'article ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}