import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getArticlesByCategory, categoryInfo } from "@/lib/data";
import ArticleCard from "@/components/article-card";
import Link from "next/link";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categoryInfo[params.slug];
  
  if (!category) {
    return {
      title: "Catégorie non trouvée",
      description: "La catégorie que vous recherchez n'existe pas."
    };
  }
  
  return {
    title: `${category.name} - Les Pros de Cherbourg`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Les Pros de Cherbourg`,
      description: category.description,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categoryInfo[slug];
  
  if (!category) {
    notFound();
  }
  
  const articles = getArticlesByCategory(category.slug);
  
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>
          <div className="flex justify-center space-x-2">
            {Object.values(categoryInfo).map((cat) => (
              <Button 
                key={cat.slug} 
                variant={cat.slug === category.slug ? "default" : "outline"}
                asChild
                size="sm"
              >
                <Link href={`/categorie/${cat.slug}`}>
                  {cat.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Aucun article dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}