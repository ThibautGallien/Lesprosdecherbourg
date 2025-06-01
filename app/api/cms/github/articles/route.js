// app/api/cms/github/articles/route.js
import { NextResponse } from "next/server";

// ✅ GET existant (garde tel quel)
export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/content/articles?ref=main`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// ✅ POST - AJOUTER cette fonction
export async function POST(request) {
  try {
    console.log(
      "📤 POST /api/cms/github/articles - Redirection vers API principale"
    );

    const body = await request.json();
    console.log("📊 Body reçu:", body);

    // 🔧 CORRECTION : Le CMS envoie directement l'article, pas { siteId, article }
    const articleData = body; // L'article complet

    // 🎯 Récupérer le siteId depuis les query params ou headers
    const { searchParams } = new URL(request.url);
    let siteId = searchParams.get("siteId");

    // Si pas dans l'URL, essayer de le déduire de la catégorie ou utiliser default
    if (!siteId) {
      // Pour Dormesia, on peut détecter avec les catégories
      if (
        articleData.category === "science-sommeil" ||
        articleData.category === "conseils-sommeil" ||
        articleData.category === "produits-naturels"
      ) {
        siteId = "dormesia";
      } else {
        siteId = "les-pros-cherbourg"; // Default
      }
    }

    console.log(`🎯 Site détecté: ${siteId}`);

    // ✅ Redirection vers ton API existante
    const apiUrl = new URL("/api/cms/github", request.url);
    apiUrl.searchParams.set("action", "article");
    apiUrl.searchParams.set("siteId", siteId);

    console.log(`🔄 Redirection vers: ${apiUrl}`);

    // Appel de ton API existante
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          request.headers.get("authorization") ||
          `Bearer ${process.env.CMS_API_KEY || "demo-key"}`,
      },
      body: JSON.stringify(articleData), // L'article complet
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur API principale:", result);
      return NextResponse.json(result, { status: response.status });
    }

    console.log("✅ Article sauvegardé via API principale");
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur POST articles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Pour modifications
export async function PUT(request) {
  try {
    console.log(
      "📝 PUT /api/cms/github/articles - Redirection vers API principale"
    );

    const body = await request.json();
    const { siteId, article, slug } = body;

    if (!siteId || !slug) {
      return NextResponse.json(
        { error: "siteId et slug requis" },
        { status: 400 }
      );
    }

    const apiUrl = new URL("/api/cms/github", request.url);
    apiUrl.searchParams.set("action", "article");
    apiUrl.searchParams.set("siteId", siteId);
    apiUrl.searchParams.set("slug", slug);

    console.log(`🔄 Redirection PUT vers: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          request.headers.get("authorization") ||
          `Bearer ${process.env.CMS_API_KEY || "demo-key"}`,
      },
      body: JSON.stringify(article),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    console.log("✅ Article modifié via API principale");
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur PUT article:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Pour suppression
export async function DELETE(request) {
  try {
    console.log(
      "🗑️ DELETE /api/cms/github/articles - Redirection vers API principale"
    );

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const path = searchParams.get("path");

    if (!siteId || !path) {
      return NextResponse.json(
        { error: "siteId et path requis" },
        { status: 400 }
      );
    }

    const apiUrl = new URL("/api/cms/github", request.url);
    apiUrl.searchParams.set("action", "article");
    apiUrl.searchParams.set("siteId", siteId);
    apiUrl.searchParams.set("path", path);

    console.log(`🔄 Redirection DELETE vers: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization:
          request.headers.get("authorization") ||
          `Bearer ${process.env.CMS_API_KEY || "demo-key"}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    console.log("✅ Article supprimé via API principale");
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erreur DELETE article:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
