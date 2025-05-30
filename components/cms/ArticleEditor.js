// components/cms/ArticleEditor.js
import { useState, useRef } from "react";
import { Save, Eye, ArrowLeft, X, Image as ImageIcon, Tag } from "lucide-react";
import dynamic from "next/dynamic";

// Import dynamique pour éviter les erreurs SSR
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function ArticleEditor({
  article = null,
  siteConfig,
  onSave,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    category: article?.category || "technologie",
    body: article?.body || "",
    tags: article?.tags || [],
    author: {
      name: article?.author?.name || "Thibaut Gallien",
      avatar: article?.author?.avatar || "",
    },
    publishedAt: article?.publishedAt || new Date().toISOString().split("T")[0],
    readingTime: article?.readingTime || 5,
    draft: article?.draft !== undefined ? article.draft : true,
    image: article?.image || "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Génération automatique du slug
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  // Calcul automatique du temps de lecture
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleTitleChange = (value) => {
    setFormData({
      ...formData,
      title: value,
      slug: formData.slug || generateSlug(value),
    });
    if (errors.title) {
      setErrors({ ...errors, title: null });
    }
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      body: value || "",
      readingTime: calculateReadingTime(value || ""),
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: url,
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0] && files[0].type.startsWith("image/")) {
      handleImageUpload(files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est obligatoire";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "La description courte est obligatoire";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Le contenu est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      setErrors({
        title: "Le titre est obligatoire pour sauvegarder un brouillon",
      });
      return;
    }

    const draftData = {
      ...formData,
      draft: true,
      slug: formData.slug || generateSlug(formData.title),
    };

    onSave(draftData);
  };

  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }

    const publishData = {
      ...formData,
      draft: false,
      publishedAt:
        formData.publishedAt || new Date().toISOString().split("T")[0],
    };

    onSave(publishData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {article ? "Modifier l'article" : "Nouvel article"}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? "Éditer" : "Aperçu"}</span>
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Brouillon</span>
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Sauvegarde..." : "Publier"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale - Contenu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Entrez le titre de votre article..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (Slug) *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /{siteConfig?.domain}/articles/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className={`flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.slug ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="url-de-larticle"
                />
              </div>
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Description courte */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.excerpt ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Résumé de l'article qui apparaîtra dans les listes et partages..."
              />
              <div className="flex justify-between mt-1">
                {errors.excerpt && (
                  <p className="text-red-500 text-sm">{errors.excerpt}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.excerpt.length}/300
                </p>
              </div>
            </div>

            {/* Contenu */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <label className="block text-sm font-medium text-gray-700">
                  Contenu de l'article *
                </label>
              </div>
              <div className="p-0">
                {showPreview ? (
                  <div className="p-6 prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formData.body }} />
                  </div>
                ) : (
                  <div className={errors.body ? "border-2 border-red-500" : ""}>
                    <MDEditor
                      value={formData.body}
                      onChange={handleContentChange}
                      height={500}
                      preview="edit"
                      hideToolbar={false}
                      data-color-mode="light"
                    />
                  </div>
                )}
              </div>
              {errors.body && (
                <p className="text-red-500 text-sm p-4 border-t">
                  {errors.body}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Métadonnées */}
          <div className="space-y-6">
            {/* Image principale */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image principale
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
              >
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Aperçu"
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Glissez une image ici</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      ou cliquez pour sélectionner
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Catégorie */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nouveau tag..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Auteur */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auteur
              </label>
              <input
                type="text"
                value={formData.author.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date et temps de lecture */}
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps de lecture (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.readingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readingTime: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Calculé automatiquement selon le contenu
                </p>
              </div>
            </div>

            {/* Statut */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="draft"
                  checked={formData.draft}
                  onChange={(e) =>
                    setFormData({ ...formData, draft: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="draft" className="text-sm text-gray-700">
                  Sauvegarder comme brouillon
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Les brouillons ne sont pas visibles sur le site
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
