// components/google-analytics.jsx
"use client";

import { useEffect } from "react";
import Script from "next/script";

const GoogleAnalytics = ({ measurementId }) => {
  useEffect(() => {
    // Configuration GA4 respectueuse du RGPD
    window.gtag?.("config", measurementId, {
      // Anonymisation IP (obligatoire RGPD)
      anonymize_ip: true,
      // Respect du DNT (Do Not Track)
      allow_google_signals: false,
      // Pas de remarketing par défaut
      allow_ad_personalization_signals: false,
      // Configuration initiale sans consentement
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  }, [measurementId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              analytics_storage: 'denied',
              ad_storage: 'denied',
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
