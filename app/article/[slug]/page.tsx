import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";
import ArticleCard from "@/components/article-card";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: "Article non trouvé",
      description: "L'article que vous recherchez n'existe pas."
    };
  }
  
  return {
    title: `${article.title} - Les Pros de Cherbourg`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }
  
  const relatedArticles = getRelatedArticles(article, 3);
  
  return (
    <div className="pt-20 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href={`/categorie/${article.category}`}
            className="inline-block mb-4 text-sm font-medium px-3 py-1 bg-primary text-white rounded-full"
          >
            {article.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            {article.title}
          </h1>
          
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden mr-4 relative">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{article.author.name}</p>
              <p className="text-gray-500 text-sm">
                Publié le {format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          
          <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </header>
        
        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-xl lead">{article.excerpt}</p>
          
          {/* Example content */}
          <p>
            {article.content || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, 
            eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo 
            cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.`}
          </p>
          
          <p>
            Nam maximus augue a velit auctor, vel mollis massa tincidunt. 
            Maecenas ac luctus nisl, ut tincidunt nisl. Curabitur et dui nec nulla pharetra placerat. 
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
            Donec dapibus egestas turpis, id consectetur ligula vestibulum at.
          </p>
          
          <h2>Les points essentiels à retenir</h2>
          
          <ul>
            <li>Premier point important à prendre en compte</li>
            <li>Deuxième élément crucial pour bien comprendre</li>
            <li>Troisième aspect fondamental du sujet</li>
            <li>Dernier point mais non des moindres</li>
          </ul>
          
          <p>
            Proin vitae tincidunt neque. Cras at volutpat tellus. 
            Aenean sit amet velit in felis consectetur gravida. Mauris et ipsum nec nisl commodo lacinia. 
            Suspendisse auctor risus felis, et pretium dui sollicitudin in.
          </p>
          
          <h2>Conclusion</h2>
          
          <p>
            En résumé, il est important de considérer tous les aspects abordés dans cet article. 
            Que vous soyez novice ou expert dans le domaine, ces informations vous permettront 
            d'avoir une vision plus claire et complète du sujet.
          </p>
        </div>
        
        {/* Tags and Share */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-b py-4 mb-10">
          <div className="mb-4 sm:mb-0">
            <p className="font-medium mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Partager:</p>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline" aria-label="Partager sur Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Partager sur Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Partager sur LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" aria-label="Partager">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Author Bio */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden relative flex-shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{article.author.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {article.author.bio}
              </p>
              <Button size="sm" variant="outline">
                Voir tous ses articles
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Articles similaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}