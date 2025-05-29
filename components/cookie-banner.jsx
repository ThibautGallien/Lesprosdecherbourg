"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Settings,
  Shield,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setIsMounted(true);
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Afficher le bandeau après 2 secondes
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Éviter l'erreur d'hydratation
  if (!isMounted) {
    return null;
  }

  const handleAcceptAll = () => {
    const newPreferences = {
      essential: true,
      analytics: true,
      marketing: false, // Vous pouvez l'activer si besoin
    };

    savePreferences(newPreferences);
    setIsVisible(false);

    // Activer Google Analytics
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
      // Recharger pour activer GA
      window.location.reload();
    }
  };

  const handleRejectAll = () => {
    const newPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };

    savePreferences(newPreferences);
    setIsVisible(false);

    // Désactiver Google Analytics
    window["ga-disable-G-5S911D29Y9"] = true;
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setIsVisible(false);

    // Appliquer les préférences GA
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
      });

      if (preferences.analytics) {
        window.location.reload();
      } else {
        window["ga-disable-G-5S911D29Y9"] = true;
      }
    }
  };

  const savePreferences = (prefs) => {
    localStorage.setItem("cookieConsent", "configured");
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
  };

  const togglePreference = (key) => {
    if (key === "essential") return; // Toujours activé
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 p-4 animate-in slide-in-from-bottom-5 duration-300">
        <Card className="max-w-4xl mx-auto shadow-2xl border-2">
          <CardContent className="p-6">
            {!showSettings ? (
              // Bandeau principal
              <div className="flex flex-col lg:flex-row items-start gap-4">
                {/* Icône et texte */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Respect de votre vie privée
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        Conforme RGPD
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Nous utilisons des cookies pour améliorer votre expérience
                    de navigation et analyser notre trafic avec Google
                    Analytics. Ces données nous aident à comprendre comment vous
                    utilisez notre site pour mieux vous servir.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>🍪 Cookies essentiels : Toujours actifs</span>
                    <span>📊 Analytics : Amélioration du site</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Personnaliser
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectAll}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Refuser
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accepter tout
                  </Button>
                </div>
              </div>
            ) : (
              // Panneau de paramètres détaillé
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Paramètres des cookies
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Cookies essentiels */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium">Cookies essentiels</h4>
                        <Badge variant="secondary" size="sm">
                          Obligatoires
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nécessaires au bon fonctionnement du site (navigation,
                        sécurité).
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                        <div className="w-5 h-5 bg-white rounded-full ml-1 shadow"></div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium">Cookies analytiques</h4>
                        <Badge variant="outline" size="sm">
                          Google Analytics
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Nous aident à comprendre comment vous utilisez le site
                        (pages visitées, temps passé).
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => togglePreference("analytics")}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                          preferences.analytics ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.analytics
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline" size="sm" onClick={handleRejectAll}>
                    Refuser tout
                  </Button>

                  <Button size="sm" onClick={handleSavePreferences}>
                    Enregistrer mes préférences
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-gray-500">
                    En savoir plus sur notre{" "}
                    <Link
                      href="/politique-confidentialite"
                      className="text-primary hover:underline"
                    >
                      politique de confidentialité
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
