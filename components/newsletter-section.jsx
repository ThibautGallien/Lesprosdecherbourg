"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Abonnez-vous à notre newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Recevez nos derniers articles et conseils directement dans votre
            boîte mail. Nous vous promettons de ne pas vous spammer !
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
              disabled={isSubmitted || isLoading}
            />
            <Button
              type="submit"
              disabled={isSubmitted || isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full" />
                  Inscription...
                </span>
              ) : isSubmitted ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Inscrit !
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  S&apos;abonner
                </span>
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            En vous inscrivant, vous acceptez notre{" "}
            <a
              href="/politique-de-confidentialite"
              className="underline hover:text-primary"
            >
              politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
