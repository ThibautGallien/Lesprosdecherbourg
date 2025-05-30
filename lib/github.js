// lib/github.js
import yaml from "js-yaml";

export class GitHubAPI {
  constructor(repoName, branch = "main") {
    this.repo = repoName;
    this.branch = branch;
    this.baseUrl = "https://api.github.com";

    // 🔧 CORRECTION: Utiliser la bonne variable d'environnement
    this.token = process.env.GITHUB_TOKEN;

    // 🔍 DEBUG TEMPORAIRE
    console.log("🔑 Token présent:", !!this.token);
    console.log("📁 Repo configuré:", repoName);
    console.log("🌿 Branche:", branch);

    if (!this.token) {
      console.error("❌ GITHUB_TOKEN manquant dans .env.local");
      console.error(
        "📝 Vérifiez que votre .env.local contient: GITHUB_TOKEN=ghp_..."
      );
    } else {
      console.log("✅ GitHub configuré avec token");
    }
  }

  // Headers pour les requêtes GitHub
  get headers() {
    return {
      Authorization: `token ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    };
  }

  // Récupérer le contenu d'un fichier
  async getFileContent(path) {
    try {
      console.log(`📖 Lecture fichier: ${path}`);

      const response = await fetch(
        `${this.baseUrl}/repos/${this.repo}/contents/${path}?ref=${this.branch}`,
        { headers: this.headers }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`❌ Fichier non trouvé: ${path}`);
          return null; // Fichier n'existe pas
        }
        console.error(`❌ Erreur GitHub ${response.status} pour ${path}`);
        throw new Error(`Erreur GitHub: ${response.status}`);
      }

      const data = await response.json();
      const content = Buffer.from(data.content, "base64").toString("utf8");

      console.log(`✅ Fichier lu: ${path} (${content.length} caractères)`);

      return {
        content,
        sha: data.sha,
        path: data.path,
      };
    } catch (error) {
      console.error("Erreur récupération fichier:", error);
      throw error;
    }
  }

  // Sauvegarder ou créer un fichier
  async saveFile(path, content, message, sha = null) {
    try {
      console.log(`💾 Sauvegarde: ${path}`);

      const body = {
        message,
        content: Buffer.from(content).toString("base64"),
        branch: this.branch,
      };

      if (sha) {
        body.sha = sha; // Nécessaire pour la mise à jour
        console.log(`🔄 Mise à jour avec SHA: ${sha.substring(0, 7)}...`);
      } else {
        console.log(`➕ Création nouveau fichier`);
      }

      const response = await fetch(
        `${this.baseUrl}/repos/${this.repo}/contents/${path}`,
        {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`❌ Erreur sauvegarde:`, errorData);
        throw new Error(`Erreur sauvegarde: ${errorData.message}`);
      }

      const result = await response.json();
      console.log(`✅ Fichier sauvegardé: ${path}`);
      return result;
    } catch (error) {
      console.error("Erreur sauvegarde fichier:", error);
      throw error;
    }
  }

  // Supprimer un fichier
  async deleteFile(path, message) {
    try {
      console.log(`🗑️ Suppression: ${path}`);

      // D'abord récupérer le SHA du fichier
      const fileInfo = await this.getFileContent(path);
      if (!fileInfo) {
        throw new Error("Fichier non trouvé");
      }

      const response = await fetch(
        `${this.baseUrl}/repos/${this.repo}/contents/${path}`,
        {
          method: "DELETE",
          headers: this.headers,
          body: JSON.stringify({
            message,
            sha: fileInfo.sha,
            branch: this.branch,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur suppression: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Fichier supprimé: ${path}`);
      return result;
    } catch (error) {
      console.error("Erreur suppression fichier:", error);
      throw error;
    }
  }

  // Lister les fichiers d'un dossier
  async listFiles(folderPath) {
    try {
      console.log(`📁 Liste fichiers: ${folderPath}`);

      const response = await fetch(
        `${this.baseUrl}/repos/${this.repo}/contents/${folderPath}?ref=${this.branch}`,
        { headers: this.headers }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`❌ Dossier non trouvé: ${folderPath}`);
          return []; // Dossier n'existe pas
        }
        console.error(`❌ Erreur GitHub ${response.status} pour ${folderPath}`);
        throw new Error(`Erreur GitHub: ${response.status}`);
      }

      const data = await response.json();
      const files = Array.isArray(data) ? data : [];
      console.log(`✅ ${files.length} fichier(s) trouvé(s) dans ${folderPath}`);

      return files;
    } catch (error) {
      console.error("Erreur listage fichiers:", error);
      return [];
    }
  }

  // Parser le front matter d'un fichier markdown
  parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (match) {
      try {
        const frontMatter = yaml.load(match[1]);
        const body = match[2];
        return { frontMatter, body };
      } catch (error) {
        console.error("Erreur parsing YAML:", error);
        return { frontMatter: {}, body: content };
      }
    }

    return { frontMatter: {}, body: content };
  }

  // Créer le contenu markdown avec front matter
  createMarkdownContent(frontMatter, body) {
    const yamlString = yaml.dump(frontMatter, {
      flowLevel: -1,
      noRefs: true,
    });
    return `---\n${yamlString}---\n\n${body}`;
  }

  // Générer le nom de fichier pour un article
  generateArticleFilename(data) {
    const date = new Date(data.publishedAt || Date.now());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}-${data.slug}.md`;
  }

  // Sauvegarder un article
  async saveArticle(articleData, siteConfig, isUpdate = false) {
    try {
      console.log(`📝 Sauvegarde article: ${articleData.title}`);

      const articleFolder = siteConfig.content.articles.folder;
      const filename = this.generateArticleFilename(articleData);
      const filePath = `${articleFolder}/${filename}`;

      // Préparer le front matter
      const frontMatter = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        image: articleData.image,
        imageAlt: articleData.imageAlt,
        imageTitle: articleData.imageTitle,
        category: articleData.category,
        author: articleData.author,
        publishedAt: articleData.publishedAt,
        draft: articleData.draft,
        tags: articleData.tags,
        readingTime: articleData.readingTime,
        featured: articleData.featured,
        // Nouveaux champs SEO
        seoTitle: articleData.seoTitle,
        seoDescription: articleData.seoDescription,
        seoKeywords: articleData.seoKeywords,
      };

      // Créer le contenu markdown
      const markdownContent = this.createMarkdownContent(
        frontMatter,
        articleData.content || articleData.body || ""
      );

      // Message de commit
      const action = isUpdate ? "Mise à jour" : "Création";
      const message = `${action} article: ${articleData.title}`;

      // Vérifier si le fichier existe déjà
      let sha = null;
      if (isUpdate) {
        const existingFile = await this.getFileContent(filePath);
        if (existingFile) {
          sha = existingFile.sha;
        }
      }

      // Sauvegarder
      const result = await this.saveFile(
        filePath,
        markdownContent,
        message,
        sha
      );

      console.log(`✅ Article sauvegardé: ${filename}`);

      return {
        success: true,
        filename,
        path: filePath,
        result,
      };
    } catch (error) {
      console.error("Erreur sauvegarde article:", error);
      throw error;
    }
  }

  // Récupérer tous les articles
  async getArticles(siteConfig) {
    try {
      console.log(`🔍 Récupération articles pour ${siteConfig.name}`);

      const articleFolder = siteConfig.content.articles.folder;
      const files = await this.listFiles(articleFolder);

      const articles = [];

      for (const file of files) {
        if (file.name.endsWith(".md")) {
          console.log(`📄 Traitement article: ${file.name}`);

          const content = await this.getFileContent(file.path);
          if (content) {
            const { frontMatter, body } = this.parseFrontMatter(
              content.content
            );

            articles.push({
              id: file.name.replace(".md", ""),
              filename: file.name,
              path: file.path,
              sha: content.sha,
              ...frontMatter,
              body,
              content: body, // Alias pour compatibilité
              lastModified: file.last_modified || new Date().toISOString(),
            });
          }
        }
      }

      // Trier par date de publication (plus récent en premier)
      const sortedArticles = articles.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
      );

      console.log(`✅ ${sortedArticles.length} article(s) récupéré(s)`);
      return sortedArticles;
    } catch (error) {
      console.error("Erreur récupération articles:", error);
      return [];
    }
  }

  // Supprimer un article
  async deleteArticle(articlePath) {
    try {
      const message = `Suppression article: ${articlePath}`;
      return await this.deleteFile(articlePath, message);
    } catch (error) {
      console.error("Erreur suppression article:", error);
      throw error;
    }
  }

  // Upload d'image
  async uploadImage(imageFile, sitePath = "public/images/uploads") {
    try {
      console.log(`🖼️ Upload image: ${imageFile.name}`);

      const filename = `${Date.now()}-${imageFile.name}`;
      const filePath = `${sitePath}/${filename}`;

      // Convertir le fichier en base64
      const fileContent = await this.fileToBase64(imageFile);

      const message = `Upload image: ${filename}`;
      const result = await this.saveFile(filePath, fileContent, message);

      console.log(`✅ Image uploadée: ${filename}`);

      return {
        success: true,
        filename,
        path: filePath,
        url: `/${sitePath.replace("public/", "")}/${filename}`,
        result,
      };
    } catch (error) {
      console.error("Erreur upload image:", error);
      throw error;
    }
  }

  // Convertir un fichier en base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Tester la connexion GitHub
  async testConnection() {
    try {
      console.log(`🔗 Test connexion GitHub: ${this.repo}`);

      const response = await fetch(`${this.baseUrl}/repos/${this.repo}`, {
        headers: this.headers,
      });

      if (response.ok) {
        const repoData = await response.json();
        console.log(`✅ Connexion GitHub OK: ${repoData.full_name}`);

        return {
          success: true,
          repo: repoData.full_name,
          private: repoData.private,
          lastPush: repoData.pushed_at,
        };
      }

      console.error(`❌ Erreur connexion GitHub: ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    } catch (error) {
      console.error("❌ Erreur test connexion:", error);
      return {
        success: false,
        error: error?.message || "Erreur inconnue",
      };
    }
  }
}
