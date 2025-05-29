"use client";

import { useState } from "react";
import { Send, Check, AlertCircle } from "lucide-react";

export default function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Veuillez entrer un email valide");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "homepage_newsletter",
          tags: ["newsletter", "homepage"],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur newsletter:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Abonnez-vous à notre newsletter
          </h2>
          <p className="text-gray-600 mb-8">
            Recevez nos derniers articles et conseils directement dans votre
            boîte mail. Nous vous promettons de ne pas vous spammer !
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitted || isLoading}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isSubmitted || isLoading || !email}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full" />
                  Inscription...
                </>
              ) : isSubmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  Inscrit !
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  S&apos;abonner
                </>
              )}
            </button>
          </form>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {isSubmitted && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✅ Merci ! Vous êtes maintenant abonné à notre newsletter.
            </div>
          )}

          <p className="text-sm text-gray-500 mt-4">
            En vous inscrivant, vous acceptez notre{" "}
            <a
              href="/politique-confidentialite"
              className="underline hover:text-blue-600"
            >
              politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
