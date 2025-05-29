import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Building, Globe, Shield } from "lucide-react";

export default function MentionsLegalesPage() {
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
            <span className="text-gray-800">Mentions légales</span>
          </nav>
        </div>
      </div>

      {/* Header */}
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

            <div className="flex items-center mb-4">
              <Shield className="h-12 w-12 text-primary mr-4" />
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
                  Mentions légales
                </h1>
                <p className="text-gray-600 mt-2">
                  Informations légales et réglementaires
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {/* Éditeur du site */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Éditeur du site
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Raison sociale</h4>
                    <p className="text-gray-600">Les Pros de Cherbourg</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Adresse</h4>
                    <p className="text-gray-600">
                      Cherbourg-en-Cotentin
                      <br />
                      Normandie, France
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Contact</h4>
                    <p className="text-gray-600">
                      Email : contact@lesprosdecherbourg.fr
                      <br />
                      Téléphone : +33 (0)2 33 XX XX XX
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Directeur de la publication
                    </h4>
                    <p className="text-gray-600">
                      [Nom du directeur de publication]
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Hébergement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Hébergement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ce site est hébergé par :
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">[Nom de l&rsquo;hébergeur]</p>
                    <p className="text-gray-600">
                      [Adresse de l&rsquo;hébergeur]
                      <br />
                      [Code postal] [Ville], [Pays]
                      <br />
                      Téléphone : [Téléphone hébergeur]
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Propriété intellectuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Propriété intellectuelle</CardTitle>
                  <CardDescription>
                    Droits d&rsquo;auteur et conditions d&rsquo;utilisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    L&rsquo;ensemble de ce site relève de la législation
                    française et internationale sur le droit d&rsquo;auteur et
                    la propriété intellectuelle. Tous les droits de reproduction
                    sont réservés, y compris pour les documents téléchargeables
                    et les représentations iconographiques et photographiques.
                  </p>

                  <p>
                    La reproduction de tout ou partie de ce site sur un support
                    électronique quelconque est formellement interdite sauf
                    autorisation expresse du directeur de la publication.
                  </p>

                  <p>
                    Les marques et logos reproduits sur ce site sont déposés par
                    les sociétés qui en sont propriétaires.
                  </p>
                </CardContent>
              </Card>

              {/* Données personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle>Protection des données personnelles</CardTitle>
                  <CardDescription>
                    Conformité RGPD et droits des utilisateurs
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Conformément à la loi « Informatique et Libertés » du 6
                    janvier 1978 modifiée et au Règlement Général sur la
                    Protection des Données (RGPD), vous disposez des droits
                    suivants concernant vos données personnelles :
                  </p>

                  <ul className="list-disc pl-6 space-y-1">
                    <li>Droit d&rsquo;accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit d&rsquo;effacement</li>
                    <li>Droit de portabilité</li>
                    <li>Droit d&rsquo;opposition</li>
                    <li>Droit de limitation du traitement</li>
                  </ul>

                  <p>
                    Pour exercer ces droits, vous pouvez nous contacter à
                    l&rsquo;adresse :
                    <strong> contact@lesprosdecherbourg.fr</strong>
                  </p>

                  <p>
                    Pour plus d&rsquo;informations sur notre politique de
                    protection des données, consultez notre{" "}
                    <Link
                      href="/politique-confidentialite"
                      className="text-primary hover:underline"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des cookies</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Ce site utilise des cookies pour améliorer
                    l&rsquo;expérience utilisateur et réaliser des statistiques
                    de visite anonymes via Google Analytics.
                  </p>

                  <p>Les cookies utilisés sont :</p>

                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Cookies techniques</strong> : nécessaires au
                      fonctionnement du site
                    </li>
                    <li>
                      <strong>Cookies analytiques</strong> : pour mesurer
                      l&rsquo;audience (Google Analytics)
                    </li>
                    <li>
                      <strong>Cookies de préférences</strong> : pour mémoriser
                      vos choix
                    </li>
                  </ul>

                  <p>
                    Vous pouvez désactiver ces cookies dans les paramètres de
                    votre navigateur. Cependant, cela peut affecter le bon
                    fonctionnement du site.
                  </p>
                </CardContent>
              </Card>

              {/* Responsabilité */}
              <Card>
                <CardHeader>
                  <CardTitle>Limitation de responsabilité</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Les informations contenues sur ce site sont aussi précises
                    que possible et le site est mis à jour régulièrement, mais
                    peut toutefois contenir des inexactitudes ou des omissions.
                  </p>

                  <p>
                    Si vous constatez une lacune, erreur ou ce qui paraît être
                    un dysfonctionnement, merci de bien vouloir le signaler par
                    email en décrivant le problème de la manière la plus précise
                    possible.
                  </p>

                  <p>
                    Les Pros de Cherbourg ne pourra en aucun cas être tenu
                    responsable de tout dommage de quelque nature qu&rsquo;il
                    soit résultant de l&rsquo;interprétation ou de
                    l&rsquo;utilisation des informations et/ou documents
                    disponibles sur ce site.
                  </p>
                </CardContent>
              </Card>

              {/* Liens hypertextes */}
              <Card>
                <CardHeader>
                  <CardTitle>Liens hypertextes</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Les liens hypertextes mis en place dans le cadre du présent
                    site internet en direction d&rsquo;autres ressources
                    présentes sur le réseau Internet ne sauraient engager la
                    responsabilité des Pros de Cherbourg.
                  </p>

                  <p>
                    La création de liens vers ce site est autorisée sous réserve
                    qu&rsquo;ils ne soient pas utilisés à des fins commerciales
                    ou publicitaires et qu&rsquo;ils ne dénaturent pas le sens
                    des informations.
                  </p>
                </CardContent>
              </Card>

              {/* Droit applicable */}
              <Card>
                <CardHeader>
                  <CardTitle>Droit applicable et juridiction</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Tant le présent site que les modalités et conditions de son
                    utilisation sont régis par le droit français, quel que soit
                    le lieu d&rsquo;utilisation.
                  </p>

                  <p>
                    En cas de contestation éventuelle, et après l&rsquo;échec de
                    toute tentative de recherche d&rsquo;une solution amiable,
                    les tribunaux français seront seuls compétents pour
                    connaître de ce litige.
                  </p>

                  <p className="text-sm text-gray-500">
                    Dernière mise à jour :{" "}
                    {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-serif font-bold mb-4">
                Des questions sur ces mentions légales ?
              </h3>
              <p className="text-gray-600 mb-4">
                Si vous avez des questions concernant ces mentions légales ou
                nos pratiques en matière de données personnelles,
                n&rsquo;hésitez pas à nous contacter.
              </p>
              <Button asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: "Mentions légales | Les Pros de Cherbourg",
    description:
      "Mentions légales du site Les Pros de Cherbourg. Informations sur l'éditeur, l'hébergement, la propriété intellectuelle et la protection des données.",
  };
}
