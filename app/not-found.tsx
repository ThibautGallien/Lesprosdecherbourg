import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page introuvable</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}