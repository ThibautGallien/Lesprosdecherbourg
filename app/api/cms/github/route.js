// app/api/cms/github/route.js
import { NextResponse } from "next/server";
import { GitHubAPI } from "../../../../lib/github";
import { getSiteConfig } from "../../../../config/sites";

// Vérification d'authentification basique
function checkAuth(request) {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CMS_API_KEY || "demo-key"}`;

  if (!authHeader || authHeader !== expectedAuth) {
    return false;
  }
  return true;
}

// GET - Récupérer des données
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const siteId = searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "Site ID manquant" }, { status: 400 });
  }

  const siteConfig = getSiteConfig(siteId);
  if (!siteConfig) {
    return NextResponse.json({ error: "Site non trouvé" }, { status: 404 });
  }

  const github = new GitHubAPI(siteConfig.repo, siteConfig.branch);

  try {
    switch (action) {
      case "articles":
        const articles = await github.getArticles(siteConfig);
        return NextResponse.json({ articles });

      case "article":
        const slug = searchParams.get("slug");
        if (!slug) {
          return NextResponse.json({ error: "Slug manquant" }, { status: 400 });
        }

        const articlePath = `${siteConfig.content.articles.folder}/${slug}.md`;
        const articleContent = await github.getFileContent(articlePath);

        if (!articleContent) {
          return NextResponse.json(
            { error: "Article non trouvé" },
            { status: 404 }
          );
        }

        const { frontMatter, body } = github.parseFrontMatter(
          articleContent.content
        );
        return NextResponse.json({
          article: {
            ...frontMatter,
            body,
            path: articlePath,
            sha: articleContent.sha,
          },
        });

      case "test":
        const testResult = await github.testConnection();
        return NextResponse.json({ connection: testResult });

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur API GitHub:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// POST - Créer des données
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const siteId = searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "Site ID manquant" }, { status: 400 });
  }

  const siteConfig = getSiteConfig(siteId);
  if (!siteConfig) {
    return NextResponse.json({ error: "Site non trouvé" }, { status: 404 });
  }

  const github = new GitHubAPI(siteConfig.repo, siteConfig.branch);

  try {
    const body = await request.json();

    switch (action) {
      case "article":
        const articleData = body;

        // Validation basique
        if (!articleData.title || !articleData.slug) {
          return NextResponse.json(
            {
              error: "Données manquantes",
              required: ["title", "slug"],
            },
            { status: 400 }
          );
        }

        const result = await github.saveArticle(articleData, siteConfig, false);
        return NextResponse.json({
          success: true,
          message: "Article créé avec succès",
          article: result,
        });

      case "upload":
        // Gestion des uploads d'images
        const { file, filename } = body;

        if (!file || !filename) {
          return NextResponse.json(
            { error: "Fichier ou nom manquant" },
            { status: 400 }
          );
        }

        // Simulation d'upload - à adapter selon vos besoins
        const uploadPath = `${siteConfig.media.folder}/${filename}`;
        const uploadResult = await github.saveFile(
          uploadPath,
          file,
          `Upload image: ${filename}`
        );

        return NextResponse.json({
          success: true,
          url: `${siteConfig.media.publicPath}/${filename}`,
          result: uploadResult,
        });

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur API GitHub POST:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour des données
export async function PUT(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const siteId = searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "Site ID manquant" }, { status: 400 });
  }

  const siteConfig = getSiteConfig(siteId);
  if (!siteConfig) {
    return NextResponse.json({ error: "Site non trouvé" }, { status: 404 });
  }

  const github = new GitHubAPI(siteConfig.repo, siteConfig.branch);

  try {
    const body = await request.json();

    switch (action) {
      case "article":
        const slug = searchParams.get("slug");
        const articleData = body;

        if (!slug) {
          return NextResponse.json({ error: "Slug manquant" }, { status: 400 });
        }

        if (!articleData.title) {
          return NextResponse.json(
            { error: "Titre manquant" },
            { status: 400 }
          );
        }

        const result = await github.saveArticle(articleData, siteConfig, true);
        return NextResponse.json({
          success: true,
          message: "Article mis à jour avec succès",
          article: result,
        });

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur API GitHub PUT:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer des données
export async function DELETE(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const siteId = searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "Site ID manquant" }, { status: 400 });
  }

  const siteConfig = getSiteConfig(siteId);
  if (!siteConfig) {
    return NextResponse.json({ error: "Site non trouvé" }, { status: 404 });
  }

  const github = new GitHubAPI(siteConfig.repo, siteConfig.branch);

  try {
    switch (action) {
      case "article":
        const path = searchParams.get("path");

        if (!path) {
          return NextResponse.json(
            { error: "Chemin du fichier manquant" },
            { status: 400 }
          );
        }

        await github.deleteArticle(path);
        return NextResponse.json({
          success: true,
          message: "Article supprimé avec succès",
        });

      default:
        return NextResponse.json(
          { error: "Action non reconnue" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur API GitHub DELETE:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
