// config/sites.js - Version mono-site (Les Pros de Cherbourg uniquement)
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
  },
};

export const getSiteConfig = (siteId) => {
  return SITES_CONFIG[siteId] || null;
};

export const getAllSites = () => {
  return Object.values(SITES_CONFIG);
};

export const getDefaultSite = () => {
  return "les-pros-cherbourg";
};
