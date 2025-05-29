import { notFound } from "next/navigation";
import Link from "next/link";
import { categoryInfo, getArticlesByCategory } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/article-card";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({ params }) {
  const { category: categorySlug } = params;

  // Vérifier que la catégorie existe
  const category = Object.values(categoryInfo).find(
    (cat) => cat.slug === categorySlug
  );

  if (!category) {
    notFound();
  }

  // Récupérer les articles de cette catégorie
  const articles = getArticlesByCategory(categorySlug);

  return (
    <div className="pt-16">
      {/* Navigation breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-800">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-gray-800">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button asChild variant="outline" className="mb-6">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l&rsquo;accueil
              </Link>
            </Button>

            {/* Category Info */}
            <div className="flex items-center mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mr-4`}
                style={{ backgroundColor: getCategoryBg(category.color) }}
              >
                <div
                  className={`w-8 h-8 rounded-full`}
                  style={{ backgroundColor: getCategoryColor(category.color) }}
                ></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                  {category.name}
                </h1>
                <Badge variant="secondary" className="mt-2">
                  {articles.length} article{articles.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <p className="text-xl text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}
                    style={{ backgroundColor: getCategoryBg(category.color) }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full`}
                      style={{
                        backgroundColor: getCategoryColor(category.color),
                      }}
                    ></div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-4">
                    Aucun article dans cette catégorie
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Cette catégorie ne contient pas encore d&rsquo;articles.
                    Revenez bientôt pour découvrir nos nouveaux contenus !
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/">Retour à l&rsquo;accueil</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/contact">Nous contacter</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Categories */}
      {articles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">
                Découvrez nos autres catégories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(categoryInfo)
                  .filter((cat) => cat.slug !== categorySlug)
                  .slice(0, 4)
                  .map((otherCategory) => (
                    <Link
                      key={otherCategory.slug}
                      href={`/${otherCategory.slug}`}
                      className="group block"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}
                          style={{
                            backgroundColor: getCategoryBg(otherCategory.color),
                          }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full`}
                            style={{
                              backgroundColor: getCategoryColor(
                                otherCategory.color
                              ),
                            }}
                          ></div>
                        </div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {otherCategory.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      {articles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                Ne manquez aucun article sur {category.name.toLowerCase()}
              </h2>
              <p className="text-gray-600 mb-6">
                Abonnez-vous à notre newsletter pour recevoir nos dernières
                publications
              </p>
              <Button asChild>
                <Link href="/contact">S&rsquo;abonner à la newsletter</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Fonction utilitaire pour les couleurs (évite les classes Tailwind dynamiques)
function getCategoryBg(color) {
  const colors = {
    blue: "#dbeafe",
    pink: "#fce7f3",
    green: "#dcfce7",
    purple: "#e9d5ff",
    orange: "#fed7aa",
  };
  return colors[color] || "#f3f4f6";
}

function getCategoryColor(color) {
  const colors = {
    blue: "#3b82f6",
    pink: "#ec4899",
    green: "#22c55e",
    purple: "#a855f7",
    orange: "#f97316",
  };
  return colors[color] || "#6b7280";
}

// Génération des métadonnées
export function generateMetadata({ params }) {
  const { category: categorySlug } = params;

  const category = Object.values(categoryInfo).find(
    (cat) => cat.slug === categorySlug
  );

  if (!category) {
    return {
      title: "Catégorie non trouvée",
    };
  }

  const articles = getArticlesByCategory(categorySlug);

  return {
    title: `${category.name} | Les Pros de Cherbourg`,
    description: `${category.description}. Découvrez nos ${
      articles.length
    } article${
      articles.length > 1 ? "s" : ""
    } sur ${category.name.toLowerCase()}.`,
    openGraph: {
      title: category.name,
      description: category.description,
      type: "website",
    },
  };
}
