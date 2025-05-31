// config/sites.js
export const SITES_CONFIG = {
  "les-pros-cherbourg": {
    id: "les-pros-cherbourg",
    name: "Les Pros de Cherbourg",
    domain: "lesprosdecherbourg.fr",
    repo: "ThibautGallien/Lesprosdecherbourg",
    branch: "main",
    logo: "/logos/les-pros-cherbourg.png",
    theme: {
      primary: "#2563eb",
      secondary: "#64748b",
    },
    content: {
      articles: {
        folder: "content/articles",
        fields: [
          { name: "title", label: "Titre", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true },
          {
            name: "excerpt",
            label: "Description courte",
            type: "textarea",
            required: true,
          },
          { name: "image", label: "Image principale", type: "image" },
          {
            name: "category",
            label: "Catégorie",
            type: "select",
            options: [
              "technologie",
              "mode-et-beaute",
              "voyage",
              "loisirs",
              "sante-et-bien-etre",
            ],
          },
          {
            name: "author",
            label: "Auteur",
            type: "object",
            fields: [
              { name: "name", label: "Nom", type: "text" },
              { name: "avatar", label: "Avatar", type: "image" },
            ],
          },
          {
            name: "publishedAt",
            label: "Date de publication",
            type: "datetime",
          },
          {
            name: "draft",
            label: "Brouillon",
            type: "boolean",
            default: false,
          },
          { name: "body", label: "Contenu", type: "markdown" },
          { name: "tags", label: "Tags", type: "array" },
          {
            name: "readingTime",
            label: "Temps de lecture (min)",
            type: "number",
            min: 1,
            max: 30,
          },
        ],
      },
      pages: {
        folder: "content/pages",
        files: [
          {
            name: "about",
            label: "À propos",
            file: "content/pages/about.md",
            fields: [
              { name: "title", label: "Titre", type: "text" },
              { name: "body", label: "Contenu", type: "markdown" },
            ],
          },
          {
            name: "contact",
            label: "Contact",
            file: "content/pages/contact.md",
            fields: [
              { name: "title", label: "Titre", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Téléphone", type: "text" },
              { name: "address", label: "Adresse", type: "textarea" },
              { name: "body", label: "Contenu", type: "markdown" },
            ],
          },
        ],
      },
    },
    media: {
      folder: "public/images/uploads",
      publicPath: "/images/uploads",
    },
  }, // ✅ VIRGULE AJOUTÉE ICI

  // Configuration Dormesia
  "dormesia": {
    id: "dormesia",
    name: "Dormesia - Expert du Sommeil",
    domain: "dormesia.vercel.app", // ✅ CORRIGÉ (.com → .vercel.app)
    repo: "ThibautGallien/Dormesia", // ✅ CORRIGÉ (dormesia → Dormesia)
    branch: "main",
    logo: "/logos/dormesia.png",
    theme: {
      primary: "#4f46e5",
      secondary: "#6366f1",
    },
    content: {
      articles: {
        folder: "content/articles",
        fields: [
          { name: "title", label: "Titre", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true },
          { 
            name: "excerpt", 
            label: "Description courte (SEO)", 
            type: "textarea", 
            required: true,
            maxLength: 160 
          },
          { name: "image", label: "Image principale", type: "image" },
          { name: "imageAlt", label: "Texte alternatif image", type: "text" },
          { name: "imageTitle", label: "Titre image", type: "text" },
          {
            name: "category",
            label: "Catégorie",
            type: "select",
            options: [
              "science-sommeil",
              "bien-etre", 
              "conseils-pratiques",
              "nutrition",
              "sante",
              "relaxation"
            ],
            required: true
          },
          {
            name: "author",
            label: "Auteur",
            type: "object",
            fields: [
              { name: "name", label: "Nom", type: "text", default: "Équipe Dormesia" },
              { name: "avatar", label: "Avatar", type: "image", default: "/images/team/default.jpg" },
            ],
          },
          {
            name: "publishedAt",
            label: "Date de publication",
            type: "datetime",
            default: () => new Date().toISOString()
          },
          {
            name: "draft",
            label: "Brouillon",
            type: "boolean",
            default: false,
          },
          {
            name: "featured",
            label: "Article mis en avant",
            type: "boolean", 
            default: false,
          },
          { name: "body", label: "Contenu", type: "markdown", required: true },
          { name: "tags", label: "Tags", type: "array" },
          {
            name: "readingTime",
            label: "Temps de lecture (min)",
            type: "number",
            min: 1,
            max: 30,
            default: 5
          },
          // Champs SEO spécifiques
          { 
            name: "seoTitle", 
            label: "Titre SEO (Title Tag)", 
            type: "text",
            maxLength: 60,
            helper: "Optimal : 50-60 caractères"
          },
          { 
            name: "seoDescription", 
            label: "Meta Description", 
            type: "textarea",
            maxLength: 160,
            helper: "Optimal : 150-160 caractères"
          },
          { 
            name: "seoKeywords", 
            label: "Mots-clés SEO", 
            type: "array",
            helper: "3-5 mots-clés principaux"
          },
        ],
      },
      pages: {
        folder: "content/pages",
        files: [
          {
            name: "about",
            label: "À propos",
            file: "content/pages/about.md",
            fields: [
              { name: "title", label: "Titre", type: "text" },
              { name: "description", label: "Description SEO", type: "textarea" },
              { name: "body", label: "Contenu", type: "markdown" },
            ],
          },
          {
            name: "contact", 
            label: "Contact",
            file: "content/pages/contact.md",
            fields: [
              { name: "title", label: "Titre", type: "text" },
              { name: "email", label: "Email", type: "email", default: "contact@dormesia.com" },
              { name: "phone", label: "Téléphone", type: "text", default: "+33 1 23 45 67 89" },
              { name: "address", label: "Adresse", type: "textarea", default: "123 Avenue du Sommeil\n75001 Paris, France" },
              { name: "body", label: "Contenu", type: "markdown" },
            ],
          },
        ],
      },
    },
    media: {
      folder: "public/images/uploads",
      publicPath: "/images/uploads",
    },
  },

  // Template pour vos autres sites
  "site-2": {
    id: "site-2",
    name: "Votre Site #2",
    domain: "exemple-site2.fr",
    repo: "ThibautGallien/site-2",
    branch: "main",
    logo: "/logos/site-2.png",
    theme: {
      primary: "#10b981",
      secondary: "#6b7280",
    },
    content: {
      articles: {
        folder: "content/posts",
        fields: [
          { name: "title", label: "Titre", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true },
          { name: "content", label: "Contenu", type: "markdown" },
        ],
      },
    },
    media: {
      folder: "public/uploads",
      publicPath: "/uploads",
    },
  },

  "site-3": {
    id: "site-3",
    name: "Votre Site #3",
    domain: "exemple-site3.fr",
    repo: "ThibautGallien/site-3",
    branch: "main",
    logo: "/logos/site-3.png",
    theme: {
      primary: "#f59e0b",
      secondary: "#6b7280",
    },
    content: {
      articles: {
        folder: "content/blog",
        fields: [
          { name: "title", label: "Titre", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true },
          { name: "content", label: "Contenu", type: "markdown" },
        ],
      },
    },
    media: {
      folder: "public/media",
      publicPath: "/media",
    },
  },

  "wordpress-migration": {
    id: "wordpress-migration",
    name: "Site WordPress à Migrer",
    domain: "ancien-wordpress.fr",
    repo: "ThibautGallien/wordpress-migration",
    branch: "main",
    logo: "/logos/wordpress-migration.png",
    theme: {
      primary: "#dc2626",
      secondary: "#6b7280",
    },
    content: {
      articles: {
        folder: "content/articles",
        fields: [
          { name: "title", label: "Titre", type: "text", required: true },
          { name: "slug", label: "Slug", type: "slug", required: true },
          { name: "excerpt", label: "Extrait", type: "textarea" },
          { name: "content", label: "Contenu", type: "markdown" },
          {
            name: "featuredImage",
            label: "Image mise en avant",
            type: "image",
          },
          {
            name: "publishedAt",
            label: "Date de publication",
            type: "datetime",
          },
        ],
      },
    },
    media: {
      folder: "public/wp-content/uploads",
      publicPath: "/wp-content/uploads",
    },
  },
}; // ✅ ACCOLADE ET POINT-VIRGULE AJOUTÉS

export const getSiteConfig = (siteId) => {
  return SITES_CONFIG[siteId] || null;
};

export const getAllSites = () => {
  return Object.values(SITES_CONFIG);
};

export const getDefaultSite = () => {
  return "les-pros-cherbourg";
};
