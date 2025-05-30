// components/cms/CMSDashboard.js
"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Globe,
  Calendar,
  Clock,
  Tag,
  Search,
  ExternalLink,
} from "lucide-react";

import ArticleEditor from "./ArticleEditor";
import { getAllSites, getSiteConfig } from "../../config/sites";

export default function CMSDashboard() {
  // États principaux
  const [currentSite, setCurrentSite] = useState("les-pros-cherbourg");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [editingArticle, setEditingArticle] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Auth states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Configuration
  const sites = getAllSites();
  const currentSiteConfig = getSiteConfig(currentSite);

  const categories = [
    "technologie",
    "mode-et-beaute",
    "voyage",
    "loisirs",
    "sante-et-bien-etre",
  ];

  // Fonctions utilitaires
  const showMessage = (message, type = "success") => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const parseMarkdownArticle = (content, filename) => {
    try {
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = content.match(frontmatterRegex);

      if (!match) {
        console.warn(`Pas de frontmatter trouvé dans ${filename}`);
        return null;
      }

      const frontmatterLines = match[1].split("\n");
      const contentBody = match[2];
      const frontmatter = {};

      let currentKey = null;
      let currentValue = "";
      let inArray = false;
      let inObject = false;
      let objectKey = null;

      for (const line of frontmatterLines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (trimmedLine.startsWith("- ") && inArray) {
          if (Array.isArray(frontmatter[currentKey])) {
            frontmatter[currentKey].push(trimmedLine.substring(2));
          }
        } else if (trimmedLine.includes(":")) {
          if (inObject && objectKey && currentKey) {
            const [objKey, objValue] = trimmedLine
              .split(":")
              .map((s) => s.trim());
            frontmatter[currentKey][objKey] = objValue.replace(/['"]/g, "");
          } else {
            const [key, ...valueParts] = trimmedLine.split(":");
            const value = valueParts.join(":").trim();

            currentKey = key.trim();
            currentValue = value;

            if (value === "") {
              inArray = true;
              frontmatter[currentKey] = [];
            } else if (value.startsWith("{")) {
              inObject = true;
              frontmatter[currentKey] = {};
            } else {
              inArray = false;
              inObject = false;

              let cleanValue = value.replace(/['"]/g, "");

              if (cleanValue === "true") cleanValue = true;
              else if (cleanValue === "false") cleanValue = false;
              else if (!isNaN(cleanValue) && cleanValue !== "")
                cleanValue = Number(cleanValue);
              else if (cleanValue.includes("T") && cleanValue.includes("Z")) {
                cleanValue = new Date(cleanValue).toISOString().split("T")[0];
              }

              frontmatter[currentKey] = cleanValue;
            }
          }
        }
      }

      const slug = frontmatter.slug || filename.replace(".md", "");

      return {
        id: Date.now() + Math.random(),
        title: frontmatter.title || "Article sans titre",
        slug,
        excerpt: frontmatter.excerpt || "",
        content: contentBody,
        image: frontmatter.image || "",
        imageAlt: frontmatter.imageAlt || "",
        imageTitle: frontmatter.imageTitle || "",
        category: frontmatter.category || "technologie",
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        author: frontmatter.author || {
          name: "Thibaut Gallien",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        },
        publishedAt:
          frontmatter.publishedAt || new Date().toISOString().split("T")[0],
        draft: frontmatter.draft || false,
        featured: frontmatter.featured || false,
        readingTime: frontmatter.readingTime || 1,
        seoTitle: frontmatter.seoTitle || frontmatter.title || "",
        seoDescription: frontmatter.seoDescription || frontmatter.excerpt || "",
        seoKeywords: Array.isArray(frontmatter.seoKeywords)
          ? frontmatter.seoKeywords
          : [],
      };
    } catch (error) {
      console.error(`Erreur parsing ${filename}:`, error);
      return null;
    }
  };

  const loadArticles = async () => {
    try {
      setLoading(true);
      console.log("🔍 Chargement des articles via API route...");

      const response = await fetch("/api/cms/github/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Articles reçus:", data);

      const processedArticles = [];

      for (const file of data) {
        if (file.name && file.name.endsWith(".md")) {
          try {
            const fileResponse = await fetch(
              `/api/cms/github/article/${file.name.replace(".md", "")}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (fileResponse.ok) {
              const fileData = await fileResponse.json();
              const content = atob(fileData.content);
              const article = parseMarkdownArticle(content, file.name);
              if (article) {
                processedArticles.push(article);
              }
            }
          } catch (error) {
            console.error(`Erreur traitement fichier ${file.name}:`, error);
          }
        }
      }

      const sortedArticles = processedArticles.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

      setArticles(sortedArticles);
      showMessage(`${sortedArticles.length} article(s) chargé(s)`);
    } catch (error) {
      console.error("❌ Erreur chargement articles:", error);
      showMessage("Erreur lors du chargement des articles", "error");
    } finally {
      setLoading(false);
    }
  };

  // Auth
  const handleLogin = (e) => {
    e.preventDefault();

    const validUsername = process.env.NEXT_PUBLIC_CMS_USERNAME || "admin";
    const validPassword = process.env.NEXT_PUBLIC_CMS_PASSWORD || "password123";

    if (username === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      showMessage("Connexion réussie !");
      loadArticles();
    } else {
      showMessage("Identifiants incorrects", "error");
    }
  };

  // Gestion des articles
  const handleCreateArticle = () => {
    setEditingArticle(null);
    setCurrentView("editor");
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setCurrentView("editor");
  };

  const handleSaveArticle = async (articleData) => {
    try {
      setLoading(true);
      console.log("💾 Sauvegarde article:", articleData);

      const method = editingArticle ? "PUT" : "POST";
      const endpoint = editingArticle
        ? `/api/cms/github/article/${editingArticle.slug}`
        : `/api/cms/github/articles`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        showMessage(editingArticle ? "Article mis à jour !" : "Article créé !");
        setCurrentView("dashboard");
        setEditingArticle(null);
        await loadArticles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur sauvegarde");
      }
    } catch (error) {
      console.error("❌ Erreur sauvegarde:", error);
      showMessage("Erreur lors de la sauvegarde", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (article) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${article.title}" ?`)) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/cms/github/article/${article.slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        showMessage("Article supprimé !");
        await loadArticles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur suppression");
      }
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
      showMessage("Erreur lors de la suppression", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtres
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Charger articles au montage si authentifié
  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  // Interface de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">
              CMS Les Pros de Cherbourg
            </h1>
            <p className="text-gray-600 mt-2">Connectez-vous pour continuer</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Utilisez vos identifiants d&apos;administrateur
          </p>
        </div>
      </div>
    );
  }

  // Interface d'édition
  if (currentView === "editor") {
    return (
      <ArticleEditor
        article={editingArticle}
        siteConfig={currentSiteConfig}
        onSave={handleSaveArticle}
        onCancel={() => {
          setCurrentView("dashboard");
          setEditingArticle(null);
        }}
        loading={loading}
      />
    );
  }

  // Interface principale
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Messages */}
      {(success || error) && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`p-4 rounded-md shadow-md ${
              success
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {success || error}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  CMS Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  {currentSiteConfig?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={currentSite}
                onChange={(e) => setCurrentSite(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Connecté en tant qu&apos;admin
                </span>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard principal */}
        {currentView === "dashboard" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard - {currentSiteConfig?.name}
              </h2>

              <button
                onClick={handleCreateArticle}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel article</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Articles
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {articles.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {articles.filter((a) => !a.draft).length} publiés
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pages</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pages statiques
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Site</p>
                    <p className="text-lg font-bold text-gray-900">
                      {currentSiteConfig?.domain}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">En ligne</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category
                        .replace("-", " ")
                        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Articles ({filteredArticles.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Aucun article pour le moment
                  </p>
                  <button
                    onClick={handleCreateArticle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Créer le premier article
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {article.title}
                            </h4>
                            {article.draft && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                Brouillon
                              </span>
                            )}
                            {article.featured && (
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                                Mis en avant
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm mb-2">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
                              {article.category?.replace("-", " ")}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(article.publishedAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readingTime} min
                            </span>
                            {article.tags && article.tags.length > 0 && (
                              <span className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {article.tags.slice(0, 2).join(", ")}
                                {article.tags.length > 2 && "..."}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <a
                            href={`/${currentSiteConfig?.domain}/articles/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                            title="Voir l'article"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
