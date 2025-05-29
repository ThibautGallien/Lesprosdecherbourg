import ContactPageClient from "@/components/contact-page-client";

export default function Contact() {
  return <ContactPageClient />;
}

export function generateMetadata() {
  return {
    title: "Contact | Les Pros de Cherbourg",
    description:
      "Contactez l'équipe des Pros de Cherbourg. Posez vos questions, proposez des sujets d'articles ou collaborez avec nous.",
    openGraph: {
      title: "Contact | Les Pros de Cherbourg",
      description:
        "Contactez l'équipe des Pros de Cherbourg. Posez vos questions, proposez des sujets d'articles ou collaborez avec nous.",
      type: "website",
    },
  };
}
