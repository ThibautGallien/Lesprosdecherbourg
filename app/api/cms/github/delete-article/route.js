// app/api/cms/github/delete-article/route.js
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const title = searchParams.get("title");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug de l'article manquant" },
        { status: 400 }
      );
    }

    const filename = `${slug}.md`;
    const path = `content/articles/${filename}`;

    console.log("🗑️ Suppression article:", title || slug);
    console.log("📁 Chemin:", path);

    // Récupérer les infos du fichier pour obtenir le SHA
    const fileResponse = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}?ref=main`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!fileResponse.ok) {
      if (fileResponse.status === 404) {
        return NextResponse.json(
          { error: "Article non trouvé" },
          { status: 404 }
        );
      }
      throw new Error(`Erreur GitHub: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // Supprimer le fichier
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🗑️ Suppression: ${title || slug}`,
          sha: sha,
          branch: "main",
        }),
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error("❌ Erreur suppression GitHub:", errorData);
      throw new Error(
        `Erreur GitHub: ${deleteResponse.status} - ${errorData.message}`
      );
    }

    const result = await deleteResponse.json();
    console.log("✅ Article supprimé avec succès");

    return NextResponse.json({
      success: true,
      message: "Article supprimé avec succès",
      data: result,
    });
  } catch (error) {
    console.error("💥 Erreur suppression article:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la suppression",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
