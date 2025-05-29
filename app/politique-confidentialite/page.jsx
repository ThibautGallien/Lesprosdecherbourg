import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  AlertCircle,
  Download,
} from "lucide-react";

export default function PolitiqueConfidentialitePage() {
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
            <span className="text-gray-800">Politique de confidentialité</span>
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
                  Politique de confidentialité
                </h1>
                <p className="text-gray-600 mt-2">
                  Comment nous protégeons et utilisons vos données personnelles
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Conforme RGPD</Badge>
              <Badge variant="outline">
                Dernière MAJ : {new Date().toLocaleDateString("fr-FR")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Résumé */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Eye className="h-5 w-5 mr-2" />
                  En résumé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Nous collectons uniquement les données nécessaires au
                  fonctionnement de notre site et à l&rsquo;amélioration de nos
                  services. Vos données ne sont jamais vendues à des tiers et
                  vous gardez le contrôle total sur vos informations
                  personnelles.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-8">
              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle>Introduction</CardTitle>
                  <CardDescription>
                    Notre engagement envers la protection de vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Les Pros de Cherbourg s&rsquo;engage à protéger la
                    confidentialité et la sécurité de vos données personnelles.
                    Cette politique explique comment nous collectons, utilisons,
                    stockons et protégeons vos informations personnelles
                    conformément au Règlement Général sur la Protection des
                    Données (RGPD).
                  </p>

                  <p>
                    En utilisant notre site web, vous acceptez les pratiques
                    décrites dans cette politique de confidentialité.
                  </p>
                </CardContent>
              </Card>

              {/* Données collectées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Données que nous collectons
                  </CardTitle>
                  <CardDescription>
                    Types d&rsquo;informations personnelles recueillies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">
                        📝 Données que vous nous fournissez directement
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>
                          Nom et prénom (formulaire de contact, newsletter)
                        </li>
                        <li>
                          Adresse email (formulaire de contact, newsletter)
                        </li>
                        <li>Message ou contenu des communications</li>
                        <li>
                          Toute autre information que vous choisissez de
                          partager
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        📊 Données collectées automatiquement
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>
                          Adresse IP et informations de géolocalisation
                          approximative
                        </li>
                        <li>
                          Type de navigateur et système d&rsquo;exploitation
                        </li>
                        <li>Pages visitées et temps passé sur le site</li>
                        <li>Référent (site depuis lequel vous arrivez)</li>
                        <li>Cookies et technologies similaires</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        🍪 Cookies utilisés
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>
                          <strong>Cookies essentiels</strong> : fonctionnement
                          du site
                        </li>
                        <li>
                          <strong>Google Analytics</strong> : statistiques de
                          visite anonymes
                        </li>
                        <li>
                          <strong>Cookies de préférences</strong> : mémorisation
                          de vos choix
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Utilisation des données */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Comment nous utilisons vos données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Répondre à vos demandes</strong>
                        <p className="text-gray-600 text-sm">
                          Traiter vos messages via le formulaire de contact
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Newsletter et communications</strong>
                        <p className="text-gray-600 text-sm">
                          Vous envoyer nos derniers articles et actualités (avec
                          votre consentement)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Améliorer notre site</strong>
                        <p className="text-gray-600 text-sm">
                          Analyser l&rsquo;utilisation du site pour
                          l&rsquo;optimiser
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Obligations légales</strong>
                        <p className="text-gray-600 text-sm">
                          Respecter nos obligations légales et réglementaires
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Base légale */}
              <Card>
                <CardHeader>
                  <CardTitle>Base légale du traitement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Consentement
                      </h4>
                      <p className="text-sm text-blue-800">
                        Newsletter, cookies analytiques
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">
                        Intérêt légitime
                      </h4>
                      <p className="text-sm text-green-800">
                        Amélioration du site, sécurité
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Exécution contractuelle
                      </h4>
                      <p className="text-sm text-purple-800">
                        Réponse aux demandes de contact
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">
                        Obligation légale
                      </h4>
                      <p className="text-sm text-orange-800">
                        Conservation des logs, sécurité
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partage des données */}
              <Card>
                <CardHeader>
                  <CardTitle>Partage de vos données</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    <strong>
                      Nous ne vendons jamais vos données personnelles.
                    </strong>
                  </p>

                  <p>
                    Vos données peuvent être partagées uniquement dans les cas
                    suivants :
                  </p>

                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Prestataires de services</strong> : hébergement,
                      analytics (Google), email marketing (ActiveCampaign)
                    </li>
                    <li>
                      <strong>Obligations légales</strong> : si requis par la
                      loi ou les autorités
                    </li>
                    <li>
                      <strong>Protection de nos droits</strong> : en cas de
                      fraude ou d&rsquo;abus
                    </li>
                  </ul>

                  <p>
                    Tous nos prestataires sont soumis à des accords de
                    confidentialité stricts et respectent les standards
                    européens de protection des données.
                  </p>
                </CardContent>
              </Card>

              {/* Conservation */}
              <Card>
                <CardHeader>
                  <CardTitle>Durée de conservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">Messages de contact</h4>
                      <p className="text-gray-600 text-sm">
                        Conservés 3 ans après la dernière interaction
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">Abonnés newsletter</h4>
                      <p className="text-gray-600 text-sm">
                        Jusqu&rsquo;à désabonnement ou 3 ans d&rsquo;inactivité
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Données analytiques</h4>
                      <p className="text-gray-600 text-sm">
                        26 mois (Google Analytics)
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold">Logs techniques</h4>
                      <p className="text-gray-600 text-sm">12 mois maximum</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vos droits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Vos droits
                  </CardTitle>
                  <CardDescription>
                    Vous avez le contrôle sur vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        🔍 Droit d&rsquo;accès
                      </h4>
                      <p className="text-sm text-gray-600">
                        Connaître les données que nous détenons sur vous
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        ✏️ Droit de rectification
                      </h4>
                      <p className="text-sm text-gray-600">
                        Corriger des informations inexactes
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        🗑️ Droit d&rsquo;effacement
                      </h4>
                      <p className="text-sm text-gray-600">
                        Demander la suppression de vos données
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        📦 Droit de portabilité
                      </h4>
                      <p className="text-sm text-gray-600">
                        Récupérer vos données dans un format lisible
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        🚫 Droit d&rsquo;opposition
                      </h4>
                      <p className="text-sm text-gray-600">
                        Vous opposer au traitement de vos données
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">
                        ⏸️ Droit de limitation
                      </h4>
                      <p className="text-sm text-gray-600">
                        Limiter l&rsquo;utilisation de vos données
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm">
                      <strong>Pour exercer vos droits :</strong> contactez-nous
                      à<strong> contact@lesprosdecherbourg.fr</strong> en
                      précisant votre demande. Nous vous répondrons sous 30
                      jours.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité de vos données</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Nous mettons en œuvre des mesures techniques et
                    organisationnelles appropriées pour protéger vos données
                    personnelles contre :
                  </p>

                  <ul className="list-disc pl-6 space-y-1">
                    <li>L&rsquo;accès non autorisé</li>
                    <li>La divulgation accidentelle</li>
                    <li>La modification ou la destruction</li>
                    <li>La perte de données</li>
                  </ul>

                  <p>
                    Ces mesures incluent le chiffrement HTTPS, des mots de passe
                    sécurisés, des sauvegardes régulières et un accès limité aux
                    données personnelles.
                  </p>
                </CardContent>
              </Card>

              {/* Transferts internationaux */}
              <Card>
                <CardHeader>
                  <CardTitle>Transferts de données</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Certains de nos prestataires (Google Analytics,
                    ActiveCampaign) peuvent traiter vos données en dehors de
                    l&rsquo;Union Européenne. Dans ce cas, nous nous assurons
                    que :
                  </p>

                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Le pays bénéficie d&rsquo;une décision d&rsquo;adéquation
                      de la Commission européenne
                    </li>
                    <li>
                      Des garanties appropriées sont mises en place (clauses
                      contractuelles types)
                    </li>
                    <li>
                      Votre consentement explicite est obtenu si nécessaire
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Modifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Modifications de cette politique
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none">
                  <p>
                    Nous pouvons modifier cette politique de confidentialité
                    pour refléter les changements dans nos pratiques ou pour
                    d&rsquo;autres raisons opérationnelles, légales ou
                    réglementaires.
                  </p>

                  <p>
                    En cas de modification substantielle, nous vous en
                    informerons par email (si vous êtes abonné à notre
                    newsletter) ou par une notification visible sur notre site
                    web.
                  </p>

                  <p className="text-sm text-gray-500">
                    <strong>Dernière mise à jour :</strong>{" "}
                    {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>

              {/* Contact DPO */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact et réclamations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">
                        📧 Pour toute question sur vos données :
                      </h4>
                      <p className="text-gray-600">
                        contact@lesprosdecherbourg.fr
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold">
                        🏛️ Autorité de contrôle :
                      </h4>
                      <p className="text-gray-600">
                        Si vous estimez que vos droits ne sont pas respectés,
                        vous pouvez déposer une réclamation auprès de la CNIL
                        (Commission Nationale de l&rsquo;Informatique et des
                        Libertés).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact CTA */}
            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-serif font-bold mb-4">
                Des questions sur cette politique ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est à votre disposition pour répondre à toutes vos
                questions concernant la protection de vos données personnelles.
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
    title: "Politique de confidentialité | Les Pros de Cherbourg",
    description:
      "Notre politique de confidentialité détaille comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.",
  };
}
