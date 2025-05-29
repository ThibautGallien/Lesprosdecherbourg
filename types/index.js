// types/index.js - Constantes pour remplacer les types TypeScript

export const CATEGORIES = [
  "technologie",
  "mode-et-beaute",
  "voyage",
  "loisirs",
  "sante-et-bien-etre",
];

export const ARTICLE_SHAPE = {
  id: "string",
  title: "string",
  slug: "string",
  excerpt: "string",
  content: "string",
  category: "string",
  image: "string",
  author: {
    id: "string",
    name: "string",
    avatar: "string",
    bio: "string",
  },
  publishedAt: "string",
  featured: "boolean",
  tags: "array",
};

export const CATEGORY_SHAPE = {
  slug: "string",
  name: "string",
  description: "string",
};

export const AUTHOR_SHAPE = {
  id: "string",
  name: "string",
  avatar: "string",
  bio: "string",
};
