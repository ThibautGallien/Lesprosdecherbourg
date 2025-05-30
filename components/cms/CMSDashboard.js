// components/cms/CMSDashboard.js
import { useState, useEffect } from "react";
import {
  Settings,
  FileText,
  Image,
  Users,
  Globe,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  AlertCircle,
} from "lucide-react";
import { getAllSites, getSiteConfig } from "../../config/sites";
import { GitHubAPI } from "../../lib/github";
import ArticleEditor from "./ArticleEditor";

export default function CMSDashboard() {
  const [currentSite, setCurrentSite] = useState("les-pros-cherbourg");
  const [currentView, setCurrentView] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sites = getAllSites();
  const currentSiteConfig = getSiteConfig(currentSite);
  const githubAPI = new GitHubAPI(
    currentSiteConfig?.repo,
    currentSiteConfig?.branch
  );

  const categories = currentSiteConfig?.content?.articles?.fields?.find(
    (field) => field.name === "category"
  )?.options || [
    "technologie",
    "mode-et-beaute",
    "voyage",
    "loisirs",
    "sante-et-bien-etre",
  ];

  // Charger les articles au changement de site
  useEffect(() => {
    if (isAuthenticated && currentSiteConfig) {
      loadArticles();
    }
  }, [currentSite, isAuthenticated]);

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

  const loadArticles = async () => {
    try {
      setLoading(true);
      const articlesData = await githubAPI.getArticles(currentSiteConfig);
      setArticles(articlesData);
    } catch (error) {
      console.error("Erreur chargement articles:", error);
      showMessage("Erreur lors du chargement des articles", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Auth simple pour demo - remplacer par votre système d'auth
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsAuthenticated(true);
      showMessage("Connexion réussie !");
    } else {
      showMessage("Identifiants incorrects", "error");
    }
  };

  const handleCreateArticle = () => {
    setEditingArticle(null);
    setShowEditor(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleSaveArticle = async (articleData) => {
    try {
      setLoading(true);
      const isUpdate = !!editingArticle;

      await githubAPI.saveArticle(articleData, currentSiteConfig, isUpdate);

      showMessage(`Article ${isUpdate ? "mis à jour" : "créé"} avec succès !`);
      setShowEditor(false);
      setEditingArticle(null);
      await loadArticles(); // Recharger la liste
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
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
      await githubAPI.deleteArticle(article.path);
      showMessage("Article supprimé avec succès !");
      await loadArticles();
    } catch (error) {
      console.error("Erreur suppression:", error);
      showMessage("Erreur lors de la suppression", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishArticle = async (article) => {
    try {
      setLoading(true);
      const updatedArticle = { ...article, draft: false };
      await githubAPI.saveArticle(updatedArticle, currentSiteConfig, true);
      showMessage("Article publié avec succès !");
      await loadArticles();
    } catch (error) {
      console.error("Erreur publication:", error);
      showMessage("Erreur lors de la publication", "error");
    } finally {
      setLoading(false);
    }
  };

  // Interface de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            CMS Multi-Sites
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin123"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Utilisez vos identifiants d'administrateur
          </p>
        </div>
      </div>
    );
  }

  // Interface d'édition d'article
  if (showEditor) {
    return (
      <ArticleEditor
        article={editingArticle}
        siteConfig={currentSiteConfig}
        onSave={handleSaveArticle}
        onCancel={() => {
          setShowEditor(false);
          setEditingArticle(null);
        }}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Messages de notification */}
      {(success || error) && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            success
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{success || error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">
                CMS Multi-Sites
              </h1>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  value={currentSite}
                  onChange={(e) => setCurrentSite(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: currentSiteConfig?.theme.primary }}
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name} ({site.domain})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant qu'admin
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
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">
                {currentSiteConfig?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {currentSiteConfig?.domain}
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentSiteConfig?.theme.primary,
                    width: loading ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === "dashboard"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentView("articles")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === "articles"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Articles</span>
                <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {articles.length}
                </span>
              </button>
              <button
                onClick={() => setCurrentView("pages")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === "pages"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Pages</span>
              </button>
              <button
                onClick={() => setCurrentView("media")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  currentView === "media"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-707"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Image className="w-5 h-5" />
                <span>Médias</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentView === "dashboard" && (
            <div className="cms-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard - {currentSiteConfig?.name}
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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

              {/* Actions rapides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateArticle}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        Créer un nouvel article
                      </span>
                    </button>
                    <button
                      onClick={() => setCurrentView("articles")}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Gérer les articles</span>
                    </button>
                    <button
                      onClick={() => setCurrentView("media")}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Image className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Gérer les médias</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Statistiques
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Articles publiés</span>
                      <span className="font-semibold text-green-600">
                        {articles.filter((a) => !a.draft).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Brouillons</span>
                      <span className="font-semibold text-yellow-600">
                        {articles.filter((a) => a.draft).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total articles</span>
                      <span className="font-semibold text-blue-600">
                        {articles.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Articles */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Articles récents
                    </h3>
                    <button
                      onClick={() => setCurrentView("articles")}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir tout
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Aucun article pour le moment
                      </p>
                      <button
                        onClick={handleCreateArticle}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Créer le premier article
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {articles.slice(0, 5).map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 mb-1">
                              {article.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>/{article.slug}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {article.category}
                              </span>
                              <span>•</span>
                              <span>
                                {article.draft
                                  ? "Brouillon"
                                  : `Publié le ${new Date(
                                      article.publishedAt
                                    ).toLocaleDateString("fr-FR")}`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                article.draft
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {article.draft ? "Brouillon" : "Publié"}
                            </span>
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === "articles" && (
            <div className="cms-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Articles</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadArticles}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{loading ? "Actualisation..." : "Actualiser"}</span>
                  </button>
                  <button
                    onClick={handleCreateArticle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouvel article</span>
                  </button>
                </div>
              </div>

              {/* Filtres */}
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les statuts</option>
                    <option value="published">Publiés</option>
                    <option value="draft">Brouillons</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category
                          .replace("-", " ")
                          .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun article
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Commencez par créer votre premier article.
                    </p>
                    <button
                      onClick={handleCreateArticle}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Créer un article
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Titre
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Statut
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Catégorie
                          </th>
                          <th className="text-left py-3 px-6 font-medium text-gray-700">
                            Date
                          </th>
                          <th className="text-right py-3 px-6 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {articles.map((article) => (
                          <tr
                            key={article.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {article.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  /{article.slug}
                                </p>
                                {article.excerpt && (
                                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                    {article.excerpt}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  article.draft
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {article.draft ? "Brouillon" : "Publié"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-700 capitalize">
                              {article.category?.replace("-", " ")}
                            </td>
                            <td className="py-4 px-6 text-gray-700">
                              {article.publishedAt
                                ? new Date(
                                    article.publishedAt
                                  ).toLocaleDateString("fr-FR")
                                : "Non publié"}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditArticle(article)}
                                  className="text-blue-600 hover:text-blue-700 p-1"
                                  title="Modifier"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    window.open(
                                      `https://${currentSiteConfig.domain}/articles/${article.slug}`,
                                      "_blank"
                                    )
                                  }
                                  className="text-green-600 hover:text-green-700 p-1"
                                  title="Prévisualiser"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {article.draft && (
                                  <button
                                    onClick={() =>
                                      handlePublishArticle(article)
                                    }
                                    className="text-green-600 hover:text-green-700 p-1"
                                    title="Publier"
                                    disabled={loading}
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteArticle(article)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="Supprimer"
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "pages" && (
            <div className="cms-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pages</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-gray-600 mb-4">
                  Gestion des pages statiques (À propos, Contact, etc.)
                </p>
                <div className="text-sm text-gray-500">
                  <p>🚧 Fonctionnalité en développement</p>
                  <p>
                    Vous pourrez bientôt éditer vos pages statiques directement
                    depuis cette interface.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentView === "media" && (
            <div className="cms-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Médias</h2>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-gray-600 mb-4">
                  Gestion des images et fichiers
                </p>
                <div className="text-sm text-gray-500">
                  <p>🚧 Fonctionnalité en développement</p>
                  <p>
                    Vous pourrez bientôt gérer vos médias (images, documents)
                    directement depuis cette interface.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
