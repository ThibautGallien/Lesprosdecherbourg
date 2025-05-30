// components/cms/ArticleEditor.js
import { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Eye,
  Upload,
  Image as ImageIcon,
  Link,
  Bold,
  Italic,
  List,
  Hash,
  Quote,
  Code,
  Search,
  FileText,
  Tag,
} from "lucide-react";

export default function ArticleEditor({
  article,
  siteConfig,
  onSave,
  onCancel,
  loading,
}) {
  // ✅ FONCTION DE PROTECTION pour les tags
  const ensureTagsArray = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") {
      if (tags.includes(",")) {
        return tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }
      return tags.length > 0 ? [tags] : [];
    }
    return [];
  };

  // ✅ FONCTION DE PROTECTION pour les mots-clés SEO
  const ensureKeywordsArray = (keywords) => {
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === "string") {
      if (keywords.includes(",")) {
        return keywords
          .split(",")
          .map((kw) => kw.trim())
          .filter((kw) => kw.length > 0);
      }
      return keywords.length > 0 ? [keywords] : [];
    }
    return [];
  };

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    imageAlt: "",
    imageTitle: "",
    category: "",
    tags: [],
    author: {
      name: "Thibaut Gallien",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    publishedAt: new Date().toISOString().split("T")[0],
    draft: true,
    featured: false,
    readingTime: 1,
    // Nouveaux champs SEO
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    // ✅ PROTECTION : Si un article est passé, on s'assure que tags et seoKeywords sont des arrays
    ...(article
      ? {
          ...article,
          tags: ensureTagsArray(article.tags),
          seoKeywords: ensureKeywordsArray(article.seoKeywords),
        }
      : {}),
  });

  const [activeTab, setActiveTab] = useState("content");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const categories = siteConfig?.content?.articles?.fields?.find(
    (field) => field.name === "category"
  )?.options || [
    "technologie",
    "mode-et-beaute",
    "voyage",
    "loisirs",
    "sante-et-bien-etre",
  ];

  // Auto-générer le slug
  useEffect(() => {
    if (formData.title && !article) {
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, article]);

  // Auto-générer SEO title si vide
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData((prev) => ({
        ...prev,
        seoTitle:
          formData.title.length > 60
            ? formData.title.substring(0, 57) + "..."
            : formData.title,
      }));
    }
  }, [formData.title]);

  // Calculer temps de lecture
  useEffect(() => {
    const words = formData.content.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    setFormData((prev) => ({ ...prev, readingTime }));
  }, [formData.content]);

  // Charger les images existantes au montage
  useEffect(() => {
    loadExistingImages();
  }, []);

  const loadExistingImages = async () => {
    try {
      const response = await fetch("/api/upload/images");
      const data = await response.json();

      if (data.success) {
        const imagesWithMetadata = data.files.map((file) => ({
          ...file,
          alt: "",
          title: "",
        }));
        setUploadedImages(imagesWithMetadata);
      }
    } catch (error) {
      console.error("Erreur chargement images:", error);
    }
  };

  // 📸 UPLOAD D'IMAGES
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newImages = data.files.map((file) => ({
          ...file,
          alt: "",
          title: "",
        }));

        setUploadedImages((prev) => [...newImages, ...prev]);
        console.log(`✅ ${newImages.length} image(s) uploadée(s)`);
      } else {
        console.error("Erreur upload:", data.message);
      }
    } catch (error) {
      console.error("Erreur upload:", error);
    }

    // Reset input
    event.target.value = "";
  };

  // 🔧 FONCTIONS D'AIDE MARKDOWN
  const insertMarkdown = (before, after = "", placeholder = "texte") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end) || placeholder;

    const newText =
      formData.content.substring(0, start) +
      before +
      selectedText +
      after +
      formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newText }));

    // Remettre le focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertImage = (image) => {
    const markdown = `![${image.alt || image.filename}](${image.url} "${
      image.title || image.filename
    }")`;
    insertMarkdown(markdown, "");
    setShowImageGallery(false);
  };

  const insertLink = () => {
    const url = prompt("URL du lien:");
    if (url) {
      insertMarkdown("[", `](${url})`);
    }
  };

  // 🏷️ GESTION DES TAGS ET MOTS-CLÉS
  const addTag = () => {
    if (
      newTag.trim() &&
      !ensureTagsArray(formData.tags).includes(newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...ensureTagsArray(prev.tags), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: ensureTagsArray(prev.tags).filter((tag) => tag !== tagToRemove),
    }));
  };

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !ensureKeywordsArray(formData.seoKeywords).includes(newKeyword.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        seoKeywords: [
          ...ensureKeywordsArray(prev.seoKeywords),
          newKeyword.trim(),
        ],
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: ensureKeywordsArray(prev.seoKeywords).filter(
        (keyword) => keyword !== keywordToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📤 Envoi formData:", formData);
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">
                {article ? "Modifier l'article" : "Nouvel article"}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>{formData.readingTime} min de lecture</span>
                <span>•</span>
                <span>{formData.content.split(/\s+/).length} mots</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? "Éditer" : "Aperçu"}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </button>
              <button
                type="submit"
                form="article-form"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Sauvegarde..." : "Sauvegarder"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Onglets */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: "content", label: "Contenu", icon: FileText },
              { id: "seo", label: "SEO", icon: Search },
              { id: "images", label: "Images", icon: ImageIcon },
              { id: "settings", label: "Paramètres", icon: Tag },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          {/* ONGLET CONTENU */}
          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Titre et slug */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de l'article *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Titre accrocheur de votre article"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL (slug)
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-sm">
                          /{siteConfig?.domain}/articles/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="url-de-votre-article"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Éditeur de contenu */}
                <div className="bg-white rounded-lg shadow-sm border">
                  {/* Barre d'outils markdown */}
                  <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**", "**")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Gras"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("*", "*")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Italique"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("## ", "")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Titre H2"
                      >
                        <Hash className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("- ", "")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Liste"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("> ", "")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Citation"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("`", "`")}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Code"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button
                        type="button"
                        onClick={insertLink}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Lien"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowImageGallery(true)}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Insérer image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Zone d'édition */}
                  <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu de l'article *
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="Écrivez votre article en Markdown..."
                      required
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Utilisez la syntaxe Markdown.
                      <a
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        Guide de syntaxe
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Statut de publication */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Publication
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="draft"
                        checked={formData.draft}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            draft: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="draft" className="text-sm text-gray-700">
                        Enregistrer comme brouillon
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            featured: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm text-gray-700"
                      >
                        Article mis en avant
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de publication
                      </label>
                      <input
                        type="date"
                        value={formData.publishedAt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            publishedAt: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Catégorie */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Catégorie</h3>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category
                          .replace("-", " ")
                          .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Tags</h3>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Ajouter un tag"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* ✅ PROTECTION appliquée ici */}
                      {ensureTagsArray(formData.tags).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET SEO */}
          {activeTab === "seo" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Optimisation SEO
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Titre SEO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre SEO (Title Tag)
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoTitle: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Titre optimisé pour les moteurs de recherche"
                      maxLength={60}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {formData.seoTitle.length}/60 caractères
                      {formData.seoTitle.length > 60 && (
                        <span className="text-red-500 ml-2">
                          Trop long pour Google
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seoDescription || formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seoDescription: e.target.value,
                          excerpt: e.target.value, // Sync avec excerpt
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description qui apparaîtra dans les résultats de recherche"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {(formData.seoDescription || formData.excerpt).length}/160
                      caractères
                      {(formData.seoDescription || formData.excerpt).length >
                        160 && (
                        <span className="text-red-500 ml-2">
                          Trop long pour Google
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mots-clés SEO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mots-clés SEO
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addKeyword())
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Ajouter un mot-clé"
                        />
                        <button
                          type="button"
                          onClick={addKeyword}
                          className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* ✅ PROTECTION appliquée ici aussi */}
                        {ensureKeywordsArray(formData.seoKeywords).map(
                          (keyword) => (
                            <span
                              key={keyword}
                              className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                            >
                              <span>{keyword}</span>
                              <button
                                type="button"
                                onClick={() => removeKeyword(keyword)}
                                className="text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Aperçu Google */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Aperçu Google
                    </h3>
                    <div className="bg-white p-3 rounded border">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {formData.seoTitle ||
                          formData.title ||
                          "Titre de l'article"}
                      </div>
                      <div className="text-green-700 text-sm">
                        {siteConfig?.domain}/articles/
                        {formData.slug || "url-article"}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {(
                          formData.seoDescription ||
                          formData.excerpt ||
                          "Description de l'article qui apparaîtra dans les résultats de recherche..."
                        ).substring(0, 160)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET IMAGES */}
          {activeTab === "images" && (
            <div className="space-y-6">
              {/* Upload d'images */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Upload d'images
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Ajouter des images</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                {/* Galerie d'images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.filename}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Texte alternatif (ALT)"
                          value={image.alt}
                          onChange={(e) => {
                            setUploadedImages((prev) =>
                              prev.map((img) =>
                                img.id === image.id
                                  ? { ...img, alt: e.target.value }
                                  : img
                              )
                            );
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Titre (Title)"
                          value={image.title}
                          onChange={(e) => {
                            setUploadedImages((prev) =>
                              prev.map((img) =>
                                img.id === image.id
                                  ? { ...img, title: e.target.value }
                                  : img
                              )
                            );
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => insertImage(image)}
                          className="w-full bg-green-600 text-white py-1 rounded text-xs hover:bg-green-700"
                        >
                          Insérer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {uploadedImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucune image uploadée</p>
                    <p className="text-sm">
                      Cliquez sur "Ajouter des images" pour commencer
                    </p>
                  </div>
                )}
              </div>

              {/* Image mise en avant */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Image mise en avant
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'image
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texte alternatif (ALT) *
                    </label>
                    <input
                      type="text"
                      value={formData.imageAlt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          imageAlt: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description de l'image pour l'accessibilité et le SEO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'image (Title)
                    </label>
                    <input
                      type="text"
                      value={formData.imageTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          imageTitle: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Titre qui apparaît au survol de l'image"
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Aperçu :
                      </p>
                      <img
                        src={formData.image}
                        alt={formData.imageAlt}
                        title={formData.imageTitle}
                        className="max-w-xs h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET PARAMÈTRES */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Paramètres avancés
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Auteur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auteur
                    </label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={formData.author.avatar}
                        alt={formData.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <input
                          type="text"
                          value={formData.author.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              author: { ...prev.author, name: e.target.value },
                            }))
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* URL de l'avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar de l'auteur
                    </label>
                    <input
                      type="url"
                      value={formData.author.avatar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: { ...prev.author, avatar: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  {/* Temps de lecture (calculé automatiquement) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temps de lecture estimé
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={formData.readingTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            readingTime: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                      <span className="text-sm text-gray-500">minutes</span>
                      <span className="text-xs text-gray-400 ml-2">
                        (Calculé automatiquement : ~
                        {Math.ceil(formData.content.split(/\s+/).length / 200)}{" "}
                        min)
                      </span>
                    </div>
                  </div>

                  {/* Paramètres avancés */}
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-4">
                      Paramètres techniques
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Article mis en avant
                          </label>
                          <p className="text-xs text-gray-500">
                            Afficher cet article en première position
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Brouillon
                          </label>
                          <p className="text-xs text-gray-500">
                            L'article ne sera pas visible publiquement
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.draft}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              draft: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Modal galerie d'images */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choisir une image</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => insertImage(image)}
                    className="cursor-pointer border rounded-lg p-2 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || image.filename}
                      className="w-full h-24 object-cover rounded mb-1"
                    />
                    <p className="text-xs text-gray-600 truncate">
                      {image.filename}
                    </p>
                  </div>
                ))}
              </div>
              {uploadedImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Aucune image disponible</p>
                  <button
                    onClick={() => {
                      setShowImageGallery(false);
                      setActiveTab("images");
                    }}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    Aller à l'onglet Images pour en ajouter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Aperçu (optionnel) */}
      {showPreview && (
        <div className="fixed inset-0 bg-white z-40 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Aperçu de l'article</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  <span>Fermer l'aperçu</span>
                </button>
              </div>

              <article className="prose max-w-none">
                <header className="mb-8">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt={formData.imageAlt}
                      title={formData.imageTitle}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
                      {formData.category?.replace("-", " ")}
                    </span>
                    <span>•</span>
                    <span>{formData.readingTime} min de lecture</span>
                    <span>•</span>
                    <span>
                      {new Date(formData.publishedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {formData.title}
                  </h1>
                  {formData.excerpt && (
                    <p className="text-xl text-gray-600 mb-6">
                      {formData.excerpt}
                    </p>
                  )}
                  <div className="flex items-center space-x-3">
                    <img
                      src={formData.author.avatar}
                      alt={formData.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formData.author.name}
                      </p>
                    </div>
                  </div>

                  {/* Affichage des tags dans l'aperçu */}
                  {ensureTagsArray(formData.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {ensureTagsArray(formData.tags).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>

                <div className="prose-content">
                  {/* Ici on pourrait ajouter un rendu Markdown */}
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {formData.content}
                  </pre>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
