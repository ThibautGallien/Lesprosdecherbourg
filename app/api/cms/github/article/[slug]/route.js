// app/api/cms/github/article/[slug]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // ✅ CORRECTION: Await params avant utilisation
  const { slug } = await params;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/content/articles/${slug}.md?ref=main`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Article non trouvé" },
          { status: 404 }
        );
      }
      throw new Error(`Erreur GitHub: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur récupération article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}
