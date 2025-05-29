"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi (remplacez par votre logique d'envoi)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    });
  };

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
            <span className="text-gray-800">Contact</span>
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600">
              Une question, une suggestion ou envie de collaborer ? Nous sommes
              là pour vous écouter !
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Nos coordonnées
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">
                        contact@lesprosdecherbourg.fr
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Nous répondons sous 24h en moyenne
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-gray-600">+33 (0)2 33 XX XX XX</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Du lundi au vendredi, 9h-18h
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-gray-600">
                        Cherbourg-en-Cotentin
                        <br />
                        Normandie, France
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="mt-12">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    Questions fréquentes
                  </h3>

                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">
                        Comment proposer un article ?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Envoyez-nous votre proposition par email avec un résumé
                        de votre idée.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">
                        Puis-je republier vos articles ?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Contactez-nous pour discuter des conditions de
                        republication.
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">
                        Comment signaler une erreur ?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Utilisez le formulaire de contact en précisant
                        l&rsquo;article concerné.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Envoyez-nous un message</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire ci-dessous et nous vous
                      répondrons rapidement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-600 mb-2">
                          Message envoyé !
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Merci pour votre message. Nous vous répondrons dans
                          les plus brefs délais.
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          variant="outline"
                        >
                          Envoyer un autre message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Votre prénom"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Votre nom"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="votre@email.com"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="subject">Sujet</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Sujet de votre message"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Écrivez votre message ici..."
                            rows={6}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Envoyer le message
                            </>
                          )}
                        </Button>
                      </form>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                      En soumettant ce formulaire, vous acceptez notre{" "}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata() {
  return {
    title: "Contact | Les Pros de Cherbourg",
    description:
      "Contactez l'équipe des Pros de Cherbourg. Posez vos questions, proposez des sujets d'articles ou collaborez avec nous.",
  };
}
