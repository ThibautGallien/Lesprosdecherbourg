import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-white">
                Les Pros de Cherbourg
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Votre source d'information sur la technologie, la mode, les voyages,
              les loisirs et le bien-être.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categorie/technologie" className="text-gray-400 hover:text-white transition-colors">
                  Technologie
                </Link>
              </li>
              <li>
                <Link href="/categorie/mode-et-beaute" className="text-gray-400 hover:text-white transition-colors">
                  Mode et beauté
                </Link>
              </li>
              <li>
                <Link href="/categorie/voyage" className="text-gray-400 hover:text-white transition-colors">
                  Voyage
                </Link>
              </li>
              <li>
                <Link href="/categorie/loisirs" className="text-gray-400 hover:text-white transition-colors">
                  Loisirs
                </Link>
              </li>
              <li>
                <Link href="/categorie/sante-et-bien-etre" className="text-gray-400 hover:text-white transition-colors">
                  Santé et Bien-être
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="font-serif text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre adresse e-mail"
                className="bg-gray-800 border-gray-700"
                required
              />
              <Button className="w-full">S'abonner</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Les Pros de Cherbourg. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}