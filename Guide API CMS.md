# Guide API CMS - Gestion Multi-Sites

## 🎯 Objectif

Ce document explique comment utiliser l'API du CMS personnalisé pour ajouter des articles et configurer de nouveaux sites.

## 📋 Table des matières

1. [Architecture de l'API](#architecture-de-lapi)
2. [Ajouter un article](#ajouter-un-article)
3. [Configurer un nouveau site](#configurer-un-nouveau-site)
4. [Authentification GitHub](#authentification-github)
5. [Endpoints disponibles](#endpoints-disponibles)
6. [Gestion des erreurs](#gestion-des-erreurs)

---

## 🏗️ Architecture de l'API

### Structure des routes

```
/api/cms/github/
├── route.js              # API principale (GET, POST, PUT, DELETE)
├── articles/route.js     # Liste des articles
├── article/[slug]/route.js # Article spécifique
├── save-article/route.js # Sauvegarde d'articles
└── delete-article/route.js # Suppression d'articles
```

### Authentification

L'API utilise un Bearer Token pour l'authentification :

```javascript
const headers = {
  Authorization: `Bearer ${process.env.CMS_API_KEY}`,
  "Content-Type": "application/json",
};
```

---

## ✍️ Ajouter un article

### 1. Préparer les données

```javascript
const articleData = {
  title: "Mon nouvel article",
  slug: "mon-nouvel-article",
  excerpt: "Description courte de l'article",
  content: "# Contenu en Markdown\n\nVotre contenu ici...",
  category: "technologie",
  image: "https://example.com/image.jpg",
  imageAlt: "Description de l'image",
  imageTitle: "Titre de l'image",
  author: {
    name: "Thibaut Gallien",
    avatar: "https://example.com/avatar.jpg",
  },
  publishedAt: "2025-06-01T10:00:00Z",
  draft: false,
  featured: false,
  tags: ["cms", "next.js", "github"],
  readingTime: 5,
  // Champs SEO
  seoTitle: "Titre optimisé SEO",
  seoDescription: "Meta description",
  seoKeywords: ["mot-clé1", "mot-clé2"],
};
```

### 2. Envoyer la requête

```javascript
// Créer un nouvel article
const response = await fetch(
  "/api/cms/github?action=article&siteId=les-pros-cherbourg",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  }
);

const result = await response.json();
console.log("Article créé:", result);
```

### 3. Mettre à jour un article existant

```javascript
// Modifier un article existant
const response = await fetch(
  "/api/cms/github?action=article&siteId=les-pros-cherbourg&slug=mon-article",
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  }
);
```

### 4. Structure du fichier généré

L'API génère automatiquement un fichier `.md` avec cette structure :

```markdown
---
title: "Mon nouvel article"
slug: "mon-nouvel-article"
excerpt: "Description courte de l'article"
image: "https://example.com/image.jpg"
imageAlt: "Description de l'image"
imageTitle: "Titre de l'image"
category: "technologie"
author:
  name: "Thibaut Gallien"
  avatar: "https://example.com/avatar.jpg"
publishedAt: "2025-06-01T10:00:00Z"
draft: false
featured: false
tags:
  - "cms"
  - "next.js"
  - "github"
readingTime: 5
seoTitle: "Titre optimisé SEO"
seoDescription: "Meta description"
seoKeywords:
  - "mot-clé1"
  - "mot-clé2"
---

# Contenu en Markdown

Votre contenu ici...
```

---

## 🌐 Configurer un nouveau site

### 1. Ajouter la configuration dans `config/sites.js`

```javascript
// Dans SITES_CONFIG, ajouter :
"mon-nouveau-site": {
  id: "mon-nouveau-site",
  name: "Mon Nouveau Site",
  domain: "mon-site.fr",
  repo: "ThibautGallien/mon-nouveau-site",
  branch: "main",
  logo: "/logos/mon-site.png",
  theme: {
    primary: "#3b82f6",
    secondary: "#64748b",
  },
  content: {
    articles: {
      folder: "content/articles",
      fields: [
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "slug", label: "Slug", type: "slug", required: true },
        { name: "excerpt", label: "Description", type: "textarea", required: true },
        { name: "image", label: "Image", type: "image" },
        { name: "category", label: "Catégorie", type: "select",
          options: ["tech", "lifestyle", "business"] },
        { name: "author", label: "Auteur", type: "object",
          fields: [
            { name: "name", label: "Nom", type: "text" },
            { name: "avatar", label: "Avatar", type: "image" }
          ]
        },
        { name: "publishedAt", label: "Date", type: "datetime" },
        { name: "draft", label: "Brouillon", type: "boolean", default: false },
        { name: "body", label: "Contenu", type: "markdown" },
        { name: "tags", label: "Tags", type: "array" }
      ]
    }
  },
  media: {
    folder: "public/images/uploads",
    publicPath: "/images/uploads"
  }
}
```

### 2. Préparer le repository GitHub

```bash
# Créer la structure de dossiers
mkdir -p content/articles
mkdir -p content/pages
mkdir -p public/images/uploads

# Créer un README.md
echo "# Mon Nouveau Site" > README.md

# Initialiser Git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ThibautGallien/mon-nouveau-site.git
git push -u origin main
```

### 3. Configurer les variables d'environnement

Dans `.env.local`, ajouter le token GitHub :

```env
GITHUB_TOKEN=ghp_votre_token_ici
CMS_API_KEY=votre-cle-api-cms
```

### 4. Tester la configuration

```javascript
// Tester la connexion au nouveau site
const response = await fetch(
  "/api/cms/github?action=test&siteId=mon-nouveau-site",
  {
    headers: {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    },
  }
);

const result = await response.json();
console.log("Test connexion:", result);
```

---

## 🔐 Authentification GitHub

### 1. Créer un Personal Access Token

1. Aller sur GitHub → Settings → Developer settings → Personal access tokens
2. Générer un nouveau token avec ces permissions :
   - `repo` (accès complet aux repositories)
   - `workflow` (pour les GitHub Actions si nécessaire)

### 2. Configurer les permissions

Le token doit avoir accès aux repositories que vous voulez gérer via le CMS.

### 3. Variables d'environnement requises

```env
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=ThibautGallien/repository-name
CMS_API_KEY=your-secure-api-key
CMS_USERNAME=admin
CMS_PASSWORD=your-secure-password
```

---

## 📡 Endpoints disponibles

### GET `/api/cms/github`

**Récupérer des données**

| Paramètre | Description                           | Requis |
| --------- | ------------------------------------- | ------ |
| `action`  | `articles`, `article`, `test`         | ✅     |
| `siteId`  | ID du site configuré                  | ✅     |
| `slug`    | Slug de l'article (si action=article) | ⚠️     |

```javascript
// Récupérer tous les articles
GET /api/cms/github?action=articles&siteId=les-pros-cherbourg

// Récupérer un article spécifique
GET /api/cms/github?action=article&siteId=les-pros-cherbourg&slug=mon-article

// Tester la connexion
GET /api/cms/github?action=test&siteId=les-pros-cherbourg
```

### POST `/api/cms/github`

**Créer un nouvel article**

```javascript
POST /api/cms/github?action=article&siteId=les-pros-cherbourg
Content-Type: application/json
Authorization: Bearer your-api-key

{
  "title": "Nouveau titre",
  "slug": "nouveau-slug",
  "content": "Contenu markdown...",
  // ... autres champs
}
```

### PUT `/api/cms/github`

**Mettre à jour un article**

```javascript
PUT /api/cms/github?action=article&siteId=les-pros-cherbourg&slug=article-slug
Content-Type: application/json
Authorization: Bearer your-api-key

{
  "title": "Titre modifié",
  // ... champs à modifier
}
```

### DELETE `/api/cms/github`

**Supprimer un article**

```javascript
DELETE /api/cms/github?action=article&siteId=les-pros-cherbourg&path=content/articles/mon-article.md
Authorization: Bearer your-api-key
```

---

## ⚠️ Gestion des erreurs

### Codes de réponse

| Code | Signification         | Action                  |
| ---- | --------------------- | ----------------------- |
| 200  | Succès                | ✅                      |
| 400  | Données manquantes    | Vérifier les paramètres |
| 401  | Non autorisé          | Vérifier l'API key      |
| 404  | Ressource non trouvée | Vérifier le slug/path   |
| 500  | Erreur serveur        | Vérifier les logs       |

### Exemple de gestion d'erreur

```javascript
try {
  const response = await fetch(
    "/api/cms/github?action=article&siteId=mon-site",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(articleData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur ${response.status}: ${error.message}`);
  }

  const result = await response.json();
  console.log("Succès:", result);
} catch (error) {
  console.error("Erreur:", error.message);
  // Gérer l'erreur selon le contexte
}
```

### Validation des données

Avant d'envoyer un article, validez les champs obligatoires :

```javascript
function validateArticle(data) {
  const required = ["title", "slug", "content", "category"];
  const missing = required.filter((field) => !data[field]);

  if (missing.length > 0) {
    throw new Error(`Champs manquants: ${missing.join(", ")}`);
  }

  // Validation du slug
  if (!/^[a-z0-9-]+$/.test(data.slug)) {
    throw new Error(
      "Le slug ne peut contenir que des lettres, chiffres et tirets"
    );
  }

  return true;
}
```

---

## 🚀 Exemples complets

### Créer un article pour Dormesia

```javascript
const dormsiaArticle = {
  title: "Les bienfaits de la mélatonine pour le sommeil",
  slug: "bienfaits-melatonine-sommeil",
  excerpt:
    "Découvrez comment la mélatonine peut améliorer la qualité de votre sommeil naturellement.",
  content: `# Les bienfaits de la mélatonine

La mélatonine est une hormone naturelle...`,
  category: "science-sommeil",
  image: "https://images.pexels.com/photos/sleeping.jpg",
  imageAlt: "Personne dormant paisiblement",
  author: {
    name: "Dr. Sophie Martin",
    avatar: "/images/team/dr-martin.jpg",
  },
  publishedAt: new Date().toISOString(),
  draft: false,
  featured: true,
  tags: ["mélatonine", "sommeil", "santé"],
  readingTime: 7,
  seoTitle: "Mélatonine : Guide complet pour mieux dormir",
  seoDescription:
    "Tout savoir sur la mélatonine, ses bienfaits pour le sommeil et comment l'utiliser en toute sécurité.",
  seoKeywords: ["mélatonine", "sommeil", "insomnie", "hormone du sommeil"],
};

// Envoyer à l'API
const response = await fetch("/api/cms/github?action=article&siteId=dormesia", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(dormsiaArticle),
});
```

### Ajouter un site e-commerce

```javascript
// Dans config/sites.js
"boutique-en-ligne": {
  id: "boutique-en-ligne",
  name: "Ma Boutique en Ligne",
  domain: "boutique.fr",
  repo: "ThibautGallien/boutique",
  branch: "main",
  content: {
    articles: {
      folder: "content/blog",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "slug", type: "slug", required: true },
        { name: "excerpt", type: "textarea" },
        { name: "content", type: "markdown" },
        { name: "category", type: "select",
          options: ["actualites", "guides", "conseils"] },
        { name: "featuredProduct", type: "text",
          helper: "ID du produit mis en avant" }
      ]
    },
    products: {
      folder: "content/products",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "price", type: "number", required: true },
        { name: "description", type: "markdown" },
        { name: "images", type: "array" },
        { name: "category", type: "select",
          options: ["vetements", "accessoires", "chaussures"] }
      ]
    }
  }
}
```

---

## 📝 Notes importantes

1. **Sécurité** : Ne jamais exposer les tokens GitHub côté client
2. **Rate limiting** : GitHub limite à 5000 requêtes/heure
3. **Backup** : Les données sont stockées sur GitHub (versioning automatique)
4. **Performance** : Utiliser la mise en cache pour les lectures fréquentes
5. **Monitoring** : Surveiller les logs d'erreur pour détecter les problèmes

---

## 🔧 Dépannage

### Problème : "Article non trouvé"

- Vérifier que le slug correspond exactement
- S'assurer que le fichier existe dans le bon dossier

### Problème : "Erreur 401 Unauthorized"

- Vérifier que le token GitHub est valide
- Contrôler que l'API key est correcte

### Problème : "Erreur 404 Repository"

- Vérifier que le repository existe
- S'assurer que le token a accès au repository

Pour plus d'aide, consulter les logs de l'application ou contacter l'équipe de développement.
