# Documentation Technique - Les Pros de Cherbourg

## 🎯 Vue d'ensemble du projet

**Les Pros de Cherbourg** est un CMS multi-sites développé avec Next.js qui permet de gérer plusieurs blogs/sites web depuis une interface unique. Le projet utilise GitHub comme backend de stockage et propose un système d'authentification sécurisé.

## 📋 Table des matières

1. [Architecture générale](#architecture-générale)
2. [Structure des dossiers](#structure-des-dossiers)
3. [Technologies utilisées](#technologies-utilisées)
4. [Configuration et déploiement](#configuration-et-déploiement)
5. [Composants principaux](#composants-principaux)
6. [Système de routage](#système-de-routage)
7. [Gestion des données](#gestion-des-données)
8. [CMS Personnalisé](#cms-personnalisé)
9. [SEO et Performance](#seo-et-performance)
10. [Maintenance et évolution](#maintenance-et-évolution)

---

## 🏗️ Architecture générale

### Stack technique

```
Frontend: Next.js 15 + React 18
Styling: Tailwind CSS + shadcn/ui
Backend: API Routes (Next.js)
Stockage: GitHub (via API)
Authentification: JWT + GitHub OAuth
Déploiement: Vercel/Netlify
```

### Schéma d'architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│   API Routes    │───▶│   GitHub API    │
│   (Frontend)    │    │   (Backend)     │    │   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   shadcn/ui     │    │   Middleware    │    │   Markdown      │
│   Components    │    │   Auth & CORS   │    │   Files (.md)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📁 Structure des dossiers

```
lesprosdecherbourg/
├── app/                          # App Router (Next.js 13+)
│   ├── [category]/              # Pages de catégories dynamiques
│   │   ├── [slug]/page.jsx     # Pages d'articles
│   │   └── page.jsx            # Liste des articles par catégorie
│   ├── admin/                   # Interface d'administration
│   │   └── page.jsx            # Dashboard CMS
│   ├── api/                     # API Routes
│   │   ├── cms/                # API du CMS personnalisé
│   │   ├── auth/               # Authentification
│   │   ├── newsletter/         # Gestion newsletter
│   │   └── upload/             # Upload de fichiers
│   ├── contact/                # Page de contact
│   ├── mentions-legales/       # Mentions légales
│   ├── politique-confidentialite/ # RGPD
│   ├── globals.css             # Styles globaux
│   ├── layout.jsx              # Layout principal
│   ├── not-found.jsx           # Page 404
│   ├── page.jsx                # Page d'accueil
│   └── sitemap.js              # Génération sitemap
├── components/                  # Composants réutilisables
│   ├── cms/                    # Composants du CMS
│   │   ├── ArticleEditor.js    # Éditeur d'articles
│   │   └── CMSDashboard.js     # Dashboard principal
│   ├── ui/                     # Composants shadcn/ui
│   ├── article-card.jsx        # Carte d'article
│   ├── category-preview.jsx    # Aperçu de catégorie
│   ├── cookie-banner.jsx       # Bandeau cookies RGPD
│   ├── featured-articles.jsx   # Slider articles vedettes
│   ├── footer.jsx              # Pied de page
│   ├── google-analytics.jsx    # Integration GA4
│   ├── header.jsx              # En-tête navigation
│   └── home-newsletter.jsx     # Section newsletter
├── config/                     # Configuration
│   └── sites.js               # Configuration multi-sites
├── content/                    # Contenu statique
│   └── articles/              # Articles en Markdown
├── hooks/                      # Hooks React personnalisés
│   └── use-toast.js           # Hook pour notifications
├── lib/                        # Bibliothèques utilitaires
│   ├── cms.js                 # Gestion du CMS local
│   ├── data.js                # Gestion des données
│   ├── github.js              # API GitHub
│   └── utils.js               # Utilitaires généraux
├── public/                     # Fichiers statiques
│   ├── admin/                 # Interface Decap CMS
│   ├── images/                # Images du site
│   └── robots.txt             # Configuration SEO
├── styles/                     # Styles CSS
├── types/                      # Définitions de types
├── .env.local                 # Variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
├── components.json            # Configuration shadcn/ui
├── jsconfig.json              # Configuration JavaScript
├── next.config.js             # Configuration Next.js
├── package.json               # Dépendances npm
├── postcss.config.js          # Configuration PostCSS
└── tailwind.config.js         # Configuration Tailwind
```

---

## 🛠️ Technologies utilisées

### Frontend

| Technologie       | Version | Usage                       |
| ----------------- | ------- | --------------------------- |
| **Next.js**       | 15.3.2  | Framework React, App Router |
| **React**         | 18.2.0  | Interface utilisateur       |
| **Tailwind CSS**  | 3.3.3   | Styling et design           |
| **shadcn/ui**     | Latest  | Composants UI modernes      |
| **Framer Motion** | 11.0.20 | Animations                  |
| **Lucide React**  | 0.446.0 | Icônes                      |

### Backend & Données

| Technologie     | Version | Usage                  |
| --------------- | ------- | ---------------------- |
| **GitHub API**  | v3      | Stockage des articles  |
| **Gray Matter** | 4.0.3   | Parsing front matter   |
| **js-yaml**     | 4.1.0   | Gestion YAML           |
| **date-fns**    | 3.6.0   | Manipulation des dates |

### Outils et Utilitaires

| Technologie   | Version | Usage                |
| ------------- | ------- | -------------------- |
| **ESLint**    | 8.49.0  | Linting du code      |
| **PostCSS**   | 8.5.4   | Traitement CSS       |
| **PropTypes** | 15.8.1  | Validation des props |

---

## ⚙️ Configuration et déploiement

### Variables d'environnement

Créer un fichier `.env.local` :

```env
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=ThibautGallien/Lesprosdecherbourg

# CMS Authentication
CMS_API_KEY=your-secure-api-key-here
CMS_USERNAME=admin
CMS_PASSWORD=your-secure-password

# ActiveCampaign (Newsletter)
ACTIVECAMPAIGN_BASE_URL=https://youraccoun.api-us1.com
ACTIVECAMPAIGN_API_KEY=your-api-key
ACTIVECAMPAIGN_LIST_ID=your-list-id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://lesprosdecherbourg.fr
NEXTAUTH_URL=https://lesprosdecherbourg.fr
```

### Installation

```bash
# Cloner le repository
git clone https://github.com/ThibautGallien/Lesprosdecherbourg.git
cd Lesprosdecherbourg

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Lancer en développement
npm run dev

# Build pour production
npm run build
npm start
```

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur Vercel
vercel env add GITHUB_TOKEN
vercel env add CMS_API_KEY
# ... etc
```

---

## 🧩 Composants principaux

### 1. Layout Principal (`app/layout.jsx`)

```javascript
// Structure générale de l'application
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <GoogleAnalytics measurementId="G-5S911D29Y9" />
        <CookieBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Responsabilités :**

- Configuration des fonts (Inter + Playfair Display)
- Métadonnées SEO globales
- Integration Google Analytics
- Bandeau cookies RGPD
- Structure HTML de base

### 2. Header (`components/header.jsx`)

**Fonctionnalités :**

- Navigation responsive
- Menu mobile avec animations
- Barre de recherche intégrée
- Scroll detection pour styling
- Masquage automatique sur pages admin

### 3. Dashboard CMS (`components/cms/CMSDashboard.js`)

**Fonctionnalités :**

- Interface d'administration complète
- Gestion multi-sites
- CRUD articles complet
- Filtres et recherche
- Statistiques en temps réel
- Interface responsive

### 4. Éditeur d'articles (`components/cms/ArticleEditor.js`)

**Fonctionnalités :**

- Éditeur Markdown avec preview
- Gestion des métadonnées SEO
- Upload d'images avec optimisation
- Système de tags et catégories
- Validation en temps réel
- Onglets organisés (Contenu, SEO, Images, Paramètres)

### 5. Articles vedettes (`components/featured-articles.jsx`)

**Fonctionnalités :**

- Slider automatique avec contrôles
- Images optimisées avec Next.js Image
- Animations fluides avec Framer Motion
- Navigation par points
- Responsive design

---

## 🛣️ Système de routage

### Routes publiques

| Route                        | Composant                                | Description                      |
| ---------------------------- | ---------------------------------------- | -------------------------------- |
| `/`                          | `app/page.jsx`                           | Page d'accueil                   |
| `/[category]`                | `app/[category]/page.jsx`                | Liste des articles par catégorie |
| `/[category]/[slug]`         | `app/[category]/[slug]/page.jsx`         | Article individuel               |
| `/contact`                   | `app/contact/page.jsx`                   | Page de contact                  |
| `/mentions-legales`          | `app/mentions-legales/page.jsx`          | Mentions légales                 |
| `/politique-confidentialite` | `app/politique-confidentialite/page.jsx` | Politique RGPD                   |

### Routes administratives

| Route    | Composant            | Description   |
| -------- | -------------------- | ------------- |
| `/admin` | `app/admin/page.jsx` | Dashboard CMS |

### API Routes

| Route                            | Méthode                | Description            |
| -------------------------------- | ---------------------- | ---------------------- |
| `/api/cms/github`                | GET, POST, PUT, DELETE | API principale CMS     |
| `/api/cms/github/articles`       | GET                    | Liste des articles     |
| `/api/cms/github/article/[slug]` | GET                    | Article spécifique     |
| `/api/auth/cms-login`            | POST                   | Authentification CMS   |
| `/api/newsletter`                | POST                   | Inscription newsletter |
| `/api/upload/images`             | POST, GET              | Gestion des images     |

### Génération de métadonnées

Chaque page génère ses métadonnées pour le SEO :

```javascript
export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);

  return {
    title: `${article.title} | Les Pros de Cherbourg`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: "article",
    },
  };
}
```

---

## 💾 Gestion des données

### Sources de données

1. **Articles statiques** (`content/articles/`)

   - Fichiers Markdown avec front matter
   - Gérés via le CMS local

2. **Articles dynamiques** (GitHub API)

   - Stockés sur GitHub
   - Accessibles via l'API

3. **Configuration** (`config/sites.js`)
   - Paramètres multi-sites
   - Schémas de données

### Flux de données

```
┌─────────────────┐
│   GitHub Repo   │
│   (.md files)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   GitHub API    │
│   (REST calls)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   lib/github.js │
│   (Parser)      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   lib/data.js   │
│   (Aggregator)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   React Pages   │
│   (Display)     │
└─────────────────┘
```

### Modèle de données

#### Article

```javascript
{
  id: "unique-identifier",
  title: "Titre de l'article",
  slug: "titre-de-l-article",
  excerpt: "Description courte pour SEO",
  content: "Contenu en Markdown",
  category: "technologie", // Enum: tech, fashion, travel, etc.
  image: "https://example.com/image.jpg",
  imageAlt: "Description de l'image",
  imageTitle: "Titre de l'image",
  author: {
    name: "Nom de l'auteur",
    avatar: "URL de l'avatar"
  },
  publishedAt: "2025-06-01T10:00:00Z",
  draft: false,
  featured: true,
  tags: ["tag1", "tag2"],
  readingTime: 5, // en minutes
  // Champs SEO
  seoTitle: "Titre optimisé pour SEO",
  seoDescription: "Meta description",
  seoKeywords: ["mot-clé1", "mot-clé2"]
}
```

#### Configuration de site

```javascript
{
  id: "site-id",
  name: "Nom du site",
  domain: "example.com",
  repo: "username/repository",
  branch: "main",
  logo: "/logos/site.png",
  theme: {
    primary: "#3b82f6",
    secondary: "#64748b"
  },
  content: {
    articles: {
      folder: "content/articles",
      fields: [/* Configuration des champs */]
    }
  },
  media: {
    folder: "public/images/uploads",
    publicPath: "/images/uploads"
  }
}
```

---

## 🎛️ CMS Personnalisé

### Architecture du CMS

Le CMS est composé de plusieurs couches :

1. **Interface utilisateur** (`components/cms/`)
2. **API Layer** (`app/api/cms/`)
3. **GitHub Integration** (`lib/github.js`)
4. **Configuration** (`config/sites.js`)

### Authentification

```javascript
// Flux d'authentification
1. Login form → POST /api/auth/cms-login
2. Validation credentials → Check env variables
3. Success → Set session state
4. Access CMS → Bearer token validation
```

### Gestion multi-sites

Le CMS peut gérer plusieurs sites simultanément :

```javascript
// Sélection du site actuel
const [currentSite, setCurrentSite] = useState("les-pros-cherbourg");
const siteConfig = getSiteConfig(currentSite);

// API calls avec site spécifique
fetch(`/api/cms/github?siteId=${currentSite}&action=articles`);
```

### Fonctionnalités principales

#### 1. Gestion des articles

- **Création** : Interface avec éditeur Markdown
- **Modification** : Chargement et sauvegarde
- **Suppression** : Avec confirmation
- **Filtrage** : Par catégorie, statut, recherche
- **Preview** : Aperçu en temps réel

#### 2. Upload d'images

```javascript
// Upload flow
1. File selection → Input file
2. Validation → Size, type, dimensions
3. Upload → POST /api/upload/images
4. Storage → Save to public/images/
5. Integration → Insert URL in editor
```

#### 3. SEO et métadonnées

- Titre SEO (60 caractères max)
- Meta description (160 caractères max)
- Mots-clés ciblés
- Aperçu Google intégré
- Validation en temps réel

---

## 🔍 SEO et Performance

### Optimisations SEO

#### 1. Métadonnées dynamiques

```javascript
// Génération automatique pour chaque page
export async function generateMetadata({ params }) {
  // Récupération des données spécifiques
  // Génération des balises meta
  // Open Graph et Twitter Cards
}
```

#### 2. Sitemap automatique

```javascript
// app/sitemap.js
export default function sitemap() {
  const articles = getLatestArticles(1000);

  return [
    // Pages statiques
    { url: baseUrl, lastModified: new Date() },
    // Articles dynamiques
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt),
    })),
  ];
}
```

#### 3. Structured Data

```javascript
// JSON-LD pour les articles
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  image: article.image,
  author: {
    "@type": "Person",
    name: article.author.name,
  },
  publisher: {
    "@type": "Organization",
    name: "Les Pros de Cherbourg",
  },
  datePublished: article.publishedAt,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": articleUrl,
  },
};
```

### Optimisations Performance

#### 1. Images

```javascript
// Next.js Image avec optimisation
<Image
  src={article.image}
  alt={article.title}
  fill
  className="object-cover"
  priority={index === 0} // LCP optimization
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### 2. Loading et Lazy Loading

```javascript
// Composants avec Suspense
<Suspense fallback={<ArticleSkeleton />}>
  <ArticlesList />
</Suspense>;

// Dynamic imports pour le CMS
const CMSDashboard = dynamic(() => import("../components/cms/CMSDashboard"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

#### 3. Bundle optimization

```javascript
// next.config.js
module.exports = {
  experimental: {
    esmExternals: "loose", // Optimisation des modules ES
  },
  images: {
    domains: ["images.unsplash.com", "images.pexels.com"],
    formats: ["image/webp", "image/avif"], // Formats modernes
  },
};
```

---

## 📊 Monitoring et Analytics

### Google Analytics 4

```javascript
// components/google-analytics.jsx
const GoogleAnalytics = ({ measurementId }) => {
  useEffect(() => {
    window.gtag?.("config", measurementId, {
      anonymize_ip: true, // RGPD compliant
      allow_google_signals: false,
      analytics_storage: "denied", // Consentement requis
    });
  }, [measurementId]);
};
```

### RGPD et Cookies

```javascript
// components/cookie-banner.jsx
const handleAcceptAll = () => {
  // Activation de Google Analytics
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });

  // Sauvegarde des préférences
  localStorage.setItem("cookieConsent", "configured");
};
```

### Surveillance des erreurs

```javascript
// Logging des erreurs API
console.error("❌ Erreur API:", {
  endpoint: request.url,
  method: request.method,
  error: error.message,
  timestamp: new Date().toISOString(),
});
```

---

## 🔧 Maintenance et évolution

### Structure de versioning

```
main branch: Production stable
develop branch: Développement actuel
feature/xxx: Nouvelles fonctionnalités
hotfix/xxx: Corrections urgentes
```

### Procédure de déploiement

1. **Développement local**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nouvelle-fonctionnalite
   # Développement...
   npm run test
   git commit -m "feat: description"
   git push origin feature/nouvelle-fonctionnalite
   ```

2. **Review et merge**

   - Créer une Pull Request
   - Review du code
   - Tests automatisés
   - Merge vers develop

3. **Déploiement en production**
   ```bash
   git checkout main
   git merge develop
   git tag v1.x.x
   git push origin main --tags
   ```

### Tests et qualité

```javascript
// package.json scripts
{
  "scripts": {
    "test": "npm run lint:check && npm run security-check",
    "lint": "next lint --fix",
    "lint:check": "next lint",
    "security-check": "npm audit --audit-level high"
  }
}
```

### Backup et sécurité

#### 1. Sauvegarde des données

- **GitHub** : Versioning automatique des articles
- **Base de données** : Pas de BDD, données en fichiers
- **Images** : Stockage sur GitHub + CDN
- **Configuration** : Versionnée avec le code

#### 2. Sécurité

```javascript
// Validation des entrées
function validateArticleData(data) {
  const schema = {
    title: { required: true, type: "string", maxLength: 200 },
    slug: { required: true, type: "string", pattern: /^[a-z0-9-]+$/ },
    content: { required: true, type: "string" },
  };
  return validate(data, schema);
}

// Rate limiting
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite par IP
  message: "Trop de requêtes",
};
```

### Ajout de nouvelles fonctionnalités

#### 1. Nouveau type de contenu

```javascript
// 1. Ajouter dans config/sites.js
{
  content: {
    events: { // Nouveau type
      folder: "content/events",
      fields: [
        { name: "title", type: "text" },
        { name: "date", type: "datetime" },
        { name: "location", type: "text" }
      ]
    }
  }
}

// 2. Créer les composants UI
// components/EventCard.jsx
// components/EventsList.jsx

// 3. Ajouter les routes API
// app/api/cms/events/route.js

// 4. Créer les pages
// app/events/page.jsx
// app/events/[slug]/page.jsx
```

#### 2. Nouvelle intégration

```javascript
// 1. Installer les dépendances
npm install nouvelle-integration

// 2. Ajouter la configuration
// .env.local
NOUVELLE_API_KEY=xxx

// 3. Créer le service
// lib/nouvelle-integration.js

// 4. Intégrer dans l'API
// app/api/integration/route.js
```

### Problèmes courants et solutions

#### 1. "Article non trouvé"

**Cause :** Slug incorrect ou fichier manquant
**Solution :**

```javascript
// Vérifier dans lib/data.js
console.log(
  "Articles disponibles:",
  allArticles.map((a) => a.slug)
);
```

#### 2. "Erreur GitHub API"

**Cause :** Token expiré ou permissions insuffisantes
**Solution :**

```bash
# Régénérer le token GitHub
# Vérifier les permissions : repo, workflow
# Mettre à jour .env.local
```

#### 3. "Build failed"

**Cause :** Erreur TypeScript ou dépendance manquante
**Solution :**

```bash
npm run lint
npm audit fix
rm -rf .next node_modules
npm install
npm run build
```

### Roadmap et évolutions futures

#### Court terme (1-3 mois)

- [ ] Système de commentaires
- [ ] Newsletter avancée (segments)
- [ ] Dashboard analytics intégré
- [ ] Optimisation mobile

#### Moyen terme (3-6 mois)

- [ ] Multi-langue (i18n)
- [ ] API publique pour développeurs
- [ ] Thèmes personnalisables
- [ ] Intégration e-commerce

#### Long terme (6+ mois)

- [ ] IA pour génération de contenu
- [ ] CDN global pour images
- [ ] Application mobile
- [ ] Marketplace de thèmes

---

## 📞 Support et contact

### Documentation

- **GitHub** : [Repository principal](https://github.com/ThibautGallien/Lesprosdecherbourg)
- **Wiki** : Documentation détaillée
- **Issues** : Rapports de bugs et demandes

### Contact technique

- **Email** : contact@lesprosdecherbourg.fr
- **Discord** : Serveur de développement (sur demande)

### Ressources externes

- **Next.js** : [Documentation officielle](https://nextjs.org/docs)
- **Tailwind CSS** : [Documentation](https://tailwindcss.com/docs)
- **shadcn/ui** : [Composants](https://ui.shadcn.com/)
- **GitHub API** : [REST API docs](https://docs.github.com/en/rest)

---

## 📝 Notes finales

Ce projet est conçu pour être :

- **Évolutif** : Architecture modulaire permettant l'ajout facile de nouveaux sites
- **Maintenable** : Code bien structuré avec documentation complète
- **Performant** : Optimisations SEO et performance intégrées
- **Sécurisé** : Authentification robuste et validation des données

La philosophie du projet privilégie la simplicité et l'efficacité, avec un focus sur l'expérience utilisateur tant pour les visiteurs que pour les administrateurs du CMS.

**Version de cette documentation :** 1.0  
**Dernière mise à jour :** Juin 2025  
**Auteur :** Thibaut Gallien
