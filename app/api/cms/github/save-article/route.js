// app/api/cms/github/save-article/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const articleData = await request.json();

    // Validation des données
    if (!articleData.title || !articleData.slug || !articleData.content) {
      return NextResponse.json(
        { error: "Données d'article manquantes" },
        { status: 400 }
      );
    }

    // Construction du contenu Markdown avec front matter
    const frontMatter = `---
title: "${articleData.title}"
slug: "${articleData.slug}"
excerpt: "${articleData.excerpt || ""}"
category: "${articleData.category || "non-categorise"}"
publishedAt: "${articleData.publishedAt || new Date().toISOString()}"
draft: ${articleData.draft || false}
author: "${articleData.author || "Admin"}"
tags: [${
      Array.isArray(articleData.tags)
        ? articleData.tags.map((tag) => `"${tag}"`).join(", ")
        : ""
    }]
---

${articleData.content}`;

    // Encoder en base64 pour GitHub
    const encodedContent = Buffer.from(frontMatter, "utf8").toString("base64");

    const filename = `${articleData.slug}.md`;
    const path = `content/articles/${filename}`;

    console.log("🚀 Sauvegarde article:", articleData.title);
    console.log("📁 Chemin:", path);

    // Vérifier si l'article existe déjà (pour update)
    let sha = null;
    let isUpdate = false;

    try {
      const existingResponse = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}?ref=main`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (existingResponse.ok) {
        const existingData = await existingResponse.json();
        sha = existingData.sha;
        isUpdate = true;
        console.log("📝 Mise à jour d'un article existant");
      }
    } catch (error) {
      console.log("📄 Création d'un nouvel article");
    }

    // Sauvegarder sur GitHub
    const commitData = {
      message: isUpdate
        ? `📝 Mise à jour: ${articleData.title}`
        : `✨ Nouvel article: ${articleData.title}`,
      content: encodedContent,
      branch: "main",
    };

    if (sha) {
      commitData.sha = sha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commitData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur GitHub:", errorData);
      throw new Error(
        `Erreur GitHub: ${response.status} - ${errorData.message}`
      );
    }

    const result = await response.json();
    console.log("✅ Article sauvegardé avec succès");

    return NextResponse.json({
      success: true,
      message: isUpdate ? "Article mis à jour" : "Article créé",
      data: result,
    });
  } catch (error) {
    console.error("💥 Erreur sauvegarde article:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la sauvegarde",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
